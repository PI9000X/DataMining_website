# Saved-prediction demo: provenance and verification

Prepared 18 November 2026. This is a static historical explorer, not model inference or a forecast service. No models were fitted, tuned, reselected or evaluated on a new holdout during preparation.

## Verified source observations

| View | Original saved prediction output | Crop observations | Methods | Saved predictions | Countries/territories | Distinct national country-years |
|---|---|---:|---:|---:|---:|---:|
| Primary global V3 | `results/global_improvement_v3/tables/analysis_records.csv` | 6,331 | 4 | 25,324 | 142 | 2,825 |
| Secondary regional rice/maize | `results/southeast_asia_small_sample_v1/tables/predictions.csv`, filtered to `rice_maize` | 194 | 5 | 970 | 5 | 97 |

These views overlap geographically and historically; do not add their observations or predictions and call the sum independent evidence. Crop rows repeat national country-year conditions. Global country/crop coverage is uneven; the regional view deliberately excludes wheat and is not a global-model comparison.

Validation folds are 1996–2002, 2003–2009 and 2010–2015, with respective fitting cutoffs 1995, 2002 and 2009. Every exported year is in exactly its saved fold. No 2016–2024 observation is exported. The historical windows have already been examined, so they are exploratory, not an untouched independent holdout.

## Model identities and transformations

Global methods: `A_reference`, `B_no_climate`, `C_climate`, `D_interactions`. Saved source columns are already predicted yields in t/ha; the first is exactly the previous-five-year mean. Regional methods: `R_original_forest_cc`, `ridge__cc`, `ridge__fertilizer`, `tree__cc`, `forest__cc`. They are the matched rice/maize predictions, not predictions copied from another cohort or country.

Actual yield comes directly from `yield_t_ha`. Predicted yield comes directly from the selected saved model column. Raw absolute error is `abs(predicted − actual)` in t/ha. Normalized actual deviation is `100 × (actual − full) / scale`; the predicted deviation uses the exact same earlier `full` reference and `scale`. Here `scale = max(0.5 t/ha, earlier median yield)`. Source target columns match that transformation within numerical tolerance. No predicted t/ha value had to be invented or reconstructed from a fitted model.

Every observation also retains the distinct earlier five-calendar-year yield reference (`mean5`). It is the reference corrected by the forest/regression. It is not the full-history centre used to express the common evaluation target. References stay frozen through a validation block. Same-year weather and retrospectively revised fertilizer are not necessarily available before harvest; this is retrospective climate/input-conditioned evaluation, not causal identification.

## Compact files and source hashes

`assets/demo/global-v3.json` is 806,825 bytes and `assets/demo/regional-rice-maize.json` is 33,382 bytes at initial export. Both use a schema-defined wide row: ISO3, crop, year, fold, actual yield, earlier full-history expectation, historical scale, five-year reference and the extra saved predictions. Country names and method labels are stored once. The baseline mean is not unnecessarily repeated four times per observation.

Each JSON includes its original source path (relative only), original source SHA256, column order, fold windows, aggregate metrics, country names and row count. Current public-file SHA256/size values are in [the publication manifest](publication_manifest.json). `implementation_review_v1/demo_export_checks.json` records the local exhaustive source comparison and export hashes; the export script is retained locally for reproduction. No personal filesystem path, API credential, input climate/fertilizer measurement, full training dump or model binary is embedded in the demo data.

## Checks actually executed

- Every exported cell was compared directly to its exact original sorted source row with no rounding or imputation. Observation keys (`ISO3|crop|year`) are unique, and each model ID is a column on that exact record. Model/observation pairs are therefore unique without duplicating crop rows as independent exposures.
- All years and folds, finite values, positive historical scales, and the normalized target calculation were checked.
- Whole-study MAE, RMSE and R² were independently recalculated for every selected global/regional model. Global raw-yield scores were also compared with the saved raw-yield score table; regional raw-yield MAE matches its saved table. This verifies saved arithmetic, not new independent model performance.
- No exported prediction is negative. The interface nevertheless retains signed values rather than silently clipping them.
- Synthetic DOM tests exercised every country/crop availability list, first/last available global years with every model (2,584 selections), every regional observation/model (970 selections), cohort tabs, unavailable years, fetch failure and retry. Real browser rendering/focus and browser console were not tested.
- Values display to four decimal places. Error is calculated from the full saved numeric values before rounding, not by subtracting the rounded labels.

Final HTTP, link, artifact/preservation and file-count checks are summarized in [deployment readiness](website_v4_notes.md) and [artifact update summary](website_v4_notes.md). Detailed machine-readable verification remains local in `implementation_review_v1/`.

## Data attribution and reuse evidence

Yield measurements are adapted by OWID from [FAO and supplementary wheat sources](https://ourworldindata.org/grapher/wheat-yields), [FAO rice yields](https://ourworldindata.org/grapher/rice-yields), and [FAO plus USDA/NASS maize yields](https://ourworldindata.org/grapher/maize-yields). The project saved global exports on 10 November 2026; its later national fertilizer/irrigation package was retrieved on 13 November 2026. This demo uses those preserved measurements and already-saved outputs, not newly downloaded revised observations. Climate-derived predictions also acknowledge modified Copernicus Climate Change Service information, processed by OWID. Regional fertilizer was FAO → OWID; no fertilizer values are redistributed in these compact files.

Current [FAO statistical database terms](https://www.fao.org/contact-us/terms/db-terms-of-use/en), checked on 18 November 2026, state a default CC BY 4.0 licence unless the dataset's metadata/page specifies otherwise, with attribution, third-party exceptions and no implied endorsement. [OWID's reuse guidance](https://ourworldindata.org/faqs) distinguishes OWID-authored material from third-party provider terms. These are current general reuse statements, not proof that every preserved export had a recorded resource-specific licence. Saved fertilizer resource wording differs from an earlier general catalogue; that discrepancy remains documented. No blanket licence is invented for all project files or third-party data.

This proposed package supports an attributed, noncommercial educational research presentation. It omits raw datasets and full training inputs. Broader redistribution, commercial reuse, and fresh training reproduction must respect applicable resource-specific terms. No FAO, USDA, Copernicus or OWID endorsement is implied. Full open-source licensing for the team's own code has not been chosen by the team; preparation does not assign one automatically.


Website V4 note: this static export links the selected source/table files actually included in its publication manifest. Other named research paths identify the complete local archive; full training inputs and model binaries are not redistributed by this website update.
