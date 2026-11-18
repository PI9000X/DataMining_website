"""Controlled global V2 historical experiment; no writes outside its output folder.

From project root: .\.python\python.exe results/global_improvement_v2/code/run_experiment.py
Supply --output-dir with a new workspace directory to reproduce without overwriting.
"""
import argparse
import json
import math
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))
from src.research_review import snapshot
from src.m3_utils import save_json

REFERENCES = ['full', 'recent20', 'mean5']
WINDOWS = [(1995, 1996, 2002), (2002, 2003, 2009), (2009, 2010, 2015)]
SEED = 324


def require_history(frame):
    if frame.empty or frame.year.max() > 2015:
        raise ValueError('Development accepts historical years through 2015 only.')


def fit_yield_references(history, cutoff):
    """Fit all three references on earlier measurements, never evaluation yields."""
    require_history(history)
    rows = []
    for (iso3, crop), group in history[history.year.le(cutoff)].groupby(['iso3', 'crop']):
        recent = group[group.year.ge(cutoff-19)]
        last5 = group[group.year.ge(cutoff-4)]
        if group.year.nunique() < 20 or recent.year.nunique() < 15 or last5.year.nunique() < 3:
            continue
        full_slope, full_intercept = np.polyfit(group.year-1961, group.yield_t_ha, 1)
        recent_slope, recent_intercept = np.polyfit(recent.year-1961, recent.yield_t_ha, 1)
        rows.append(dict(iso3=iso3, crop=crop, cutoff=cutoff, max_fit_year=int(group.year.max()),
            full_slope=full_slope, full_intercept=full_intercept, recent_slope=recent_slope,
            recent_intercept=recent_intercept, mean5=last5.yield_t_ha.mean(),
            historical_median=group.yield_t_ha.median(), n_full=len(group), n_recent=len(recent), n_last5=len(last5)))
    return pd.DataFrame(rows)


def attach_references(frame, parameters):
    result = frame.merge(parameters, on=['iso3', 'crop'], validate='many_to_one')
    result['full'] = result.full_intercept + result.full_slope*(result.year-1961)
    result['recent20'] = result.recent_intercept + result.recent_slope*(result.year-1961)
    # Stabilization changes normalization, not measurements. Same scale for every model/ref.
    result['scale'] = result.historical_median.clip(lower=.5)
    return result


def climate_features(data, climate):
    """Fixed historical climatology with sufficient observations and nonzero SD."""
    require_history(data)
    require_history(climate)
    stats = climate[climate.year.between(1961, 1990)].groupby('iso3').agg(
        t_mean=('temperature_c', 'mean'), t_sd=('temperature_c', 'std'),
        p_mean=('precipitation_mm', 'mean'), t_n=('temperature_c', 'count'), p_n=('precipitation_mm', 'count'))
    result = data.merge(stats, on='iso3', how='left', validate='many_to_one')
    result['climate_eligible'] = result.t_n.ge(20) & result.p_n.ge(20) & result.t_sd.gt(1e-8) & result.p_mean.gt(1)
    result['temperature_z'] = (result.temperature_c-result.t_mean)/result.t_sd
    result['precipitation_pct'] = 100*(result.precipitation_mm/result.p_mean-1)
    result['temperature_squared'] = result.temperature_z**2
    result['precipitation_squared'] = (result.precipitation_pct/100)**2
    result['hot_dry'] = result.temperature_z.clip(lower=0)*(-result.precipitation_pct/100).clip(lower=0)
    for crop in ['wheat', 'rice', 'maize']:
        for column in ['temperature_z', 'precipitation_pct', 'hot_dry']:
            result[crop+'_'+column] = result[column]*result.crop.eq(crop)
    return result


def feature_columns(level):
    if level == 'none':
        return []
    basic = ['temperature_z', 'precipitation_pct']
    if level == 'basic':
        return basic
    return basic + ['temperature_squared', 'precipitation_squared', 'hot_dry'] + [
        crop+'_'+c for crop in ['wheat', 'rice', 'maize'] for c in ['temperature_z', 'precipitation_pct', 'hot_dry']]


