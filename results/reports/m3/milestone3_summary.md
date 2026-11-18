# ICT324 — Milestone 3: Data Analysis and Machine Learning

Completed analysis: 2026-11-12 (Asia/Bangkok). Status: local analysis complete; publication awaits review.

## 1. Research title and objective

**Agriculture & Climate Resilience.** Relate unusually high temperatures and low precipitation to crop yield variability; compare selected crops' observed stability.

## 2. Data sources and dataset size

The existing verified merge contains **22,660 country-year-crop observations** from **173 countries and territories**, covering 1961-2025. Only one record reaches 2025 (US maize); the main analysis ends in 2024. There are 9,953 unique country-years. No datasets were downloaded again.

Saved OWID metadata identifies FAOSTAT-based crop yields (with historical UK/USDA source additions) and ERA5/Copernicus climate processed by OWID. Yields are t/ha; temperature is °C; precipitation is mm of liquid-water equivalent, including snow. These are national annual observations, not farm measurements.

| crop | observations | countries | first_year | last_year |
| --- | --- | --- | --- | --- |
| maize | 8948 | 160 | 1961 | 2025 |
| rice | 6973 | 120 | 1961 | 2024 |
| wheat | 6739 | 123 | 1961 | 2024 |

## 3. Completed cleaning and merging

The earlier verified pipeline restricted records to current ISO3 identifiers, numeric years (1961-2025), valid finite measurements, and unique keys. It retained valid outliers and zero yields, without zero imputation. Crop records were joined to complete country-year weather pairs using cardinality checks. There were 23,412 cleaned crop rows and 752 rows without complete climate, leaving 22,660. Original Stage 1 reports and datasets are preserved; local snapshot hashes were checked again.

## 4. Exploratory methods and observed trends

Descriptive statistics, coverage counts, annual arithmetic country means, and Pearson/Spearman correlations were calculated. Climate trends count each country-year once, preventing countries with three crops receiving three weather weights. Available-country trends are compared with panels containing every year from 1961 to 2024. Neither series is harvested-area weighted.

| series | panel | crop | measure | first_value | last_value | change | first_countries | last_countries |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| yield | available_countries | maize | mean_yield_t_ha | 1.3789 | 4.8960 | 3.5171 | 124 | 156 |
| yield | available_countries | rice | mean_yield_t_ha | 2.1334 | 4.1839 | 2.0505 | 103 | 113 |
| yield | available_countries | wheat | mean_yield_t_ha | 1.3544 | 3.4007 | 2.0463 | 85 | 121 |
| yield | balanced_1961_2024 | maize | mean_yield_t_ha | 1.3731 | 4.2833 | 2.9102 | 120 | 120 |
| yield | balanced_1961_2024 | rice | mean_yield_t_ha | 2.1005 | 4.1179 | 2.0173 | 95 | 95 |
| yield | balanced_1961_2024 | wheat | mean_yield_t_ha | 1.3294 | 3.4494 | 2.1200 | 82 | 82 |
| climate | available_countries | all | mean_temperature_c | 19.5612 | 19.9575 | 0.3963 | 138 | 170 |
| climate | available_countries | all | mean_precipitation_mm | 1256.8750 | 1170.8587 | -86.0164 | 138 | 170 |
| climate | balanced_1961_2024 | all | mean_temperature_c | 19.4558 | 21.2350 | 1.7792 | 135 | 135 |
| climate | balanced_1961_2024 | all | mean_precipitation_mm | 1227.8839 | 1259.3312 | 31.4473 | 135 | 135 |

**Interpretation:** coverage changes can alter available-country means even without a within-country change. Balanced panels remove entry/exit changes for their selected countries but are a narrower sample. Endpoint changes above are descriptive differences, not estimated causal effects or significance tests.

Historical anomaly Pearson correlations (eligible 1961-2015 rows):

