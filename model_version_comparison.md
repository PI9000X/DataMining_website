# Research model versions

Agriculture & Climate Resilience · ICT324 · prepared 18 November 2026.

Original M3/V1 → Global V2 → Global V3 → Southeast Asian case study.

The unchanged question is: **How do unusually high temperatures and low rainfall relate to crop yield variability, and which selected crops exhibit the greatest yield stability?** The global wheat/rice/maize study remains primary.

## V1 / original Milestone 3

The verified merged input has 22,660 crop records across 173 countries/territories. It joins national crop yields from FAO and supplemental providers, processed by OWID, with ERA5/Copernicus-derived annual climate. It is not crop-season weather. The original anomaly target is `100 × (yield − earlier country/crop linear expected yield) / expected yield`, requiring expectation above 0.1 t/ha and sufficient earlier history.

Training is 1961–2015 (18,914 eligible rows); the original final test is 2016–2024 (3,370 rows). Earlier chronological validation selected Linear Regression by observation-weighted MAE. All original final-test results are retained; no later model was selected or tested anew on those years.

| model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- |
| zero_baseline | 3370 | 22.6379 | 36.8634 | -0.0195 |
| linear_regression | 3370 | 22.6150 | 36.9104 | -0.0221 |
| decision_tree | 3370 | 22.6683 | 36.9044 | -0.0217 |
| random_forest | 3370 | 22.6989 | 36.8675 | -0.0197 |

MAE/RMSE here use conventional anomaly percentage points. The zero-anomaly baseline predicts the historical trend; Linear Regression, Decision Tree and Random Forest compare country/crop categories and annual climate anomalies. Negative R² shows weak squared-error performance relative to the evaluation-mean reference. Long-trend extrapolation, very small denominators and coarse climate measurement limit interpretation.

The saved original model metadata and implementation specify **100** forest trees, depth 6, minimum leaf 20, max_features 0.8 and seed 324. The selected tree uses depth 3 / minimum leaf 40. An archived master report says 200 trees; that is inconsistent with the model metadata and code. We preserve the original report and use the verified metadata, without changing any fitted model or result.

- Training entry (`main_m3.py`, in the complete local research archive), [training module](src/models/train_models.py), preprocessing/settings (`src/models/prepare_features.py`, in the complete local research archive), [model metadata](saved_models/model_metadata_m3.json).
- [Overall scores](results/tables/m3/model_comparison.csv), crop scores (`results/tables/m3/model_comparison_by_crop.csv`, in the complete local research archive), year scores (`results/tables/m3/model_comparison_by_year.csv`, in the complete local research archive).
- [Findings](results/reports/m3/milestone3_summary.md), verification (`results/reports/m3/verification_summary.md`, in the complete local research archive), [figure](assets/research/m3-models.png).

**Actually serialized:** four trusted-local `.joblib` pipelines and one climate/yield-reference bundle exist in `saved_models/`. They are small enough for the proposed publication and are original, unchanged bytes. Only load trusted joblib files using the saved environment. No binary executes in the browser demo.

## Global V2

V2 uses the same verified input, retaining historical development only. It compares full-history linear, recent-20-year linear and previous-five-calendar-year yield references. Earlier references are frozen through each outcome block; forward-only calibration targets and training-only preprocessing make comparisons fairer.

All 33 approaches share 6,331 eligible validation observations from 1996–2002, 2003–2009 and 2010–2015. The common target is `100 × (yield − earlier full-history expected yield) / S`, where `S = max(0.5 t/ha, earlier country/crop median yield)`. Models predict a correction to their reference; every prediction is converted to the same target. Genuine source measurements are not clipped or imputed. Five unsupported conventional-percentage denominators remain in the primary historical-scale analysis.

| model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- |
| full | 6331 | 31.8493 | 53.8648 | -0.0288 |
| recent20 | 6331 | 29.6123 | 48.5737 | 0.1634 |
| mean5 | 6331 | 27.8496 | 47.3479 | 0.2051 |
| mean5_forest_none | 6331 | 26.5051 | 45.2078 | 0.2753 |
| mean5_forest_basic | 6331 | 26.6986 | 45.5062 | 0.2657 |
| mean5_forest_nonlinear | 6331 | 26.6352 | 45.2473 | 0.2740 |

MAE/RMSE are historical-yield-scale points. The three references, three median-bias corrections and 27 algorithm/reference/feature combinations include Linear Regression, Decision Tree and Random Forest. Fixed forests use 80 trees, depth 6, minimum leaf 20 and seed 324. Basic climate adds standardized temperature and precipitation anomalies; nonlinear features add squares and interactions. No large search was performed. Recent yield history and no-climate country/crop correction improve the benchmark; annual climate does not consistently add predictive value.

