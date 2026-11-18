# Global V3 research findings

Date: 13 November 2026 (Asia/Bangkok). Status: completed exploratory historical validation; local review only.

## 1. Research objective and main answer

**How do unusually high temperatures and low rainfall relate to crop yield variability, and which selected crops exhibit the greatest yield stability?**

The topic, global dataset, wheat/rice/maize focus, and original question remain unchanged. V3 separates three questions: **A, whether climate helps predict yield deviations; B, what associations appear in the annual measurements; and C, which crops vary less on comparable observations.** These are different types of evidence. Predictive failure does not mean climate is agriculturally unimportant.

Main answer: neither climate candidate satisfies the saved success criteria or improves overall MAE over its matched no-climate forest. Some crop/period results improve, but gains are inconsistent. Descriptive associations are weak and adjusted coefficient intervals include zero. Rice has lower numerical overall variability in the matched sample, but its difference from wheat remains uncertain. Combined-event samples are too small for a confident global resilience ranking.

## 2. Dataset, variables and reference definitions

The original verified merge has 22,660 country-year-crop records from 173 countries/territories. V3 reads the existing verified merge and cleaned climate file; it immediately limits development to years through 2015. No external measurements, regional models, soil or humidity variables were introduced.

Yield is tonnes per hectare; annual national temperature is degrees Celsius; annual precipitation is millimetres of liquid-water equivalent, including snow. Temperature anomaly is observed temperature minus each country's 1961–1990 mean. Precipitation anomaly is its percentage difference from the same reference period. At least 20 valid reference values are required, with positive mean precipitation and nonzero temperature SD.

All four prediction candidates share V2's primary target:

`100 × (observed yield − earlier full-history expected yield) / S`, where `S = max(0.5 t/ha, median earlier country/crop yield)`.

Predicted yields are converted using the identical full-history line and S. Thus another expected-yield reference cannot obtain a better score simply by redefining the target. The primary error unit is **percentage points of historical-yield-scale deviation**, not conventional percent departure from expected yield. Raw-yield metrics and conventional full-history percentage metrics are saved separately. The conventional comparison excludes five unsupported denominators ≤0.1 t/ha consistently for every model; all measurements remain in primary analysis. No extreme measurement or prediction is clipped.

Experiments B and C use `100 × (observed yield − previous-five-year reference) / S`. This centres relationships and stability on the same recent-yield reference used by all prediction candidates. It differs from the full-history-centred prediction label; the two must not be silently mixed. Reference sensitivities replace the centre with the full-history or recent-20-year line while keeping the same S and same observations.

## 3. Fixed historical design and leakage prevention

The protocol was saved before fitting in `verification/protocol.json`: four candidates, fixed forest settings, historical windows, primary MAE, eligibility rules, and success criteria. No hyperparameter search or candidate selection used the inspected 2016–2024 test period.

| fold | cutoff | validation_start | validation_end | n_train | n_validation | countries | unknown_country_rows |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1995 | 1996 | 2002 | 1570 | 2211 | 140 | 14 |
| 2 | 2002 | 2003 | 2009 | 3785 | 2213 | 142 | 0 |
| 3 | 2009 | 2010 | 2015 | 6006 | 1907 | 142 | 0 |

There are **6,331 identical validation records**, from 142 countries/territories in their union: wheat 1,817, rice 2,021, maize 2,493. Every record has the earlier history needed for V2's three reference methods: 20 observations overall, 15 in the previous 20 calendar years, and three in the previous five years, plus eligible climate. Country and crop coverage is not universal or balanced; rejected keys and reasons remain in `tables/exclusions.csv`.

The five-year reference is fixed at the start of each outer validation block; observed validation yields do not update it. Forward-only calibration blocks begin in 1991. A 1991–1995 training residual uses references/scales fitted through 1990, and subsequent blocks use their own earlier cutoffs. This avoids fitting a trend to its own calibration outcome. All country/crop observations in a year stay on the same side of each temporal split. Scalers and category encoders learn only from their allowed calibration rows.

