# Global improvement V2: controlled historical comparison

Date: 13 November 2026 (Asia/Bangkok). Status: completed historical experiment; no new final-holdout evaluation.

## Recommendation in plain English

Use this stricter evaluation design as the preferred development procedure. Keep the previous-five-year mean as a stronger global no-climate benchmark, with its country/crop-only forest correction as a provisional candidate. Do **not** yet adopt a revised climate-based global model as the preferred final research model: climate features did not beat their matched no-climate alternatives on aggregate MAE. Keep M3 as the historical baseline, including its negative test R².

The research question remains: **How do unusually high temperatures and low rainfall relate to crop yield variability, and which selected crops exhibit the greatest yield stability?** Wheat, rice, maize, the global dataset, and the research topic are unchanged. No regional models or external measurements were introduced. This experiment concerns prediction/reference quality; it does not establish a new crop-resilience ranking.

## What was controlled

The same existing verified merge was read, then development was restricted to 1961–2015. Neither M3 predictions nor saved models nor the analysis-ready file were opened by the experiment. No new candidate was scored on 2016–2024. SHA256, sizes and timestamps protect all pre-existing project artifacts.

Three fixed outer windows were used. All 33 approaches predict the same 6,331 eligible observations. These are the common intersection with sufficient earlier history for all three references and usable earlier climate references. Coverage loss is saved by record ID in `tables/exclusions.csv`; eligibility never depends on a validation prediction error or an extreme observed yield.

| fold | train_first | train_last | n_train | validation_first | validation_last | n_validation | countries |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1991 | 1995 | 1570 | 1996 | 2002 | 2211 | 140 |
| 2 | 1991 | 2002 | 3785 | 2003 | 2009 | 2213 | 142 |
| 3 | 1991 | 2009 | 6006 | 2010 | 2015 | 1907 | 142 |

This is a global panel with uneven country/crop coverage, not all 173 countries in every period. Fold country counts are countries/territories. References require at least 20 historical observations overall, 15 within the previous 20 calendar years, and three within the previous five calendar years. All reference methods use this identical support. Forecasts are fixed at each block's start; recent references are not updated using yields observed inside that validation block.

## Consistent target and careful denominator treatment

Let F be the full-history line fitted before an outer validation block, and S be `max(0.5 t/ha, median earlier yield)` for that country/crop. The **primary V2 target** is `100 × (observed yield − F) / S`. Every candidate's predicted yield is converted using that exact same F and S. The full-history reference is therefore a zero-deviation baseline. Other reference methods predict a departure from F. Comparisons cannot improve simply by redefining the outcome for each model.

This is a training-scale detrended yield deviation, not the conventional percent departure from expected yield. Its errors are percentage points on that training scale. The 0.5 t/ha floor is a declared statistical stabilization choice, not an agronomic threshold. It avoids dividing by a tiny extrapolated line. No source value is replaced, winsorized, imputed, or deleted because it is extreme. Negative model/reference predictions remain visible; none are silently clipped.

Secondary checks use native yield (t/ha), and conventional anomalies `100 × (yield − F) / F` only where F > 0.1 t/ha. All candidates share the same 6,326 records in that secondary comparison. The five unsupported percentage denominators remain in the primary/raw-yield comparison and in the audit, so original measurements are not discarded. Denominator floors 0.1/0.5/1.0 were checked on unchanged predictions as sensitivity only; models were not refitted to find an attractive floor.

| reference | n | expected_nonpositive | expected_at_or_below_point1 | expected_at_or_below_point5 | raw_zero_yields |
| --- | --- | --- | --- | --- | --- |
| full | 6331 | 0 | 5 | 142 | 0 |
| recent20 | 6331 | 14 | 20 | 198 | 0 |
| mean5 | 6331 | 0 | 0 | 127 | 0 |

Recent linear references give 14 nonpositive expected values; this is evidence of extrapolation limits. Malawi wheat in 2008 illustrates amplification: 1.6133 t/ha observed versus a 0.1035 expected yield gives about +1,459% conventionally, but about +154 training-scale points with the historical scale. Neither number proves a bad source measurement. Some genuine deviations remain large even after stabilization.

## Forward-only model training

Instead of fitting a trend on an entire training block and predicting its own residuals, calibration outcomes are built in five-year blocks starting in 1991. A 1991–1995 residual uses a reference and yield scale estimated through 1990; a 1996–2000 residual uses information through 1995, and so on. All earlier outcomes used to train the residual models were genuinely later than their own reference fitting dates. This reduces the usable model-training sample, especially in fold 1, but better matches the future prediction problem.

For each reference, the model learns `100 × (observed yield − that reference) / earlier scale`, then predicts an adjustment to the outer reference using the outer historical scale. Historical scales can evolve across blocks; this remains an approximation to future conditions, not a guarantee against distribution shift. All fitting stops before the outer validation period. Climate references use country means/temperature SD from 1961–1990, at least 20 observations, positive precipitation mean and nonzero temperature SD. Scaling and category learning are fitted on the model-training rows only.