def build_model(algorithm, level):
    numeric = feature_columns(level)
    transformers = [('categories', OneHotEncoder(handle_unknown='ignore', drop='first', sparse_output=False), ['iso3', 'crop'])]
    if numeric:
        transformers.append(('numeric', StandardScaler(), numeric))
    regressors = dict(linear=lambda: LinearRegression(),
        tree=lambda: DecisionTreeRegressor(max_depth=4, min_samples_leaf=30, random_state=SEED),
        forest=lambda: RandomForestRegressor(n_estimators=80, max_depth=6, min_samples_leaf=20,
                                             max_features=.8, random_state=SEED, n_jobs=2))
    return Pipeline([('preprocess', ColumnTransformer(transformers)), ('model', regressors[algorithm]())])


def scalar_metrics(actual, predicted):
    error = np.asarray(actual)-np.asarray(predicted)
    variance = np.sum((np.asarray(actual)-np.mean(actual))**2)
    return dict(n=len(error), mae=float(np.mean(abs(error))), rmse=float(np.sqrt(np.mean(error**2))),
                r2=float(1-np.sum(error**2)/variance) if variance > 0 else np.nan)


def rolling_training(data, cutoff):
    """Create forward-only training residuals, unlike retrospectively fitted residuals.

    Every block has its own earlier yield reference and earlier historical scale.
    The entire year's panel stays together. No validation outcome fits these refs.
    """
    pieces = []
    for start in range(1991, cutoff+1, 5):
        end = min(start+4, cutoff)
        params = fit_yield_references(data, start-1)
        block = attach_references(data[data.year.between(start, end)], params)
        block['training_block_start'] = start
        assert block.max_fit_year.lt(block.year).all()
        pieces.append(block)
    return pd.concat(pieces, ignore_index=True)


