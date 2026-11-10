// Public preparation summary, verified 2026-11-10 against saved CSVs and audits.
// Keep numerical figures here rather than duplicating them in page templates.
const projectData = {
  repository: 'https://github.com/PI9000X/DataMining_website',
  verifiedOn: '2026-11-10',
  status: 'Data preparation verified; analysis pending',
  statistics: { originalRecords: 67299, cleanedCropRecords: 23412, mergedRecords: 22660, entities: 173, crops: 3, thailandRecords: 167, excludedRecords: 752, duplicateKeys: 0, matchedMeasurements: 67980 },
  cropCoverage: [
    { crop: 'Maize', records: 8948, entities: 160, start: 1961, end: 2025 },
    { crop: 'Rice', records: 6973, entities: 120, start: 1961, end: 2024 },
    { crop: 'Wheat', records: 6739, entities: 123, start: 1961, end: 2024 }
  ],
  sources: [
    { name: 'Wheat yield', url: 'https://ourworldindata.org/grapher/wheat-yields', detail: 'FAOSTAT and supplemental historical sources, processed by OWID.' },
    { name: 'Rice yield', url: 'https://ourworldindata.org/grapher/rice-yields', detail: 'FAOSTAT, processed by OWID.' },
    { name: 'Maize yield', url: 'https://ourworldindata.org/grapher/maize-yields', detail: 'FAOSTAT and USDA/NASS, processed by OWID.' },
    { name: 'Annual temperature', url: 'https://ourworldindata.org/grapher/average-annual-surface-temperature', detail: 'ERA5/Copernicus country-area averages, processed by OWID.' },
    { name: 'Annual precipitation', url: 'https://ourworldindata.org/grapher/average-precipitation-per-year', detail: 'ERA5/Copernicus annual totals, including rain and snow, processed by OWID.' }
  ],
  workflow: [
    { title: 'Original datasets', detail: 'Preserved original CSVs, metadata, retrieval dates, and checksums.' },
    { title: 'Data inspection', detail: 'Inspected shapes, types, missing values, units, identifiers, and duplicates.' },
    { title: 'Data cleaning', detail: 'Standardized columns, checked numeric values and current ISO3 codes, and retained flagged outliers.' },
    { title: 'Country/year matching', detail: 'Matched ISO3 country code AND year, using unique climate keys and validated join cardinality.' },
    { title: 'Merged dataset', detail: 'Retained crop observations with both climate measurements. Logged exclusions separately.' },
    { title: 'Independent validation', detail: 'Reconciled every merged measurement with its saved source and checked keys, coverage, and row counts.' }
  ],
  methodology: [
    { title: 'Business Understanding', state: 'Scoped', kind: 'verified', detail: 'Defined the question, selected crops, multi-country comparison, and Thailand case study.' },
    { title: 'Data Understanding', state: 'Collection verified; EDA pending', kind: 'partial', detail: 'Collected sources and inspected coverage and quality. Exploratory statistical analysis remains pending.' },
    { title: 'Data Preparation', state: 'Completed and locally verified', kind: 'verified', detail: 'Cleaned, integrated, and audited country-year data, with limitations documented.' },
    { title: 'Modeling', state: 'Pending', kind: 'pending', detail: 'Anomaly definitions, yield detrending, leakage-safe features, and regression models are planned.' },
    { title: 'Evaluation', state: 'Pending', kind: 'pending', detail: 'Chronological testing, baseline comparisons, and error metrics have not been completed.' },
    { title: 'Deployment / Communication', state: 'Progress journal; findings pending', kind: 'partial', detail: 'Communicate verified preparation progress. Publication of final conclusions is pending.' }
  ]
};