## Models and fixed settings

Three reference-only baselines, three country/crop median residual corrections, and 27 model variants were evaluated. Algorithms: Linear Regression; Decision Tree (depth 4, minimum leaf 30); Random Forest (80 trees, depth 6, minimum leaf 20, max_features 0.8, random seed 324, two workers). No hyperparameter tuning/search was performed in these outer windows. The source fixed the candidates before fitting; the candidate ranking is an exploratory comparison, not a preregistered independent confirmation.

Each algorithm/reference has a **no-climate control** with country and crop indicators. Basic climate adds standardized temperature anomaly and precipitation percent anomaly. Nonlinear climate adds squares, a hot–dry interaction and crop–climate interactions. Crop and country indicators are categorical, not ordinal. Forest/tree controls can encode country/crop interactions that the additive linear model cannot.

Some validation countries lack earlier forward-calibration records. They are retained for every approach; unknown categories receive all-zero indicators (with dropped-first encoding this shares the reference-category representation). Warnings are not evidence of leakage, but accuracy for those countries is uncertain. `tables/category_coverage.csv` records these cases. This behavior should be improved or explicitly restricted before operational use; we did not remove inconvenient validation cases after viewing scores.

## Actual overall results

Primary V2 target, same observations:

| key | model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- | --- |
| all | full | 6331 | 31.8493 | 53.8648 | -0.0288 |
| all | recent20 | 6331 | 29.6123 | 48.5737 | 0.1634 |
| all | mean5 | 6331 | 27.8496 | 47.3479 | 0.2051 |
| all | mean5_linear_basic | 6331 | 28.7568 | 47.0557 | 0.2148 |
| all | mean5_tree_nonlinear | 6331 | 27.2689 | 46.0801 | 0.2471 |
| all | mean5_forest_none | 6331 | 26.5051 | 45.2078 | 0.2753 |
| all | mean5_forest_nonlinear | 6331 | 26.6352 | 45.2473 | 0.2740 |

The lowest aggregate MAE is the **mean5 forest without climate**: 26.5051, RMSE 45.2078, R² 0.2753. Its nonlinear climate version has MAE 26.6352, RMSE 45.2473 and R² 0.2740. Thus the positive R² here does not establish that climate improved prediction. The no-climate approach predicts departures from the long-history line using more recent yield information and historical country/crop residual structure.

Linear climate regression performs worse than the five-year mean baseline in overall MAE. Trees/forests improve on that simple reference, but their matched no-climate controls are stronger. Every basic/nonlinear climate variant has worse overall MAE than its corresponding same-algorithm, same-reference no-climate control. Some individual crop or period RMSE/R² results do improve, so the conclusion is lack of consistent added climate skill, not proof that climate has no effect.

Native-yield reference comparison:

| key | model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- | --- |
| all | full | 6331 | 0.6209 | 1.1448 | 0.8452 |
| all | recent20 | 6331 | 0.5722 | 1.0394 | 0.8724 |
| all | mean5 | 6331 | 0.5469 | 1.0380 | 0.8727 |

The previous-five-year mean reduces raw-yield MAE from 0.6209 to 0.5469 t/ha (about 11.9%) versus the long line. The recent 20-year line also improves aggregate MAE. The five-year mean is better for rice/wheat; the recent line is slightly better for maize's raw-yield MAE and RMSE. The recent line has worse raw-yield RMSE than the long line in fold 1. No reference wins every metric, crop and period.

## Chronological period results

| key | model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- | --- |
| 1 | full | 2211 | 29.9968 | 51.9247 | -0.0124 |
| 1 | recent20 | 2211 | 29.6215 | 50.4975 | 0.0425 |
| 1 | mean5 | 2211 | 27.2929 | 48.8253 | 0.1049 |
| 1 | mean5_linear_basic | 2211 | 30.9371 | 52.0511 | -0.0173 |
| 1 | mean5_tree_nonlinear | 2211 | 27.6810 | 48.6356 | 0.1118 |
| 1 | mean5_forest_none | 2211 | 26.0234 | 46.7186 | 0.1804 |
| 1 | mean5_forest_nonlinear | 2211 | 26.4790 | 47.2712 | 0.1609 |
| 2 | full | 2213 | 32.4375 | 56.0480 | -0.0295 |
| 2 | recent20 | 2213 | 31.6838 | 50.6284 | 0.1600 |
| 2 | mean5 | 2213 | 29.3234 | 48.6848 | 0.2233 |
| 2 | mean5_linear_basic | 2213 | 29.1924 | 46.9883 | 0.2765 |
| 2 | mean5_tree_nonlinear | 2213 | 28.1205 | 46.8910 | 0.2794 |
| 2 | mean5_forest_none | 2213 | 27.8177 | 46.1825 | 0.3011 |
| 2 | mean5_forest_nonlinear | 2213 | 27.7668 | 46.1963 | 0.3006 |
| 3 | full | 1907 | 33.3143 | 53.4876 | -0.0556 |
| 3 | recent20 | 1907 | 27.1977 | 43.6106 | 0.2983 |
| 3 | mean5 | 1907 | 26.7849 | 43.9103 | 0.2886 |
| 3 | mean5_linear_basic | 1907 | 25.7235 | 40.5906 | 0.3921 |
| 3 | mean5_tree_nonlinear | 1907 | 25.8029 | 41.8957 | 0.3524 |
| 3 | mean5_forest_none | 1907 | 25.5403 | 42.1823 | 0.3435 |
| 3 | mean5_forest_nonlinear | 1907 | 25.5032 | 41.5875 | 0.3619 |