| crop | x | n | correlation |
| --- | --- | --- | --- |
| wheat | temperature_anomaly_c | 5571 | -0.0364 |
| wheat | precipitation_anomaly_pct | 5571 | 0.0622 |
| rice | temperature_anomaly_c | 5926 | -0.0199 |
| rice | precipitation_anomaly_pct | 5926 | 0.0132 |
| maize | temperature_anomaly_c | 7417 | -0.0511 |
| maize | precipitation_anomaly_pct | 7417 | 0.0317 |

## 5. Climate and yield anomaly methodology

Temperature anomaly = observed annual temperature minus the country's 1961-1990 mean. Precipitation anomaly (%) = 100 × (observed precipitation / reference precipitation − 1). Reference means use the separate cleaned country-year climate file, with at least 20 valid reference years for each variable and mean precipitation above 1 mm.

Yield trends are ordinary least-squares lines of yield against year−1961, fitted separately for each country and crop using training years only, requiring at least 20 distinct observations over at least 19 elapsed years. Yield anomaly (%) = 100 × (observed yield / fitted expected yield − 1). Expected yields at or below 0.1 t/ha are excluded from anomaly use; source records are retained with explicit eligibility flags. An observed zero with a valid expected yield remains −100%. The analysis-ready CSV preserves all 22,660 records and never replaces the verified merge.

Historical training anomalies are retrospective residuals. Test-year actual anomalies use the **observed held-out yield** divided by the yield trend extrapolated from pre-2016 data. Test yields never fit a trend. This distinction is essential: a poor technology-trend extrapolation can also create a large test anomaly.

Ineligible records (one priority exclusion reason per row):

| split | exclusion_reason | n |
| --- | --- | --- |
| test | expected_yield_at_or_below_0.1_t_ha | 17 |
| test | insufficient_yield_history | 142 |
| train | expected_yield_at_or_below_0.1_t_ha | 65 |
| train | insufficient_yield_history | 151 |

## 6. Models and chronological procedure

Final training: **1961-2015, 18,914 eligible observations**. Final testing: **2016-2024, 3,370 eligible observations**. All four models use exactly the same test records. No random row split is used.

Models are constant zero-anomaly prediction, Linear Regression, Decision Tree Regressor, and Random Forest Regressor. Inputs are temperature anomaly, precipitation anomaly, crop category, and categorical country identifier. Country helps describe known-country historical structure; it does not establish a transferable country effect or climate cause. StandardScaler and OneHotEncoder are inside each pipeline and fit only training inputs.

Expanding validation uses training through 1995 / validation 1996-2002, through 2002 / 2003-2009, and through 2009 / 2010-2015. Reference tables, yield trends, target anomalies, scaling, and encoding are refitted within every fold. Tree depths 3, 6, 10 with minimum leaf 40 and forest depths 6, 12, unlimited with minimum leaf 20 were predeclared. Forests use 100 trees, max_features=0.8, two worker threads, and random_state=324. Observation-weighted validation MAE selects settings and an approach before final held-out scoring.

Actual validation folds:

| fold | train_start | train_end | validation_start | validation_end | n_train | n_validation | max_trend_fit_year |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1961 | 1995 | 1996 | 2002 | 11165 | 2209 | 1995 |
| 2 | 1961 | 2002 | 2003 | 2009 | 13416 | 2212 | 2002 |
| 3 | 1961 | 2009 | 2010 | 2015 | 15702 | 1915 | 2009 |

Selected settings:

```json
{
  "zero_baseline": {},
  "linear_regression": {},
  "decision_tree": {
    "max_depth": 3,
    "min_samples_leaf": 40
  },
  "random_forest": {
    "max_depth": 6,
    "min_samples_leaf": 20
  }
}
```

The validation-selected approach is **Linear Regression**. It is retained as the prespecified approach even if another model scores better on the final test.

## 7. Actual held-out model comparison

MAE and RMSE are percentage points of anomaly. R² is unitless and compares squared error with variation around the held-out mean; it can be negative.