There is no tuning, so an extra inner model-selection loop is unnecessary here. Forward calibration and the three later validation blocks provide chronological separation. They do **not** create a new independent holdout: these historical windows were explored in prior work. See [time-aware validation guidance](https://scikit-learn.org/stable/modules/cross_validation.html#cross-validation-of-time-series-data).

All forests use 80 trees, depth 6, minimum leaf 20, max_features 0.8, seed 324 and two workers. B contains country/crop categories; C adds standardized temperature and percentage precipitation anomalies; D adds limited squares, hot–dry and crop–climate interactions from V2. Identical architecture, seed and budget are retained; the larger feature set changes available split choices. Fourteen fold-1 records have previously unseen calibration countries and use the documented all-zero category fallback; they are retained equally across candidates, with separate known-country scores.

## 4. Experiment A — actual predictive performance

| model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- |
| A_reference | 6331 | 27.8496 | 47.3479 | 0.2051 |
| B_no_climate | 6331 | 26.5051 | 45.2078 | 0.2753 |
| C_climate | 6331 | 26.6986 | 45.5062 | 0.2657 |
| D_interactions | 6331 | 26.6352 | 45.2473 | 0.2740 |

A is the simple five-year mean, B the no-climate forest correction, C the basic climate forest and D the interaction forest. B is the strongest overall candidate: MAE 26.5051, RMSE 45.2078, R² 0.2753. Adding climate worsens MAE by 0.1935 points for C and 0.1302 for D. D also has slightly worse aggregate RMSE/R² than B. Positive historical R² here is not a replacement for M3's negative final-test R²: the normalization, sample and design differ.

### By crop

| key | model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- | --- |
| maize | A_reference | 2493 | 34.7374 | 60.0354 | 0.1475 |
| maize | B_no_climate | 2493 | 32.7192 | 56.8491 | 0.2356 |
| maize | C_climate | 2493 | 32.8048 | 57.2409 | 0.2251 |
| maize | D_interactions | 2493 | 32.9395 | 56.7480 | 0.2383 |
| rice | A_reference | 2021 | 22.0525 | 31.9058 | 0.2304 |
| rice | B_no_climate | 2021 | 21.0418 | 30.9939 | 0.2737 |
| rice | C_climate | 2021 | 21.1861 | 31.1500 | 0.2664 |
| rice | D_interactions | 2021 | 20.9739 | 31.0285 | 0.2721 |
| wheat | A_reference | 1817 | 24.8474 | 41.6386 | 0.2421 |
| wheat | B_no_climate | 1817 | 24.0556 | 40.2292 | 0.2925 |
| wheat | C_climate | 1817 | 24.4520 | 40.5041 | 0.2828 |
| wheat | D_interactions | 1817 | 24.2825 | 40.5490 | 0.2812 |

C improves no crop's MAE over B. D slightly improves rice MAE (21.0418 to 20.9739), but worsens wheat and maize MAE. D improves maize RMSE slightly, which shows why one metric or crop alone should not determine the conclusion.

### By historical validation period

| key | model | n | mae | rmse | r2 |
| --- | --- | --- | --- | --- | --- |
| 1 | A_reference | 2211 | 27.2929 | 48.8253 | 0.1049 |
| 1 | B_no_climate | 2211 | 26.0234 | 46.7186 | 0.1804 |
| 1 | C_climate | 2211 | 26.8284 | 47.5909 | 0.1496 |
| 1 | D_interactions | 2211 | 26.4790 | 47.2712 | 0.1609 |
| 2 | A_reference | 2213 | 29.3234 | 48.6848 | 0.2233 |
| 2 | B_no_climate | 2213 | 27.8177 | 46.1825 | 0.3011 |
| 2 | C_climate | 2213 | 27.6873 | 46.2319 | 0.2996 |
| 2 | D_interactions | 2213 | 27.7668 | 46.1963 | 0.3006 |
| 3 | A_reference | 1907 | 26.7849 | 43.9103 | 0.2886 |
| 3 | B_no_climate | 1907 | 25.5403 | 42.1823 | 0.3435 |
| 3 | C_climate | 1907 | 25.4007 | 42.0541 | 0.3475 |
| 3 | D_interactions | 1907 | 25.5032 | 41.5875 | 0.3619 |

C and D improve MAE in the second and third windows but lose more in the first. Country/crop-level and annual tables are saved; sample sizes accompany all scores. They are not separate regional models.

### Paired consistency and influence

| model | comparator | mae_gain | fold_wins | crop_wins | country_crop_win_fraction | year_win_fraction | country_low975 | country_high975 | five_year_block_low975 | five_year_block_high975 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B_no_climate | A_reference | 1.3446 | 3 | 3 | 0.6502 | 0.9000 | 0.4848 | 2.1404 | 1.0305 | 1.6808 |
| C_climate | B_no_climate | -0.1935 | 2 | 0 | 0.4458 | 0.5000 | -0.4243 | 0.0474 | -0.5630 | 0.1193 |
| D_interactions | B_no_climate | -0.1302 | 2 | 1 | 0.4582 | 0.3500 | -0.3817 | 0.1374 | -0.3858 | 0.0438 |

Positive gain means lower MAE on the same rows. Climate-success criteria required positive aggregate gain, at least 2/3 crop and period wins, at least 60% country/crop and year wins, positive gain after any single-country omission, and positive lower bounds in both paired uncertainty sensitivities. Both C and D fail. B's improvement over A is a no-climate baseline improvement, not evidence for climate skill.

The two climate contrasts use paired country and five-year-block bootstrap intervals with 97.5% coverage each, a Bonferroni precaution for two contrasts. Only four time blocks are available, and country/time intervals are separate approximations rather than a joint spatial/temporal model. Both climate intervals include zero. Neither supports a reliably positive climate contribution.

Omitting any one country still leaves C/D's aggregate MAE gain negative. The largest 1% of errors account for about 39% of squared error. Removing those model-specific largest-error records as a **diagnostic only** also leaves climate gain negative; those records are never removed from headline scoring. Thus the conclusion is not explained by a single unusual country or only the largest errors.

Country/crop reporting with at least ten validation observations is an additional sample-support check, not a post-hoc change to the saved success rule:

| model | country_crop_groups | equal_country_crop_gain | win_fraction |
| --- | --- | --- | --- |
| B_no_climate | 315 | 1.3609 | 0.6603 |
| C_climate | 315 | -0.1980 | 0.4413 |
| D_interactions | 315 | -0.1193 | 0.4635 |

## 5. Experiment B — climate–yield associations

Descriptive statistics, Pearson/Spearman correlations and all-point scatterplots are saved. The orange scatter curves are eight quantile-bin sample means, not causal response curves. Large observed departures remain visible.

| crop | variable | method | n | correlation |
| --- | --- | --- | --- | --- |
| maize | temperature_anomaly_c | pearson | 2493 | -0.0490 |
| maize | temperature_anomaly_c | spearman | 2493 | -0.0379 |
| maize | precipitation_pct | pearson | 2493 | 0.0728 |
| maize | precipitation_pct | spearman | 2493 | 0.1253 |
| rice | temperature_anomaly_c | pearson | 2021 | 0.0521 |
| rice | temperature_anomaly_c | spearman | 2021 | 0.0459 |
| rice | precipitation_pct | pearson | 2021 | 0.0086 |
| rice | precipitation_pct | spearman | 2021 | 0.0174 |
| wheat | temperature_anomaly_c | pearson | 1817 | -0.0326 |
| wheat | temperature_anomaly_c | spearman | 1817 | -0.0089 |
| wheat | precipitation_pct | pearson | 1817 | 0.0559 |
| wheat | precipitation_pct | spearman | 1817 | 0.0515 |

Maize has a small negative temperature Pearson association (-0.0490) and positive precipitation association (+0.0728; Spearman +0.1253). Wheat temperature is slightly negative (-0.0326), while rice temperature is slightly positive (+0.0521). These are weak pooled relationships and can reflect composition or time differences. No independent-row p-values are reported.

Separate crop regressions include country and calendar-year fixed effects, temperature departure in °C, precipitation departure per 10 percentage points, and their product. The controls compare departures after accounting for persistent country levels and shared calendar-year differences. They do not eliminate unobserved management or country-specific technological trends. Temperature slope is evaluated at zero precipitation anomaly; the precipitation slope is evaluated at zero temperature anomaly because an interaction is included.

Country-clustered 95% intervals:

| crop | term | coefficient | clusters | low95 | high95 |
| --- | --- | --- | --- | --- | --- |
| maize | temperature_C | -3.3272 | 127 | -10.2764 | 3.6220 |
| maize | precipitation_per_10pp | 1.3786 | 127 | -0.6337 | 3.3909 |
| maize | temperature_x_precipitation | 0.5495 | 127 | -1.5017 | 2.6006 |
| rice | temperature_C | 0.2841 | 102 | -4.2681 | 4.8362 |
| rice | precipitation_per_10pp | 0.9335 | 102 | -0.6702 | 2.5373 |
| rice | temperature_x_precipitation | 0.4191 | 102 | -1.2354 | 2.0737 |
| wheat | temperature_C | -2.4037 | 94 | -7.8215 | 3.0141 |
| wheat | precipitation_per_10pp | -0.0589 | 94 | -1.6087 | 1.4908 |
| wheat | temperature_x_precipitation | 1.2029 | 94 | -0.2412 | 2.6470 |

Maize's adjusted temperature coefficient is about -3.33 training-scale points per +1°C, but its interval is -10.28 to +3.62. Wheat is -2.40 (-7.82 to +3.01); rice is +0.28 (-4.27 to +4.84). All main and interaction intervals include zero. Separate year-cluster intervals also all include zero. This is inconclusive evidence for these particular adjusted annual relationships, not proof of no effect.

Clustered uncertainty allows repeated records within a country (and, in the separate sensitivity, within a year). The sandwich calculation follows the [cluster-covariance approach](https://www.statsmodels.org/stable/generated/statsmodels.stats.sandwich_covariance.cov_cluster.html), with finite-sample correction and Student-t critical values. Fixed-effect slopes were checked against a separate full-dummy OLS fit. Cross-country dependence can remain, and these exploratory intervals are not multiplicity-adjusted.

## 6. Experiment C — matched crop stability

The primary matched panel has **61 countries and 1,219 identical country-years per crop** (3,657 records), each country contributing at least ten matched years. A country-year is included only if all three eligible crops are present. Within-country statistics are calculated first, then countries receive equal weight.

| crop | countries | observations | mean_country_sd | mean_country_anomaly | median_country_median | mean_negative_frequency | mean_negative_magnitude | mean_downside_rms |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| wheat | 61 | 1219 | 26.5458 | 13.7246 | 8.4616 | 31.3503 | 16.0345 | 11.2662 |
| rice | 61 | 1219 | 21.9513 | 9.5884 | 9.5572 | 28.6540 | 15.5706 | 11.3518 |
| maize | 61 | 1219 | 34.9142 | 22.5007 | 14.4409 | 26.5876 | 19.8615 | 12.5878 |

SD is the sample standard deviation. Median is the median of country medians. Negative frequency means below the reference, not crop failure. Mean negative magnitude first averages absolute negative departures within each country (zero if none), then averages countries. Downside RMS averages squared negative departures with positive departures assigned zero, takes the square root within country, and then averages countries. These describe different aspects of variability and downside.

Rice has the lowest numerical mean country SD (21.95), followed by wheat (26.55) and maize (34.91). The paired wheat-minus-rice SD interval is **-1.75 to +11.94**, including zero. Rice-minus-maize is **-21.90 to -5.36** in this sample, but this remains an approximate, unadjusted country bootstrap result.

| first_crop | second_crop | countries | difference | low95 | high95 |
| --- | --- | --- | --- | --- | --- |
| wheat | rice | 61 | 4.5945 | -1.7503 | 11.9351 |
| wheat | maize | 61 | -8.3684 | -17.7538 | 0.6971 |
| rice | maize | 61 | -12.9629 | -21.8989 | -5.3558 |

### Hot, dry, combined and ordinary years

Hot means annual temperature anomaly ≥+1°C; dry means annual precipitation anomaly ≤-20%; combined means both. Neither means neither threshold is crossed, not exactly climatological-average weather. The original thresholds are transparent annual proxies, not verified biological stress thresholds.

| event | countries | country_years | countries_lt3 | countries_ge3 | countries_ge5 |
| --- | --- | --- | --- | --- | --- |
| hot | 55 | 321 | 17 | 38 | 31 |
| dry | 39 | 187 | 14 | 25 | 15 |
| combined | 31 | 81 | 22 | 9 | 3 |
| hot_only | 52 | 240 | 19 | 33 | 22 |
| dry_only | 33 | 106 | 19 | 14 | 12 |
| neither | 60 | 792 | 2 | 58 | 56 |

Inclusive hot and dry groups overlap in combined years and must not be added as independent evidence. The public event chart instead shows **hot-only, dry-only, combined and neither**, a complete non-overlapping partition. Minimum three event years is the primary event-country rule; one- and five-year versions remain explicit sensitivities.

| event | crop | countries | observations | mean_country_sd | mean_country_anomaly | mean_negative_frequency | mean_downside_rms |
| --- | --- | --- | --- | --- | --- | --- | --- |
| combined | wheat | 9 | 48 | 32.4924 | 15.9395 | 30.6777 | 12.9008 |
| combined | rice | 9 | 48 | 22.9893 | 12.5359 | 28.0830 | 8.0720 |
| combined | maize | 9 | 48 | 35.1144 | 8.5260 | 41.4428 | 17.4655 |
| dry | wheat | 25 | 167 | 31.7669 | 4.7831 | 45.6776 | 18.1271 |
| dry | rice | 25 | 167 | 22.5229 | 7.2495 | 34.6902 | 11.8419 |
| dry | maize | 25 | 167 | 37.4888 | 8.3592 | 44.2098 | 21.0352 |
| hot | wheat | 38 | 297 | 25.5615 | 13.3804 | 29.7699 | 9.6291 |
| hot | rice | 38 | 297 | 20.5391 | 11.0152 | 24.9251 | 8.3283 |
| hot | maize | 38 | 297 | 33.9988 | 17.7706 | 24.8509 | 13.4456 |
| neither | wheat | 58 | 788 | 25.2421 | 14.1904 | 31.1215 | 9.8949 |
| neither | rice | 58 | 788 | 21.7165 | 9.1632 | 29.5737 | 11.0598 |
| neither | maize | 58 | 788 | 30.8059 | 25.1471 | 24.6053 | 8.7218 |

Positive event means do not show that heat or dryness benefits crops. The five-year reference may lag growth; event years occur at different times, and event groups can contain different countries. Stability concerns variability/downside as well as the mean.

To compare event and ordinary years more fairly, each country needs at least three observations in both groups. Differences are first calculated within that same country, then averaged equally:

| event | crop | countries | event_observations | ordinary_observations | event_minus_neither | low95 | high95 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| combined | maize | 6 | 26 | 42 | -4.8939 | -23.9533 | 7.5159 |
| combined | rice | 6 | 26 | 42 | -0.9087 | -9.5676 | 8.2817 |
| combined | wheat | 6 | 26 | 42 | 7.4651 | -8.1858 | 26.4365 |
| dry | maize | 22 | 138 | 199 | -10.4823 | -21.1043 | 1.6518 |
| dry | rice | 22 | 138 | 199 | -1.6979 | -6.1703 | 2.7020 |
| dry | wheat | 22 | 138 | 199 | -7.2968 | -13.5590 | -1.4835 |
| hot | maize | 35 | 248 | 373 | -1.1252 | -6.4109 | 4.2164 |
| hot | rice | 35 | 248 | 373 | 1.5246 | -3.2213 | 5.9826 |
| hot | wheat | 35 | 248 | 373 | -4.9444 | -15.4060 | 3.0734 |

Wheat dry-minus-neither is -7.30 points (approximate interval -13.56 to -1.48) across 22 countries. Maize dry-only-minus-neither is -23.25 (-35.26 to -12.03) across 13 countries, saved in the full comparison table. These are tentative associations: multiple comparisons, calendar timing, reference errors and other shocks prevent causal claims. Combined-versus-neither comparisons have only six countries and intervals that include zero for all crops.

### Sensitivity and insufficiency

| reference | crop | mean_country_sd |
| --- | --- | --- |
| full | wheat | 26.9488 |
| full | rice | 21.1611 |
| full | maize | 34.4445 |
| mean5 | wheat | 26.5458 |
| mean5 | rice | 21.9513 |
| mean5 | maize | 34.9142 |
| recent20 | wheat | 32.3201 |
| recent20 | rice | 27.0337 |
| recent20 | maize | 38.8420 |

Rice remains numerically lowest overall using each of the three yield centres, with identical observations/scales. Magnitudes change, and rice–wheat uncertainty remains material. A lower numerical SD does not establish universal resilience.

Only nine countries have at least three combined event years (48 observations per crop); 22 of the 31 countries with any combined event have fewer than three. Requiring five combined years leaves **three countries and 26 observations per crop**. Under that rule rice SD is about 32.21, versus wheat 28.89 and maize 28.68, reversing the overall numerical ordering. This small selected sample cannot establish a stress-resilience ranking.

The sole prespecified threshold sensitivity is +1.5°C/-30%, alongside the original +1°C/-20%. **No country has three combined years under the strict definition.** The combined comparison is therefore insufficient; missing statistics are recorded as NA/null, not manufactured. Countries resampled together preserve paired crop exposure, but the stability intervals do not fully model spatial/year dependence or adjust for the many comparisons.

## 7. What changed relative to V2

V3's four prediction results reproduce the corresponding V2 results to maximum score discrepancy 0. This is expected: the same target, rows, references, forest architecture and feature definitions were retained. V3 is not a new predictive breakthrough. Its contributions are the fixed four-candidate decision rule, paired consistency/influence evidence, adjusted interpretable associations, and matched stress-specific stability with explicit sample and reference sensitivities.

M3's retrospective historical stability panel, its held-out panel and V3's later out-of-fold-reference panel differ in period, normalization and eligibility. Their numerical SDs must not be compared as if only the climate effect changed. Earlier M3/V2 outputs remain untouched.

## 8. Limitations and next decision

- Reused historical windows are development evidence, not a fresh independent final holdout. No new candidate used 2016–2024 for selection or scoring.
- National annual climate does not describe crop growing seasons, flowering-stage heat, dry spells, irrigation or crop-area exposure. Transformations cannot recover those missing measurements.
- The five-year reference lags changes in yield growth; fixed block-start forecasts, scale changes across historical calibration blocks, and unmeasured shocks can influence departures.
- Eligibility and matched panels select a subset of the global dataset. Country and event sample counts limit generalization; unknown-country calibration is explicit.
- The statistical denominator floor is a choice. Measurements are preserved and reference sensitivity is reported, but there is no single universally correct anomaly definition.
- Country/year controls and clustered intervals improve accounting for dependence but do not prove causality or remove all technological, spatial or management confounding.
- Stress intervals are exploratory; combined events are sparse, and threshold/minimum-count sensitivity can change rankings.

**Recommendation:** retain the stronger no-climate forest as a provisional predictive benchmark, not a climate-resilience conclusion. Neither C nor D should replace it as the preferred climate model on this evidence. Continue the unchanged global question with the documented association/stability findings and honest uncertainty. Before further fitting, agree a small next protocol addressing yield-reference/growth sensitivity and genuinely separated historical assessment. Do not repeatedly try features or thresholds on these same windows to chase R². A genuinely new final evaluation would require later unseen observations, outside the present fixed dataset.

## 9. Verification, artifacts and local review

Executed verification: **15 PASS, 0 FAIL**, with explicit scientific warnings. See `verification/verification_summary.md`. Checks cover matching, common records, temporal/forward separation, preprocessing, future-yield mutation, scalar reference/anomaly/metric arithmetic, event partitions/counts/SDs, regression equivalence, chart source hashes, and original-file preservation. The final report/website-review consistency check is saved separately after packaging.

Charts: `prediction_mae.png`, `prediction_by_crop.png`, `temperature_relationship.png`, `precipitation_relationship.png`, `matched_stability.png`, `event_yield_departures.png`. All numeric plot sources remain under `tables/` and are fingerprinted in `verification/chart_manifest.json`.

Main numerical files: `prediction_scores.csv`, `paired_prediction.csv`, `paired_country_crop.csv`, `country_support_sensitivity.csv`, `relationship_descriptive.csv`, `correlations.csv`, `association_regression.csv`, `event_exposure.csv`, `stability_summary.csv`, `stability_country.csv`, `stability_paired_intervals.csv`, `event_vs_neither.csv`, and `v2_reproduction.csv`. Record-level provenance and matched IDs are retained. The code guide and reproduction instructions are in the version's `README.md`.

The local `website_review/` folder contains a concise summary, strict results JSON, selected verified charts and publication notes. It is review material only. No original dataset, M3 model/result, V2 output, existing website/staging file, or research topic was changed. Nothing was committed, pushed, uploaded or published.