## Crop results

| key | model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- | --- |
| maize | full | 2493 | 39.0573 | 67.9885 | -0.0933 |
| maize | recent20 | 2493 | 34.8089 | 57.1074 | 0.2287 |
| maize | mean5 | 2493 | 34.7374 | 60.0354 | 0.1475 |
| maize | mean5_linear_basic | 2493 | 33.8687 | 56.9105 | 0.2340 |
| maize | mean5_tree_nonlinear | 2493 | 33.9500 | 57.9079 | 0.2069 |
| maize | mean5_forest_none | 2493 | 32.7192 | 56.8491 | 0.2356 |
| maize | mean5_forest_nonlinear | 2493 | 32.9395 | 56.7480 | 0.2383 |
| rice | full | 2021 | 25.5475 | 36.4434 | -0.0041 |
| rice | recent20 | 2021 | 24.1391 | 36.7838 | -0.0230 |
| rice | mean5 | 2021 | 22.0525 | 31.9058 | 0.2304 |
| rice | mean5_linear_basic | 2021 | 24.0923 | 34.6110 | 0.0943 |
| rice | mean5_tree_nonlinear | 2021 | 21.4575 | 31.5579 | 0.2470 |
| rice | mean5_forest_none | 2021 | 21.0418 | 30.9939 | 0.2737 |
| rice | mean5_forest_nonlinear | 2021 | 20.9739 | 31.0285 | 0.2721 |
| wheat | full | 1817 | 28.9688 | 47.8546 | -0.0011 |
| wheat | recent20 | 1817 | 28.5700 | 47.3431 | 0.0202 |
| wheat | mean5 | 1817 | 24.8474 | 41.6386 | 0.2421 |
| wheat | mean5_linear_basic | 1817 | 26.9313 | 44.0332 | 0.1524 |
| wheat | mean5_tree_nonlinear | 1817 | 24.5659 | 41.1082 | 0.2613 |
| wheat | mean5_forest_none | 1817 | 24.0556 | 40.2292 | 0.2925 |
| wheat | mean5_forest_nonlinear | 1817 | 24.2825 | 40.5490 | 0.2812 |

All 33 candidates also have full fold×crop and annual MAE/RMSE/R² in `tables/scores.csv`. Overall R² is calculated on pooled actual outcomes using one common target; it is not the mean of fold R² values. Native-yield R² mostly reflects variation in country yield levels and must not be substituted for anomaly skill. V2's changed normalization, forward-training design, and sample mean its headline scores are **not directly comparable with M3's final-test scores**.

## Is improvement driven by a few unusual observations?

Positive gain means lower MAE than the named comparator, on identical records:

| model | comparator | paired_mean_mae_gain | equal_country_crop_gain | country_crop_win_fraction | years_with_positive_gain | crops_with_positive_gain | folds_with_positive_gain | minimum_leave_one_country_out_gain | maximum_leave_one_country_out_gain |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| full | full | 0.0000 | 0.0000 | 0.0000 | 0 | 0 | 0 | 0.0000 | 0.0000 |
| recent20 | full | 2.2370 | 2.0377 | 0.5387 | 15 | 3 | 3 | 1.8682 | 2.4438 |
| mean5 | full | 3.9996 | 3.8680 | 0.5728 | 20 | 3 | 3 | 3.7072 | 4.1313 |
| mean5_linear_basic | mean5_linear_none | -0.0427 | -0.0459 | 0.4365 | 11 | 1 | 1 | -0.0524 | -0.0347 |
| mean5_tree_nonlinear | mean5_tree_none | -0.5670 | -0.6647 | 0.4180 | 8 | 0 | 1 | -0.5929 | -0.5085 |
| mean5_forest_none | mean5 | 1.3446 | 1.2652 | 0.6502 | 18 | 3 | 3 | 1.2481 | 1.4933 |
| mean5_forest_nonlinear | mean5_forest_none | -0.1302 | -0.1705 | 0.4582 | 7 | 1 | 2 | -0.1790 | -0.1048 |