| model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- |
| zero_baseline | 3370 | 22.6379 | 36.8634 | -0.0195 |
| linear_regression | 3370 | 22.6150 | 36.9104 | -0.0221 |
| decision_tree | 3370 | 22.6683 | 36.9044 | -0.0217 |
| random_forest | 3370 | 22.6989 | 36.8675 | -0.0197 |

Separate crop evaluation:

| model | scope | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- | --- |
| zero_baseline | maize | 1333 | 25.5383 | 43.5343 | -0.0465 |
| zero_baseline | rice | 988 | 21.0411 | 32.9979 | -0.0070 |
| zero_baseline | wheat | 1049 | 20.4562 | 30.5243 | -0.0048 |
| linear_regression | maize | 1333 | 25.4272 | 43.4299 | -0.0415 |
| linear_regression | rice | 988 | 20.8413 | 32.9536 | -0.0043 |
| linear_regression | wheat | 1049 | 20.7120 | 30.9378 | -0.0322 |
| decision_tree | maize | 1333 | 25.5767 | 43.5364 | -0.0466 |
| decision_tree | rice | 988 | 20.9537 | 32.9506 | -0.0041 |
| decision_tree | wheat | 1049 | 20.5873 | 30.7272 | -0.0182 |
| random_forest | maize | 1333 | 25.5988 | 43.5317 | -0.0464 |
| random_forest | rice | 988 | 21.0667 | 32.9903 | -0.0065 |
| random_forest | wheat | 1049 | 20.5512 | 30.5524 | -0.0067 |

The validation-selected approach has test MAE 22.6150, RMSE 36.9104, and R² -0.0221. Its test MAE improvement relative to zero prediction is 0.10% (a negative value is deterioration). A complex model is not assumed superior. All test scores are reported without suppressing poor results.

## 8. Preliminary crop stability and Thailand findings

Stability is the sample standard deviation of detrended anomalies within each country/crop, followed by an equal-country mean. Negative frequency is the share of anomalies below zero, not the frequency of crop failure. Hot means temperature anomaly ≥1°C, dry means precipitation anomaly ≤−20%, and combined means both. Event means first average within each event-exposed country. Country counts and event sample sizes are saved, including countries with no events. Overlapping categories are not independent treatment groups.

The matched panel includes only country-years with all three eligible crops, requiring at least 20 matched training years or 5 matched test years per country. This holds event-year exposure constant across crops. The broader all-eligible comparison remains available in the CSV.

| split | crop | countries | observations | mean_country_sd_pct | mean_country_negative_frequency_pct | hot_observations | hot_mean_country_anomaly_pct | dry_observations | dry_mean_country_anomaly_pct | hot_and_dry_observations | hot_and_dry_mean_country_anomaly_pct |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| train | maize | 73 | 3563 | 32.0789 | 52.8406 | 456 | 1.7339 | 387 | -4.0122 | 103 | -10.3875 |
| train | rice | 73 | 3563 | 20.2039 | 50.6558 | 456 | 1.5770 | 387 | -2.7982 | 103 | -2.0626 |
| train | wheat | 73 | 3563 | 21.4685 | 51.1936 | 456 | 2.0130 | 387 | -3.6057 | 103 | -1.6392 |
| test | maize | 71 | 639 | 13.0348 | 44.6009 | 455 | 7.3772 | 115 | 3.0817 | 96 | 1.2688 |
| test | rice | 71 | 639 | 10.5832 | 51.6432 | 455 | 1.5489 | 115 | 2.2629 | 96 | 1.8548 |
| test | wheat | 71 | 639 | 15.1338 | 43.9750 | 455 | 4.6361 | 115 | 2.1006 | 96 | 1.1048 |

**Observed finding:** rice has the lowest matched historical mean country SD (20.20 percentage points); rice has the lowest corresponding held-out-period SD (10.58). This does not establish universal climate resilience. Different mean anomalies, yield levels, country selection, and nonclimate shocks can affect this ranking.

Paired country bootstrap intervals (2,000 resamples; first crop minus second crop):