def run(output):
    if (output/'tables/predictions.csv').exists():
        raise FileExistsError('Experiment already exists: choose a new --output-dir.')
    output.mkdir(parents=True, exist_ok=True)
    for directory in ['tables', 'charts']:
        (output/directory).mkdir(exist_ok=True)
    before_path = output/'preservation_before.json'
    before = json.loads(before_path.read_text()) if before_path.exists() else snapshot()
    if not before_path.exists():
        save_json(before_path, before)
    # Never open M3 predictions/models or the analysis-ready file. Only verified inputs.
    original = pd.read_csv(ROOT/'data/processed/merged_crop_climate.csv')
    data = original[original.year.le(2015)].copy()
    weather = pd.read_csv(ROOT/'data/processed/cleaned_climate_data.csv')
    weather = weather[weather.year.le(2015)].copy()
    data['record_id'] = data.iso3+'|'+data.crop+'|'+data.year.astype(str)
    data = climate_features(data, weather)
    ledger, frames, exclusions, checks = [], [], [], []
    configs = {}
    for fold, (cutoff, start, end) in enumerate(WINDOWS, 1):
        params = fit_yield_references(data, cutoff)
        params.to_csv(output/f'tables/references_fold_{fold}.csv', index=False)
        train = rolling_training(data, cutoff)
        valid = attach_references(data[data.year.between(start, end)], params)
        candidates = data[data.year.between(start, end)]
        eligible_ids = set(valid.loc[valid.climate_eligible, 'record_id'])
        exclusions.extend([dict(fold=fold, record_id=row.record_id, reason=('inadequate_climate_reference' if not row.climate_eligible
            else 'insufficient_pre_cutoff_yield_history')) for row in candidates.itertuples() if row.record_id not in eligible_ids])
        train = train[train.climate_eligible].copy()
        valid = valid[valid.climate_eligible].copy()
        train[['record_id', 'year', 'cutoff', 'max_fit_year', 'training_block_start', 'scale']+REFERENCES].to_csv(
            output/f'tables/forward_training_fold_{fold}.csv', index=False)
        assert train.year.max() <= cutoff < valid.year.min() and valid.year.max() <= 2015
        ledger.append(dict(fold=fold, train_first=int(train.year.min()), train_last=int(train.year.max()),
            n_train=len(train), validation_first=start, validation_last=end, n_validation=len(valid), countries=valid.iso3.nunique()))
        pred = valid[['record_id', 'iso3', 'country', 'crop', 'year', 'yield_t_ha', 'scale', 'historical_median']+REFERENCES].copy()
        pred['fold'] = fold
        pred['target'] = 100*(pred.yield_t_ha-pred.full)/pred.scale
        for reference in REFERENCES:
            configs[reference] = dict(reference=reference, algorithm='reference', features='none', comparator='full')
            residual = 100*(train.yield_t_ha-train[reference])/train.scale
            medians = train.assign(residual=residual).groupby(['iso3', 'crop']).residual.median()
            crop_medians = train.assign(residual=residual).groupby('crop').residual.median()
            offsets = [medians.get((r.iso3, r.crop), crop_medians.get(r.crop, 0)) for r in valid.itertuples()]
            name = reference+'_median_bias'
            pred[name] = valid[reference].to_numpy()+valid.scale.to_numpy()*np.asarray(offsets)/100
            configs[name] = dict(reference=reference, algorithm='median_bias', features='none', comparator=reference)
            for algorithm in ['linear', 'tree', 'forest']:
                for level in ['none', 'basic', 'nonlinear']:
                    name = f'{reference}_{algorithm}_{level}'
                    model = build_model(algorithm, level)
                    columns = ['iso3', 'crop']+feature_columns(level)
                    model.fit(train[columns], residual)
                    predicted = model.predict(valid[columns])
                    pred[name] = valid[reference].to_numpy()+valid.scale.to_numpy()*predicted/100
                    comparator = reference if level == 'none' else f'{reference}_{algorithm}_none'
                    configs[name] = dict(reference=reference, algorithm=algorithm, features=level, comparator=comparator)
                    if level != 'none':
                        scaler = model.named_steps['preprocess'].named_transformers_['numeric']
                        checks.append(bool(np.allclose(scaler.mean_, train[feature_columns(level)].mean()) and scaler.n_samples_seen_ == len(train)))
        frames.append(pred)
        print(f'Fold {fold}: forward training {len(train):,}; validation {start}-{end}: {len(valid):,}', flush=True)
    predictions = pd.concat(frames, ignore_index=True)
    predictions.to_csv(output/'tables/predictions.csv', index=False)
    pd.DataFrame(ledger).to_csv(output/'tables/folds.csv', index=False)
    pd.DataFrame(exclusions).to_csv(output/'tables/exclusions.csv', index=False)
    save_json(output/'model_definitions.json', configs)
    score_rows = []
    # All methods share one primary target and scale; raw-yield and conventional ratios are secondary.
    for unit in ['stable_anomaly', 'yield_t_ha', 'conventional_full_anomaly']:
        table = predictions if unit != 'conventional_full_anomaly' else predictions[predictions.full.gt(.1)]
        groups = [('overall', 'all', table)]
        groups += [('fold', str(key), g) for key, g in table.groupby('fold')]
        groups += [('crop', key, g) for key, g in table.groupby('crop')]
        groups += [('fold_crop', f'{key[0]}_{key[1]}', g) for key, g in table.groupby(['fold', 'crop'])]
        groups += [('year', str(key), g) for key, g in table.groupby('year')]
        for scope, key, group in groups:
            denominator = group.scale if unit == 'stable_anomaly' else (group.full if unit == 'conventional_full_anomaly' else 100)
            for name in configs:
                actual = (group.yield_t_ha-group.full)*100/denominator if unit != 'yield_t_ha' else group.yield_t_ha
                predicted = (group[name]-group.full)*100/denominator if unit != 'yield_t_ha' else group[name]
                score_rows.append(dict(unit=unit, scope=scope, key=key, model=name, **scalar_metrics(actual, predicted)))
    scores = pd.DataFrame(score_rows)
    scores.to_csv(output/'tables/scores.csv', index=False)
    robustness(predictions, configs, output)
    denominator_review(predictions, output)
    charts(scores, output)
    # Independent scalar metric checks, independent OLS samples, and future mutation.
    errors = []
    for name in configs:
        actual = predictions.target.tolist()
        predicted = (100*(predictions[name]-predictions.full)/predictions.scale).tolist()
        residuals = [a-b for a, b in zip(actual, predicted)]
        mean = math.fsum(actual)/len(actual)
        values = [math.fsum(abs(e) for e in residuals)/len(actual),
            math.sqrt(math.fsum(e*e for e in residuals)/len(actual)),
            1-math.fsum(e*e for e in residuals)/math.fsum((a-mean)**2 for a in actual)]
        row = scores[(scores.unit == 'stable_anomaly') & scores.scope.eq('overall') & scores.model.eq(name)].iloc[0]
        errors.append(max(abs(a-b) for a, b in zip(values, [row.mae, row.rmse, row.r2])))
    mutation = data.copy()
    mutation.loc[mutation.year.gt(1995), 'yield_t_ha'] += 10000
    immutable = fit_yield_references(data, 1995).equals(fit_yield_references(mutation, 1995))
    future_train = rolling_training(data, 1995).equals(rolling_training(mutation, 1995))
    arithmetic = []
    for fold, (cutoff, _, _) in enumerate(WINDOWS, 1):
        for row in predictions[predictions.fold.eq(fold)].groupby('crop').head(2).itertuples():
            history = data[data.iso3.eq(row.iso3) & data.crop.eq(row.crop) & data.year.le(cutoff)]
            for field, sample in [('full', history), ('recent20', history[history.year.ge(cutoff-19)])]:
                x, y = sample.year.tolist(), sample.yield_t_ha.tolist()
                xm, ym = math.fsum(x)/len(x), math.fsum(y)/len(y)
                slope = math.fsum((a-xm)*(b-ym) for a,b in zip(x,y))/math.fsum((a-xm)**2 for a in x)
                arithmetic.append(abs(ym+slope*(row.year-xm)-getattr(row, field)))
            last5 = history[history.year.ge(cutoff-4)].yield_t_ha.tolist()
            arithmetic.append(abs(math.fsum(last5)/len(last5)-row.mean5))
    current = snapshot()
    changed = [name for name, value in before.items() if current.get(name) != value]
    verification = dict(existing_files_preserved=not changed, protected_files=len(before), changed_files=changed,
        new_candidate_years_end_2015=bool(predictions.year.max() <= 2015), forward_training_isolated=bool(future_train),
        future_yields_do_not_change_references=immutable, all_scalers_training_only=all(checks),
        identical_validation_rows=bool(predictions[list(configs)].notna().all().all() and not predictions.record_id.duplicated().any()),
        max_independent_metric_error=max(errors), independent_metrics_pass=bool(max(errors) < 1e-9),
        max_independent_reference_error=max(arithmetic), independent_references_pass=bool(max(arithmetic) < 1e-9),
        no_final_holdout_evaluation=True)
    save_json(output/'verification.json', verification)
    assert not changed and immutable and future_train and all(checks) and max(errors) < 1e-9 and max(arithmetic) < 1e-9
    print(json.dumps(verification, indent=2), flush=True)


