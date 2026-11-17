// Recorded research history; same-day ordering follows experiment dependencies.
const projectUpdates = [
  {
    "id": "preparation-audit-2026-11-10",
    "date": "2026-11-10",
    "milestone": "Data preparation",
    "title": "Collection, cleaning, merging, and independent audit completed",
    "status": "Locally verified",
    "summary": "Prepared the multi-country crop and climate dataset and verified every merged measurement against its saved source record.",
    "completed": [
      "Collected the five documented OWID datasets and preserved original files.",
      "Inspected missing values, units, duplicate keys, numeric types, and invalid measurements.",
      "Merged on ISO3 and year, logged incomplete climate matches, and retained flagged outliers.",
      "Independently checked coverage, join cardinality, and raw-to-merged values."
    ],
    "issues": [
      "Country and crop coverage is unequal; the latest year contains only US maize.",
      "Historical boundaries and crop-season alignment remain partly unverified.",
      "Local consistency does not independently certify all upstream estimates."
    ],
    "nextSteps": [
      "Agree a consistent analysis sample and investigate flagged observations.",
      "Define climate references and country/crop yield trends without test-period leakage.",
      "Begin exploratory analysis before implementing the planned regressors."
    ],
    "links": [
      {
        "label": "OWID crop-yield documentation",
        "url": "https://ourworldindata.org/crop-yields"
      }
    ]
  },
  {
    "id": "website-launched-2026-11-01",
    "date": "2026-11-01",
    "milestone": "Website",
    "title": "Project documentation website launched",
    "status": "Completed",
    "summary": "Set up a public research journal to share the project's methodology, progress, data sources, and eventual results.",
    "completed": [],
    "issues": [],
    "nextSteps": [],
    "links": []
  },
  {
    "id": "research-direction-2026-10-28",
    "date": "2026-10-28",
    "milestone": "Planning",
    "title": "Research direction established",
    "status": "Scoped",
    "summary": "Defined the research question around unusually high temperatures, low rainfall, and crop yield variability. Planned a comparison of linear regression, decision tree, and random forest models.",
    "completed": [],
    "issues": [],
    "nextSteps": [],
    "links": []
  },
  {
    "id": "milestone3-analysis-2026-11-12",
    "date": "2026-11-12",
    "order": 1,
    "milestone": "Milestone 3",
    "title": "Original global analysis and regression completed",
    "summary": "Evaluated the zero-anomaly baseline, Linear Regression, Decision Tree and Random Forest on the same original chronological test records.",
    "completed": [
      "Completed EDA, anomaly definitions and model comparisons.",
      "Preserved all four original negative test R² results.",
      "Saved trained pipelines, figures, sample counts and verification."
    ],
    "issues": [
      "Annual climate inputs showed little additional predictive skill.",
      "A long yield trend and small expected-yield denominators complicated the target."
    ],
    "nextSteps": [
      "Investigate reference construction and prediction errors before claiming improvement."
    ],
    "status": "Completed locally",
    "links": []
  },
  {
    "id": "diagnostics-2026-11-12",
    "date": "2026-11-12",
    "order": 2,
    "milestone": "Research review",
    "title": "Diagnosed poor prediction and stability uncertainty",
    "summary": "Inspected frozen errors, tested historical feature/reference alternatives and examined crop coverage and stress-sample sensitivities.",
    "completed": [
      "Preserved original test predictions and measured error concentration.",
      "Compared feature alternatives using historical years through 2015."
    ],
    "issues": [
      "Historical windows were already examined.",
      "Large percentage anomalies do not automatically prove bad measurements."
    ],
    "nextSteps": [
      "Use a common scale and forward-only reference calibration."
    ],
    "status": "Completed locally",
    "links": []
  },
  {
    "id": "global-v2-2026-11-13",
    "date": "2026-11-13",
    "order": 1,
    "milestone": "Global research",
    "title": "Global V2 strengthened yield references and evaluation",
    "summary": "Compared 33 fixed reference/correction approaches on identical eligible historical observations.",
    "completed": [
      "Compared full-history, recent 20-year and five-year references.",
      "Used shared historical-scale targets and earlier-block calibration."
    ],
    "issues": [
      "No climate variant improved aggregate MAE over its matched no-climate control."
    ],
    "nextSteps": [
      "Separate predictive results, climate associations and matched stability."
    ],
    "status": "Completed locally",
    "links": []
  },
  {
    "id": "global-v3-2026-11-13",
    "date": "2026-11-13",
    "order": 2,
    "milestone": "Global research",
    "title": "Global V3 added paired evidence and matched stability",
    "summary": "Retained four fixed prediction approaches and added adjusted climate associations, paired uncertainty and matched event comparisons.",
    "completed": [
      "Reproduced the selected V2 predictions.",
      "Compared crops on identical country-years with equal-country weights."
    ],
    "issues": [
      "Rice–wheat separation was uncertain under the primary reference.",
      "Combined hot/dry events were too sparse for a reliable resilience ranking."
    ],
    "nextSteps": [
      "Keep uncertainty and sample support next to every claim."
    ],
    "status": "Completed locally",
    "links": []
  },
  {
    "id": "regional-sources-2026-11-13",
    "date": "2026-11-13",
    "order": 3,
    "milestone": "Regional case study",
    "title": "Verified real fertilizer and irrigation enrichment",
    "summary": "After direct API failures, obtained public OWID exports and joined observed national inputs into a separate five-country panel.",
    "completed": [
      "Verified 303 fertilizer and 18 irrigation country-years.",
      "Preserved all 743 original regional crop rows and source lineage."
    ],
    "issues": [
      "Only six irrigation country-years were before 2016, all Laos.",
      "Revised national inputs are not crop-specific or proven available in advance."
    ],
    "nextSteps": [
      "Exclude irrigation and compare fertilizer only where actually observed."
    ],
    "status": "Completed locally",
    "links": []
  },
  {
    "id": "regional-fixed-forest-2026-11-13",
    "date": "2026-11-13",
    "order": 4,
    "milestone": "Regional case study",
    "title": "Initial regional forests exposed a capacity limit",
    "summary": "Compared five shared-reference approaches on identical observed-fertilizer historical records.",
    "completed": [
      "Kept separate all-crop and rice/maize cohorts.",
      "Reported the absence of consistent fertilizer improvement."
    ],
    "issues": [
      "All 80 early rice/maize trees had one leaf under the restrictive settings."
    ],
    "nextSteps": [
      "Prespecify simpler models appropriate to the small calibration sample."
    ],
    "status": "Completed locally",
    "links": []
  },
  {
    "id": "regional-small-sample-2026-11-13",
    "date": "2026-11-13",
    "order": 5,
    "milestone": "Regional case study",
    "title": "Tested fixed small-sample Ridge, tree and forest models",
    "summary": "Relaxed the capacity restriction without a parameter search; checked feature gains and subgroup consistency.",
    "completed": [
      "Verified actual splits and training-only preprocessing.",
      "Compared country/crop, climate, fertilizer and both feature sets."
    ],
    "issues": [
      "Lowest average Ridge/fertilizer MAE depended strongly on Vietnam and the earliest period.",
      "Wheat errors worsened; no feature contrast passed the consistency screen."
    ],
    "nextSteps": [
      "Retain provisional benchmarks and seek independent evidence instead of repeatedly tuning these years."
    ],
    "status": "Completed locally",
    "links": []
  },
  {
    "id": "research-documentation-2026-11-13",
    "date": "2026-11-13",
    "order": 6,
    "milestone": "Milestone 4 preparation",
    "title": "Consolidated research history and verification",
    "summary": "Prepared a complete local history, compatible model catalogue, figure inventory, website copy and conference-paper plan.",
    "completed": [
      "Reconciled saved numerical evidence and documented missing source/rubric information."
    ],
    "issues": [
      "Official rubric, final paper template and deadline still require confirmation."
    ],
    "nextSteps": [
      "Write the final paper and presentation; review attribution and public artifact scope."
    ],
    "status": "In preparation",
    "links": []
  },
  {
    "id": "website-research-update-2026-11-13",
    "date": "2026-11-13",
    "order": 7,
    "milestone": "Website",
    "title": "Integrated completed research into the existing journal",
    "summary": "Expanded the existing website files with separate evaluation panels, source context, verified figures and the research pathway.",
    "completed": [
      "Kept global work primary and regional results secondary.",
      "Prepared a readable static evidence guide and derived comparison CSV."
    ],
    "issues": [
      "This update is local; it is not evidence of publication or lecturer acceptance."
    ],
    "nextSteps": [
      "Review the local preview before any separately authorized publication."
    ],
    "status": "Local update ready for review",
    "links": []
  }
];