The five-year mean beats the full-history line in primary MAE in all 20 years, all three crops, all three periods, and about 57% of country/crop groups. The country/crop-only forest adds benefit in 18/20 years, all three crops and periods, and about 65% of country/crop groups. Removing any single country leaves its gain over the five-year mean positive (1.248 to 1.493 points). Equal-country/crop weighting also retains the gain. These are stronger internal checks than one pooled score, but not universal accuracy.

The nonlinear climate forest improves only one crop's MAE versus the no-climate forest. Its overall deterioration persists when any single country is omitted. Top 1% errors still account for about 39% of the no-climate forest's squared error, so extremes remain influential. Full country/crop, year and denominator-sensitivity outputs are saved for review.

Approximate paired bootstrap gain intervals:

| model | comparator | clusters | n_clusters | gain | low95 | high95 |
| --- | --- | --- | --- | --- | --- | --- |
| mean5 | full | country | 142 | 3.9996 | 2.4653 | 5.6547 |
| mean5 | full | five_year_block | 4 | 3.9996 | 3.1774 | 5.4599 |
| mean5_forest_none | mean5 | country | 142 | 1.3446 | 0.5800 | 2.0563 |
| mean5_forest_none | mean5 | five_year_block | 4 | 1.3446 | 1.0719 | 1.6166 |
| mean5_forest_nonlinear | mean5_forest_none | country | 142 | -0.1302 | -0.3547 | 0.1078 |
| mean5_forest_nonlinear | mean5_forest_none | five_year_block | 4 | -0.1302 | -0.3447 | 0.0402 |

These resample either countries or five-year time blocks, preserving paired model errors. They are alternative sensitivity views, not a full joint spatial/temporal uncertainty model. Only four time blocks are available. Intervals are unadjusted for comparing 33 candidates and must not be treated as confirmatory significance tests.

## What improved, what did not, and why

- **Improved:** recent-yield no-climate baselines predict historical future yields/departures better than extrapolating one long line on average. A regularized country/crop-only forest correction offers further internal gain. This is consistent with changing yield growth and persistent nonclimate structure; it does not identify a causal mechanism.
- **Improved methodology:** common targets and rows, explicit denominator sensitivity, forward-only calibration residuals, matched no-climate controls, and crop/year/country checks make claims more defensible.
- **Not demonstrated:** extra climate features improve the strongest matched baseline. Annual national weather may miss crop-season heat/water stress, and farming, irrigation, soils and economic shocks remain unmeasured. These explanations are plausible limitations, not causes quantified by this experiment.
- **Still uncertain:** stability of rankings under other historical folds, penalty/model settings, unknown-country handling, normalization and temporal changes. The old historical windows were already explored in earlier work. This is further development evidence, not an untouched new final test.

## Verification and preservation

`verification.json` checks chronology, forward residual isolation, future-yield mutation, training-only scaling, identical candidate rows, independent scalar MAE/RMSE/R², independent scalar expected-yield calculations, and original-file preservation. Metric agreement is within 1e-9; observed maximum discrepancy is below 1e-14. All pre-existing files are unchanged. No final-holdout candidate evaluation, data download, website edit, commit, push or upload occurred. The final file check is also saved after report generation.

## Recommended next decision

Adopt the **controlled V2 development procedure** and stronger no-climate baselines provisionally. Keep investigating the global climate question; do not claim a successful improved climate model or change the research topic. Do not overwrite the M3 model, results or website package. Before a preferred final model is declared, lock a smaller candidate set, test it using nested historical windows and explicit country coverage, and acknowledge that the already-inspected 2016–2024 period is no longer a fresh independent test of a revised design. New unseen evaluation data would be needed for a genuinely new final assessment.

## Files and reproduction

All additions are under `results/global_improvement_v2/`: `code/`, `tables/`, `charts/`, this report, model definitions, verification, and preservation manifests. No deployment-ready replacement model is saved: these fits serve historical development and are not trained on the old final holdout.

From the project root in PowerShell, reproduce into an unused folder:

```powershell
.\.python\python.exe results\global_improvement_v2\code\run_experiment.py --output-dir results/global_improvement_v2_reproduction_01
.\.python\python.exe results\global_improvement_v2\code\summarize_experiment.py --output-dir results/global_improvement_v2_reproduction_01
```

Both commands refuse to overwrite completed outputs. Code depends on the preserved local `src` helpers and installed M3 environment. Version information is saved in `environment.json`. Figures are `model_mae.png`, `reference_comparison.png`, `denominator_effect.png`, and `added_climate_value.png`. The earlier website staging and research pathway remain intact for a later user-approved comparison.
