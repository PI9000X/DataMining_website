// Use unique IDs and actual activity dates in YYYY-MM-DD format.
// Optional supporting links must be public resources, not private file paths.
const projectUpdates = [
  {
    id: 'preparation-audit-2026-11-10', date: '2026-11-10', milestone: 'Data preparation',
    title: 'Collection, cleaning, merging, and independent audit completed', status: 'Locally verified',
    summary: 'Prepared the multi-country crop and climate dataset and verified every merged measurement against its saved source record.',
    completed: ['Collected the five documented OWID datasets and preserved original files.', 'Inspected missing values, units, duplicate keys, numeric types, and invalid measurements.', 'Merged on ISO3 and year, logged incomplete climate matches, and retained flagged outliers.', 'Independently checked coverage, join cardinality, and raw-to-merged values.'],
    issues: ['Country and crop coverage is unequal; the latest year contains only US maize.', 'Historical boundaries and crop-season alignment remain partly unverified.', 'Local consistency does not independently certify all upstream estimates.'],
    nextSteps: ['Agree a consistent analysis sample and investigate flagged observations.', 'Define climate references and country/crop yield trends without test-period leakage.', 'Begin exploratory analysis before implementing the planned regressors.'],
    links: [{ label: 'OWID crop-yield documentation', url: 'https://ourworldindata.org/crop-yields' }]
  },
  {
    id: 'website-launched-2026-11-01', date: '2026-11-01', milestone: 'Website',
    title: 'Project documentation website launched', status: 'Completed',
    summary: "Set up a public research journal to share the project's methodology, progress, data sources, and eventual results.",
    completed: [], issues: [], nextSteps: [], links: []
  },
  {
    id: 'research-direction-2026-10-28', date: '2026-10-28', milestone: 'Planning',
    title: 'Research direction established', status: 'Scoped',
    summary: 'Defined the research question around unusually high temperatures, low rainfall, and crop yield variability. Planned a comparison of linear regression, decision tree, and random forest models.',
    completed: [], issues: [], nextSteps: [], links: []
  }
];
