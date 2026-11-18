"""Tune only on expanding historical windows; refit once before final evaluation."""
import json
import platform
from importlib.metadata import version

import joblib
import numpy as np
import pandas as pd
import sklearn

from ..analysis.climate_anomalies import prepare_split, apply_references
from ..m3_config import (TABLES, MODELS, REPORTS, FEATURES, TARGET, VALIDATION_WINDOWS,
                         TRAIN_END, TEST_START, TEST_END, READY, SEED)
from ..m3_utils import save_json
from .prepare_features import build_pipeline, MODEL_NAMES
from .evaluate_models import metrics

CANDIDATES = {
    "zero_baseline": [{}], "linear_regression": [{}],
    "decision_tree": [{"max_depth": depth, "min_samples_leaf": 40} for depth in [3, 6, 10]],
    "random_forest": [{"max_depth": depth, "min_samples_leaf": 20} for depth in [6, 12, None]],
}


def tune_models(data, climate):
    """Refit yield targets, climate references, encoders, and scalers inside each fold."""
    results, fold_summaries = [], []
    for fold, (cutoff, start, end) in enumerate(VALIDATION_WINDOWS, start=1):
        train, validation, refs, trends = prepare_split(data, climate, cutoff, start, end)
        print(f"Validation {fold}: train {train.year.min()}-{cutoff} ({len(train):,}); "
              f"validate {start}-{end} ({len(validation):,})", flush=True)
        refs.to_csv(TABLES / f"validation_{fold}_climate_references.csv", index=False)
        trends.to_csv(TABLES / f"validation_{fold}_yield_trends.csv", index=False)
        validation[["record_id", "year", TARGET, "expected_yield_t_ha"]].to_csv(
            TABLES / f"validation_{fold}_targets.csv", index=False)
        fold_summaries.append(dict(fold=fold, train_start=int(train.year.min()), train_end=cutoff,
                                  validation_start=start, validation_end=end, n_train=len(train),
                                  n_validation=len(validation), max_trend_fit_year=int(trends.trend_last_year.max())))
        for name, candidates in CANDIDATES.items():
            for candidate_id, settings in enumerate(candidates):
                pipeline = build_pipeline(name, settings)
                pipeline.fit(train[FEATURES], train[TARGET])
                score = metrics(validation[TARGET], pipeline.predict(validation[FEATURES]))
                results.append(dict(model=name, candidate=candidate_id, settings=json.dumps(settings, sort_keys=True),
                                    fold=fold, **score))
    details = pd.DataFrame(results)
    details.to_csv(TABLES / "validation_scores.csv", index=False)
    # Weight fold MAEs by observations. No held-out 2016-2024 scores enter selection.
    details["absolute_error_sum"] = details.mae * details.n
    summary = details.groupby(["model", "candidate", "settings"], as_index=False).agg(
        absolute_error_sum=("absolute_error_sum", "sum"), n=("n", "sum"))
    summary["weighted_validation_mae"] = summary.absolute_error_sum / summary.n
    summary.to_csv(TABLES / "validation_selection.csv", index=False)
    selected = {}
    validation_mae = {}
    for name in MODEL_NAMES:
        best = summary[summary.model == name].sort_values(["weighted_validation_mae", "candidate"]).iloc[0]
        selected[name] = json.loads(best.settings)
        validation_mae[name] = float(best.weighted_validation_mae)
    selected_model = min(validation_mae, key=validation_mae.get)
    decision = dict(selection_metric="observation-weighted validation MAE", settings=selected,
                    validation_mae=validation_mae, validation_selected_model=selected_model,
                    folds=fold_summaries, random_seed=SEED)
    save_json(REPORTS / "model_selection.json", decision)
    return decision


def train_final_models(data, climate, decision):
    """Fit final models using 1961-2015 only, then serialize local artifacts."""
    train, test, refs, trends = prepare_split(data, climate, TRAIN_END, TEST_START, TEST_END)
    ready = apply_references(data, refs, trends)
    ready.to_csv(READY, index=False)
    refs.to_csv(TABLES / "climate_references.csv", index=False)
    trends.to_csv(TABLES / "yield_trends.csv", index=False)
    ready.groupby(["split", "crop", "exclusion_reason"], dropna=False).size().rename("n").to_csv(
        TABLES / "anomaly_eligibility.csv")
    ready[~ready.eligible].to_csv(TABLES / "excluded_anomaly_records.csv", index=False)
    train[["record_id", "year", "crop"]].to_csv(TABLES / "training_records.csv", index=False)
    test[["record_id", "year", "crop"]].to_csv(TABLES / "test_records.csv", index=False)
    models, settings = {}, {}
    for name in MODEL_NAMES:
        pipeline = build_pipeline(name, decision["settings"][name])
        pipeline.fit(train[FEATURES], train[TARGET])
        joblib.dump(pipeline, MODELS / f"{name}_m3.joblib", compress=3)
        models[name] = pipeline
        settings[name] = pipeline.named_steps["regressor"].get_params()
    # This companion artifact is required to turn measured weather into model inputs.
    joblib.dump(dict(climate_references=refs, yield_trends=trends, fit_cutoff=TRAIN_END),
                MODELS / "anomaly_references_m3.joblib", compress=3)
    metadata = dict(features=FEATURES, target=TARGET, target_unit="percentage points of detrended yield anomaly",
        preprocessing="StandardScaler for two numeric features; OneHotEncoder for crop and iso3; fit on training only",
        country_justification="Known-country historical panel prediction; country is a categorical identifier, not an ordinal number",
        intended_use="Contemporaneous weather-conditioned anomaly estimation for known countries; not a preseason forecast",
        unknown_categories="OneHotEncoder(handle_unknown='ignore'); unsupported yield histories remain ineligible",
        climate_reference=dict(start=1961, end=1990, minimum_years=20, precipitation_minimum_mm=1.0),
        yield_trend=dict(method="OLS linear yield versus year-1961 separately for each iso3/crop",
                         minimum_years=20, minimum_expected_yield_t_ha=0.1, fit_end=TRAIN_END),
        training=dict(start=int(train.year.min()), end=int(train.year.max()), n=len(train)),
        testing=dict(start=int(test.year.min()), end=int(test.year.max()), n=len(test)),
        versions={p: version(p) for p in ["numpy", "pandas", "scipy", "scikit-learn", "matplotlib", "joblib"]},
        python=platform.python_version(), scikit_learn=sklearn.__version__, random_seed=SEED,
        model_settings=settings, selection=decision)
    save_json(MODELS / "model_metadata_m3.json", metadata)
    (MODELS / "README_m3.md").write_text(
        "# Local Milestone 3 artifacts\n\nEach *_m3.joblib pipeline accepts the four prepared columns in "
        "model_metadata_m3.json and returns a percentage yield anomaly. anomaly_references_m3.joblib "
        "contains the training-only climate and yield references. Run predict_m3.py for a reproducible "
        "local prediction example. Use the recorded Python/package versions. Only load trusted local joblib files.\n",
        encoding="utf-8")
    return models, train, test, ready, refs, trends, metadata