- [Training/evaluation source](results/global_improvement_v2/code/run_experiment.py), independent verifier (`results/global_improvement_v2/code/verify_outputs.py`, in the complete local research archive), candidate definitions (`results/global_improvement_v2/model_definitions.json`, in the complete local research archive).
- [All saved score rows](results/global_improvement_v2/tables/scores.csv), folds (`results/global_improvement_v2/tables/folds.csv`, in the complete local research archive), [findings](results/global_improvement_v2/comparison_report.md), verification (`results/global_improvement_v2/verification.json`, in the complete local research archive), independent audit (`results/global_improvement_v2/independent_audit.json`, in the complete local research archive), [reference figure](assets/research/v2-references.png).

**No serialized V2 model was found.** Source fits evaluation models in memory and saves predictions/results; do not invent a binary. Reproduction requires the exact preserved global/climate input snapshots and saved environment. Full training/prediction dumps and raw data are excluded from this minimal public package. Source scripts are included; a data-free clone cannot reproduce training end to end by itself.

## Global V3

Four fixed approaches retain the V2 five-year reference, common target and forest architecture. Their saved predictions match selected V2 predictions on exactly the same 6,331 rows. This is a reproducibility check and further analysis, **not an independent new predictive test**.

| model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- |
| A_reference | 6331 | 27.8496 | 47.3479 | 0.2051 |
| B_no_climate | 6331 | 26.5051 | 45.2078 | 0.2753 |
| C_climate | 6331 | 26.6986 | 45.5062 | 0.2657 |
| D_interactions | 6331 | 26.6352 | 45.2473 | 0.2740 |

The no-climate correction has the lowest aggregate MAE among these four. V3 adds paired error differences, country/period and influential-observation checks, Pearson/Spearman associations, country/year-adjusted climate associations and matched crop stability. Weak/uncertain annual associations do not show that climate is unimportant. Rice has the lowest numerical matched overall variability, rice–wheat separation is uncertain, and combined hot/dry samples do not support a reliable resilience ranking.

- Protocol (`results/global_improvement_v3/verification/protocol.json`, in the complete local research archive), [source](results/global_improvement_v3/code/main.py), prediction code (`results/global_improvement_v3/code/prediction.py`, in the complete local research archive), [scores](results/global_improvement_v3/tables/prediction_scores.csv).
- [Findings](results/global_improvement_v3/reports/global_v3_findings.md), verification (`results/global_improvement_v3/verification/verification_summary.md`, in the complete local research archive), associations (`results/global_improvement_v3/tables/association_regression.csv`, in the complete local research archive), stability (`results/global_improvement_v3/tables/stability_summary.csv`, in the complete local research archive).

**No serialized global V3 model was found.** The proposed package includes its actual source/configuration and selected results. V3 depends on the V2 source and shared `src` helpers. The static demo reads the verified exported saved predictions; it does not require or imply a saved V3 binary.

## Secondary regional case study

Thailand, Myanmar, Cambodia, Laos and Vietnam preserve 743 enriched crop records. Observed fertilizer supports a separate exploratory experiment; irrigation is too sparse historically. A smaller fixed model set corrects the original forest's early stump limitation. Rice/maize Ridge + fertilizer has lowest observed MAE 24.0488, but incremental fertilizer benefit depends heavily on Vietnam and the earliest period. It is not a universally preferred model. The demo uses only the five-country matched rice/maize cohort (194 crop observations on 97 national country-years); it does not silently combine wheat or global comparisons.

Scores (`results/southeast_asia_small_sample_v1/model_comparison.csv`, in the complete local research archive) · protocol (`results/southeast_asia_small_sample_v1/protocol.md`, in the complete local research archive) · verification (`results/southeast_asia_small_sample_v1/verification/verification_results.md`, in the complete local research archive).

## What can and cannot be compared

M3 and V2/V3 have different targets and evaluation samples. Do not rank their numerical MAE/RMSE/R² as a direct before/after accuracy gain. Regional scores have another sample and cohort. Within a controlled comparison, all candidates must use the same eligible observations, target, reference scale and chronology. R² is not percentage prediction accuracy. Same-year weather and retrospectively revised fertilizer describe observed conditions, not necessarily information available before harvest. No predictive result establishes a causal fertilizer or climate effect.

## Reproduction and publication boundary

The supplied scripts are original evidence, not modified to run over the existing results. Do not rerun the M3 entry in this research workspace: it writes its configured output paths. Reproduce in a separate copy with the exact licensed input snapshots and saved Python/package versions. V2 supports an unused `--output-dir`; V3 requires an unused sibling output layout and V2 helpers. No model was retrained during preparation. [Inventory](model_artifact_inventory.md) identifies every included file and its remote status. Full source datasets remain local because their vintages/licences must be respected.


Website V4 note: this static export links the selected source/table files actually included in its publication manifest. Other named research paths identify the complete local archive; full training inputs and model binaries are not redistributed by this website update.