def robustness(predictions, configs, output):
    rows, countries = [], []
    for name, definition in configs.items():
        base = definition['comparator']
        d = predictions[['iso3', 'crop', 'year', 'fold']].copy()
        d['ae'] = 100*abs(predictions.yield_t_ha-predictions[name])/predictions.scale
        d['baseline_ae'] = 100*abs(predictions.yield_t_ha-predictions[base])/predictions.scale
        d['gain'] = d.baseline_ae-d.ae
        country = d.groupby(['iso3', 'crop']).agg(n=('gain','size'), mae=('ae','mean'), gain=('gain','mean'))
        countries.append(country.reset_index().assign(model=name, comparator=base))
        iso = d.groupby('iso3').agg(n=('gain','size'), gain_sum=('gain','sum'))
        leave = (d.gain.sum()-iso.gain_sum)/(len(d)-iso.n)
        squared = (100*(predictions.yield_t_ha-predictions[name])/predictions.scale)**2
        rows.append(dict(model=name, comparator=base, overall_mae=d.ae.mean(), paired_mean_mae_gain=d.gain.mean(),
            equal_country_crop_mae=country.mae.mean(), equal_country_crop_gain=country.gain.mean(),
            country_crop_win_fraction=country.gain.gt(0).mean(),
            years_with_positive_gain=int(d.groupby('year').gain.mean().gt(0).sum()), total_years=d.year.nunique(),
            crops_with_positive_gain=int(d.groupby('crop').gain.mean().gt(0).sum()),
            folds_with_positive_gain=int(d.groupby('fold').gain.mean().gt(0).sum()),
            minimum_leave_one_country_out_gain=leave.min(), maximum_leave_one_country_out_gain=leave.max(),
            top_one_percent_share_squared_error=100*squared.nlargest(int(np.ceil(.01*len(d)))).sum()/squared.sum()))
    pd.DataFrame(rows).to_csv(output/'tables/robustness.csv', index=False)
    pd.concat(countries).to_csv(output/'tables/country_crop_scores.csv', index=False)