| split | first_crop | second_crop | countries | difference_mean_country_sd_pct | bootstrap_95_low_pct | bootstrap_95_high_pct | bootstrap_replicates |
| --- | --- | --- | --- | --- | --- | --- | --- |
| train | wheat | rice | 73 | 1.2645 | -1.6559 | 4.1447 | 2000 |
| train | wheat | maize | 73 | -10.6104 | -24.1197 | -1.7718 | 2000 |
| train | rice | maize | 73 | -11.8749 | -24.8723 | -2.9681 | 2000 |
| test | wheat | rice | 71 | 4.5507 | 0.6130 | 8.6560 | 2000 |
| test | wheat | maize | 71 | 2.0990 | -1.5143 | 5.6943 | 2000 |
| test | rice | maize | 71 | -2.4517 | -5.4915 | 0.7851 | 2000 |

Thailand has 167 source rows: rice and maize each have 64 years (1961-2024), and wheat has 39 (1986-2024). The Thai chart separates fitted historical residuals from held-out years. The case study is descriptive; annual country weather cannot isolate crop-season heat or water stress.

## 9. Problems, limitations, and verification

- Country annual weather averages are not aligned to crop growing seasons or harvested areas. Irrigation, soils, management, pests, and economic shocks are absent; these associations are not causal effects.
- Country/crop coverage changes over time and is not production-weighted. Historical borders and excluded territories limit generalization. Matched panels improve comparability but select a narrower sample.
- Linear yield trends may not capture technology changes, plateaus, or structural breaks. Training targets are retrospective fitted residuals, whereas test targets are deviations from extrapolated pre-2016 trends; distribution shift can dominate climate prediction.
- Percentage anomalies can be sensitive to low expected yields. Expected values at or below 0.1 t/ha are excluded transparently, with additional 0.5 and 1.0 t/ha sensitivity tables; no clipping or deletion based on test errors is used.
- The fixed +1°C / -20% event definitions are descriptive choices. Warming makes hot years more common later; hot, dry, and combined categories overlap and small event samples limit interpretation.
- Rows share country-year weather and have temporal/spatial dependence. Country bootstrap intervals for paired stability differences are approximate and do not model cross-country weather dependence or multiple comparisons.
- Only three expanding validation windows and small predeclared tuning grids are used. The final nine-year test period is one temporal holdout, not proof of future or unseen-country accuracy.
- Predictions use weather observed during the target year and therefore are contemporaneous conditional estimates, not forecasts available before planting.
- Valid source outliers and zero yields remain. Source-quality flags and harvested areas are unavailable, and the original local manifest is not a provider-signed authenticity certificate.
- The sole 2025 US maize record is retained in the analysis-ready file but excluded from primary trends, stability periods, and evaluation because other crops/countries lack that endpoint.
- Thai wheat has only 30 training years (1986-2015) and 9 test years; its smaller history and national annual aggregation limit the secondary case study.
- At least one model has negative test R². Its squared errors exceed the reference obtained by predicting the test-set mean; no scores have been suppressed.
- The validation-selected approach changes test MAE by 0.10% relative to zero prediction; this single split does not establish reliable general climate prediction.

Executed checks cover input fingerprints, manifest hashes, independent scalar anomaly arithmetic, adversarial future-data mutations, fold isolation, training-only preprocessing, actual common test records, independently recalculated metrics, matched panels, chart source hashes, and full-test prediction reproduction after model reload. See results/reports/m3/verification_summary.md for explicit PASS/FAIL/WARNING evidence. Models, code, datasets, and reports remain local. No website file was edited and no commit or push was made.

## 10. Planned improvements before the final milestone

Review crop-season and crop-area weather alignment; investigate source-quality flags and extremes; compare prespecified recent/nonlinear trend methods using nested historical validation; assess threshold and denominator sensitivity; add irrigation and management predictors where justified; and evaluate more temporal holdouts and grouped uncertainty. Any new model selection after inspecting this test set requires a new evaluation design. Review this package with the lecturer before any future website update. A final conference paper has not been written.