def denominator_review(predictions, output):
    """Describe unstable ratios without removing measured extremes or altering labels."""
    rows = []
    for reference in REFERENCES:
        expected = predictions[reference]
        rows.append(dict(reference=reference, n=len(predictions), expected_nonpositive=int(expected.le(0).sum()),
            expected_at_or_below_point1=int(expected.le(.1).sum()), expected_at_or_below_point5=int(expected.le(.5).sum()),
            raw_zero_yields=int(predictions.yield_t_ha.eq(0).sum())))
    pd.DataFrame(rows).to_csv(output/'tables/denominator_audit.csv', index=False)
    table = predictions[['record_id','country','crop','year','yield_t_ha','full','scale']].copy()
    table['conventional_anomaly'] = (100*(table.yield_t_ha/table.full-1)).where(table.full.gt(.1))
    table['stable_anomaly'] = 100*(table.yield_t_ha-table.full)/table.scale
    table.loc[table.conventional_anomaly.abs().nlargest(25).index].to_csv(output/'tables/extremes.csv', index=False)
    rows = []
    # Denominator-only sensitivity on unchanged predictions: not independently refitted models.
    for floor in [.1, .5, 1.0]:
        scale = predictions.historical_median.clip(lower=floor)
        for method in REFERENCES:
            rows.append(dict(floor_t_ha=floor, reference=method,
                **scalar_metrics(100*(predictions.yield_t_ha-predictions.full)/scale,
                                 100*(predictions[method]-predictions.full)/scale)))
    pd.DataFrame(rows).to_csv(output/'tables/scale_sensitivity.csv', index=False)


def charts(scores, output):
    import os
    os.environ.setdefault('MPLCONFIGDIR', str(output/'matplotlib_cache'))
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    overall = scores[(scores.unit == 'stable_anomaly') & scores.scope.eq('overall')].sort_values('mae')
    fig, ax = plt.subplots(figsize=(12, 10))
    ax.barh(overall.model, overall.mae, color='#477e96')
    ax.invert_yaxis()
    ax.set(xlabel='MAE (training-scale yield deviation, percentage points)', title='Global V2: historical validation only (1996-2015)')
    fig.tight_layout()
    fig.savefig(output/'charts/model_mae.png', dpi=160)
    plt.close(fig)
    raw = scores[(scores.unit == 'yield_t_ha') & scores.scope.eq('fold') & scores.model.isin(REFERENCES)]
    fig, axes = plt.subplots(1, 2, figsize=(11, 4))
    for method in REFERENCES:
        g = raw[raw.model.eq(method)].sort_values('key')
        for ax, metric in zip(axes, ['mae','rmse']):
            ax.plot(g.key, g[metric], marker='o', label=method)
            ax.set(xlabel='Historical validation fold', ylabel=f'{metric.upper()} (t/ha)')
    axes[0].legend()
    fig.suptitle('Expected-yield references: identical observations; no climate predictors')
    fig.tight_layout()
    fig.savefig(output/'charts/reference_comparison.png', dpi=160)
    plt.close(fig)
    extreme = pd.read_csv(output/'tables/extremes.csv')
    fig, ax = plt.subplots(figsize=(9, 5))
    ax.scatter(extreme.conventional_anomaly, extreme.stable_anomaly)
    ax.set(xlabel='Conventional expected-yield anomaly (%)', ylabel='Training-scale deviation (pp)',
           title='Largest conventional ratios: same measurements, different normalization')
    fig.tight_layout()
    fig.savefig(output/'charts/denominator_effect.png', dpi=160)
    plt.close(fig)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output-dir', default='results/global_improvement_v2')
    args = parser.parse_args()
    try:
        destination = (ROOT/args.output_dir).resolve()
        if not destination.is_relative_to(ROOT):
            raise ValueError('Output must be inside the project workspace.')
        run(destination)
    except Exception as error:
        raise SystemExit(f'Global experiment stopped: {error}') from error
