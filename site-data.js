// Verified display values extracted from saved research tables. No prediction service.
const projectData = {
  "repository": "https://github.com/PI9000X/DataMining_website",
  "verifiedOn": "2026-11-13",
  "status": "M3 analysis complete locally · final paper in preparation",
  "statistics": {
    "originalRecords": 67299,
    "cleanedCropRecords": 23412,
    "mergedRecords": 22660,
    "entities": 173,
    "crops": 3,
    "regionalRecords": 743,
    "excludedRecords": 752,
    "duplicateKeys": 0,
    "matchedMeasurements": 67980
  },
  "cropCoverage": [
    {
      "crop": "Maize",
      "records": 8948,
      "entities": 160,
      "start": 1961,
      "end": 2025
    },
    {
      "crop": "Rice",
      "records": 6973,
      "entities": 120,
      "start": 1961,
      "end": 2024
    },
    {
      "crop": "Wheat",
      "records": 6739,
      "entities": 123,
      "start": 1961,
      "end": 2024
    }
  ],
  "sources": [
    {
      "name": "Wheat yields",
      "url": "https://ourworldindata.org/grapher/wheat-yields",
      "provider": "Food and Agriculture Organization of the United Nations (2025) and other sources – with major processing by Our World in Data",
      "variable": "Harvested production per unit of harvested area for wheat.",
      "unit": "tonnes per hectare",
      "coverage": "1275–2024 in the saved export",
      "retrieved": "2026-11-10",
      "licence": "Resource-specific licence not recorded in the saved export metadata; confirm source terms before redistribution.",
      "limitation": "Country coverage differs. Yield is production per harvested area; original provider estimation flags are not present in this export.",
      "status": "Downloaded · global study",
      "downloadUrl": "https://ourworldindata.org/grapher/wheat-yields.csv",
      "metadataUrl": "https://ourworldindata.org/grapher/wheat-yields.metadata.json",
      "geography": "Saved export: 174 named entities, including any aggregates/historical entities; selected/cleaned panel: 125 countries/territories. Coverage is uneven.",
      "sourceUpdated": "2026-03-02"
    },
    {
      "name": "Rice yields",
      "url": "https://ourworldindata.org/grapher/rice-yields",
      "provider": "Food and Agriculture Organization of the United Nations (2025) – with major processing by Our World in Data",
      "variable": "Yield is the amount produced per unit of land used, measured in tonnes per hectare.",
      "unit": "tonnes per hectare",
      "coverage": "1961–2024 in the saved export",
      "retrieved": "2026-11-10",
      "licence": "Resource-specific licence not recorded in the saved export metadata; confirm source terms before redistribution.",
      "limitation": "Country coverage differs. Yield is production per harvested area; original provider estimation flags are not present in this export.",
      "status": "Downloaded · global study",
      "downloadUrl": "https://ourworldindata.org/grapher/rice-yields.csv",
      "metadataUrl": "https://ourworldindata.org/grapher/rice-yields.metadata.json",
      "geography": "Saved export: 170 named entities, including any aggregates/historical entities; selected/cleaned panel: 124 countries/territories. Coverage is uneven.",
      "sourceUpdated": "2026-02-25"
    },
    {
      "name": "Corn yields",
      "url": "https://ourworldindata.org/grapher/maize-yields",
      "provider": "USDA National Agricultural Statistics Service (NASS) (2026); Food and Agriculture Organization of the United Nations (2025) – with major processing by Our World in Data",
      "variable": "Average corn yields measured in tonnes per hectare.",
      "unit": "tonnes per hectare",
      "coverage": "1866–2025 in the saved export",
      "retrieved": "2026-11-10",
      "licence": "Resource-specific licence not recorded in the saved export metadata; confirm source terms before redistribution.",
      "limitation": "Country coverage differs. Yield is production per harvested area; original provider estimation flags are not present in this export.",
      "status": "Downloaded · global study",
      "downloadUrl": "https://ourworldindata.org/grapher/maize-yields.csv",
      "metadataUrl": "https://ourworldindata.org/grapher/maize-yields.metadata.json",
      "geography": "Saved export: 221 named entities, including any aggregates/historical entities; selected/cleaned panel: 170 countries/territories. Coverage is uneven.",
      "sourceUpdated": "2026-03-02"
    },
    {
      "name": "Average annual surface temperature",
      "url": "https://ourworldindata.org/grapher/average-annual-surface-temperature",
      "provider": "Contains modified Copernicus Climate Change Service information (2026) – with major processing by Our World in Data",
      "variable": "Temperature of the air measured 2 meters above the ground, encompassing land, sea, and in-land water surfaces.",
      "unit": "°C",
      "coverage": "1940–2025 in the saved export",
      "retrieved": "2026-11-10",
      "licence": "Resource-specific licence not recorded in the saved export metadata; confirm source terms before redistribution.",
      "limitation": "National annual climate, not crop-area or growing-season exposure. The project calculates its own 1961–1990 anomaly reference.",
      "status": "Downloaded · global study",
      "downloadUrl": "https://ourworldindata.org/grapher/average-annual-surface-temperature.csv",
      "metadataUrl": "https://ourworldindata.org/grapher/average-annual-surface-temperature.metadata.json",
      "geography": "Saved export: 213 named entities, including any aggregates/historical entities; selected/cleaned panel: 193 countries/territories. Coverage is uneven.",
      "sourceUpdated": "2026-10-12"
    },
    {
      "name": "Annual precipitation",
      "url": "https://ourworldindata.org/grapher/average-precipitation-per-year",
      "provider": "Contains modified Copernicus Climate Change Service information (2026) – with major processing by Our World in Data",
      "variable": "Total annual precipitation—rain and snow—calculated as the sum of daily averages, reported as the depth of water falling to Earth's surface, excluding fog and dew.",
      "unit": "millimeters",
      "coverage": "1940–2025 in the saved export",
      "retrieved": "2026-11-10",
      "licence": "Resource-specific licence not recorded in the saved export metadata; confirm source terms before redistribution.",
      "limitation": "National annual climate, not crop-area or growing-season exposure. The project calculates its own 1961–1990 anomaly reference.",
      "status": "Downloaded · global study",
      "downloadUrl": "https://ourworldindata.org/grapher/average-precipitation-per-year.csv",
      "metadataUrl": "https://ourworldindata.org/grapher/average-precipitation-per-year.metadata.json",
      "geography": "Saved export: 195 named entities, including any aggregates/historical entities; selected/cleaned panel: 192 countries/territories. Coverage is uneven.",
      "sourceUpdated": "2026-10-12"
    },
    {
      "name": "Fertilizer use per hectare of cropland",
      "url": "https://ourworldindata.org/grapher/fertilizer-use-per-hectare-of-cropland?v=1&csvType=full&useColumnShortNames=false",
      "provider": "Food and Agriculture Organization of the United Nations (2025) – with major processing by Our World in Data",
      "variable": "National fertilizer nutrients per hectare of cropland (arable land + permanent crops).",
      "unit": "kilograms per hectare",
      "coverage": "303 observed country-years across five countries, 1961–2023 with gaps.",
      "retrieved": "2026-11-13",
      "licence": "Saved source readme: CC BY-NC-SA 3.0 IGO. Earlier catalogue wording differed; review terms before raw-data redistribution.",
      "limitation": "Not crop-specific application, and not the attempted World Bank measure per hectare of arable land. Historical release dates are unknown.",
      "status": "Downloaded · regional models",
      "downloadUrl": "https://ourworldindata.org/grapher/fertilizer-use-per-hectare-of-cropland.csv?v=1&csvType=full&useColumnShortNames=false",
      "metadataUrl": "https://ourworldindata.org/grapher/fertilizer-use-per-hectare-of-cropland.metadata.json?v=1&csvType=full&useColumnShortNames=false",
      "geography": "Saved export: 242 named entities, including any aggregates/historical entities; selected/cleaned panel: 5 countries/territories. Coverage is uneven.",
      "sourceUpdated": "2026-05-22"
    },
    {
      "name": "Share of agricultural land which is irrigated",
      "url": "https://ourworldindata.org/grapher/agricultural-land-irrigation?v=1&csvType=full&useColumnShortNames=false",
      "provider": "Food and Agriculture Organization of the United Nations, via World Bank (2026) – processed by Our World in Data",
      "variable": "Share of agricultural land purposely provided with water; source methodology also refers to equipped area.",
      "unit": "% of total agricultural land",
      "coverage": "18 country-years: Laos 2002–2023 with gaps; Myanmar 2016–2020. No exported observations for Thailand, Cambodia or Vietnam.",
      "retrieved": "2026-11-13",
      "licence": "Saved source readme: CC BY 4.0; attribute FAO, World Bank and OWID.",
      "limitation": "Only six pre-2016 country-years, all Laos: too sparse for this five-country modeling comparison.",
      "status": "Downloaded · excluded from models",
      "downloadUrl": "https://ourworldindata.org/grapher/agricultural-land-irrigation.csv?v=1&csvType=full&useColumnShortNames=false",
      "metadataUrl": "https://ourworldindata.org/grapher/agricultural-land-irrigation.metadata.json?v=1&csvType=full&useColumnShortNames=false",
      "geography": "Saved export: 121 named entities, including any aggregates/historical entities; selected/cleaned panel: 2 countries/territories. Coverage is uneven. Only Laos and Myanmar have selected-country observations.",
      "sourceUpdated": "2026-07-27"
    }
  ],
  "m3": [
    {
      "id": "zero_baseline",
      "method": "Zero-anomaly baseline",
      "n": 3370,
      "mae": 22.637899649209924,
      "rmse": 36.86340816011368,
      "r2": -0.0194775690290966
    },
    {
      "id": "linear_regression",
      "method": "Linear Regression",
      "n": 3370,
      "mae": 22.615019412300175,
      "rmse": 36.910364425934745,
      "r2": -0.0220764252308576
    },
    {
      "id": "decision_tree",
      "method": "Decision Tree",
      "n": 3370,
      "mae": 22.66825776943038,
      "rmse": 36.904420543892826,
      "r2": -0.0217472703904704
    },
    {
      "id": "random_forest",
      "method": "Random Forest",
      "n": 3370,
      "mae": 22.698905310821957,
      "rmse": 36.86746764413715,
      "r2": -0.0197021158620593
    }
  ],
  "v3": [
    {
      "id": "A_reference",
      "method": "Five-year reference",
      "n": 6331,
      "mae": 27.849641466684893,
      "rmse": 47.34793708358036,
      "r2": 0.2050558917665078
    },
    {
      "id": "B_no_climate",
      "method": "Random Forest, no climate",
      "n": 6331,
      "mae": 26.505075193133397,
      "rmse": 45.20779751696865,
      "r2": 0.2752951472560199
    },
    {
      "id": "C_climate",
      "method": "Random Forest + climate",
      "n": 6331,
      "mae": 26.698594466879975,
      "rmse": 45.50624331963598,
      "r2": 0.2656950759355101
    },
    {
      "id": "D_interactions",
      "method": "Random Forest + climate interactions",
      "n": 6331,
      "mae": 26.635246521912,
      "rmse": 45.24732905031724,
      "r2": 0.2740271704281769
    }
  ],
  "regional": {
    "rice_maize": [
      {
        "id": "A_reference",
        "method": "Five-year reference",
        "n": 194,
        "mae": 36.92812230317824,
        "rmse": 50.22904452945895,
        "r2": -0.1297874831199241
      },
      {
        "id": "B_country_crop",
        "method": "Country/crop forest",
        "n": 194,
        "mae": 25.78189066106388,
        "rmse": 39.25602027369479,
        "r2": 0.3099199639682085
      },
      {
        "id": "C_climate",
        "method": "Forest + climate",
        "n": 194,
        "mae": 26.20192280465848,
        "rmse": 39.94146242850134,
        "r2": 0.2856108509490058
      },
      {
        "id": "D_climate_fertilizer",
        "method": "Forest + climate + fertilizer",
        "n": 194,
        "mae": 26.77049380546231,
        "rmse": 40.761451876003406,
        "r2": 0.2559772514915395
      },
      {
        "id": "E_fertilizer",
        "method": "Forest + fertilizer, without climate",
        "n": 194,
        "mae": 26.17147191616841,
        "rmse": 40.11556723512578,
        "r2": 0.2793692333339901
      }
    ],
    "all_crops": [
      {
        "id": "A_reference",
        "method": "Five-year reference",
        "n": 220,
        "mae": 35.99116106283209,
        "rmse": 48.53718868056636,
        "r2": -0.0622992016805734
      },
      {
        "id": "B_country_crop",
        "method": "Country/crop forest",
        "n": 220,
        "mae": 26.98008961324041,
        "rmse": 39.965051099777774,
        "r2": 0.2797912982226941
      },
      {
        "id": "C_climate",
        "method": "Forest + climate",
        "n": 220,
        "mae": 27.137948549746085,
        "rmse": 40.13465636091132,
        "r2": 0.2736654269137982
      },
      {
        "id": "D_climate_fertilizer",
        "method": "Forest + climate + fertilizer",
        "n": 220,
        "mae": 27.59859265500457,
        "rmse": 40.56984914083306,
        "r2": 0.2578282750387721
      },
      {
        "id": "E_fertilizer",
        "method": "Forest + fertilizer, without climate",
        "n": 220,
        "mae": 27.473249129792624,
        "rmse": 40.57406345858153,
        "r2": 0.2576740762930857
      }
    ]
  },
  "small": {
    "rice_maize": [
      {
        "id": "A_five_year_mean",
        "method": "Five-year reference",
        "n": 194,
        "mae": 36.92812230317824,
        "rmse": 50.22904452945895,
        "r2": -0.1297874831199241
      },
      {
        "id": "R_original_forest_cc",
        "method": "Original Random Forest",
        "n": 194,
        "mae": 25.78189066106388,
        "rmse": 39.25602027369479,
        "r2": 0.3099199639682085
      },
      {
        "id": "ridge__cc",
        "method": "Ridge, country/crop",
        "n": 194,
        "mae": 24.48176880781468,
        "rmse": 38.94846771350324,
        "r2": 0.3206905156392805
      },
      {
        "id": "ridge__climate",
        "method": "Ridge + climate",
        "n": 194,
        "mae": 24.61211861037149,
        "rmse": 38.75655070928333,
        "r2": 0.3273685622884551
      },
      {
        "id": "ridge__fertilizer",
        "method": "Ridge + fertilizer",
        "n": 194,
        "mae": 24.04884610549412,
        "rmse": 38.4348318141235,
        "r2": 0.3384892670981262
      },
      {
        "id": "ridge__both",
        "method": "Ridge + climate + fertilizer",
        "n": 194,
        "mae": 24.30835826441746,
        "rmse": 38.42060607714201,
        "r2": 0.3389788613396296
      },
      {
        "id": "tree__cc",
        "method": "Shallow Tree, country/crop",
        "n": 194,
        "mae": 24.36353899218628,
        "rmse": 39.70778741785213,
        "r2": 0.2939453765700232
      },
      {
        "id": "tree__climate",
        "method": "Shallow Tree + climate",
        "n": 194,
        "mae": 25.722053196309137,
        "rmse": 40.71645753307811,
        "r2": 0.2576189171602556
      },
      {
        "id": "tree__fertilizer",
        "method": "Shallow Tree + fertilizer",
        "n": 194,
        "mae": 24.224464723293064,
        "rmse": 39.53978338991866,
        "r2": 0.2999073848890099
      },
      {
        "id": "tree__both",
        "method": "Shallow Tree + climate + fertilizer",
        "n": 194,
        "mae": 25.311404001313115,
        "rmse": 40.39230997087073,
        "r2": 0.2693921975398116
      },
      {
        "id": "forest__cc",
        "method": "Small Random Forest, country/crop",
        "n": 194,
        "mae": 24.52607766609319,
        "rmse": 39.63635258035324,
        "r2": 0.2964834947701323
      },
      {
        "id": "forest__climate",
        "method": "Small Random Forest + climate",
        "n": 194,
        "mae": 25.05830861111568,
        "rmse": 39.91901271598479,
        "r2": 0.2864136920515414
      },
      {
        "id": "forest__fertilizer",
        "method": "Small Random Forest + fertilizer",
        "n": 194,
        "mae": 24.41197361130705,
        "rmse": 39.29827331228423,
        "r2": 0.3084336354908205
      },
      {
        "id": "forest__both",
        "method": "Small Random Forest + climate + fertilizer",
        "n": 194,
        "mae": 24.55088911306073,
        "rmse": 39.30225807943869,
        "r2": 0.3082933814585191
      }
    ],
    "all_crops": [
      {
        "id": "A_five_year_mean",
        "method": "Five-year reference",
        "n": 220,
        "mae": 35.99116106283209,
        "rmse": 48.53718868056636,
        "r2": -0.0622992016805734
      },
      {
        "id": "R_original_forest_cc",
        "method": "Original Random Forest",
        "n": 220,
        "mae": 26.98008961324041,
        "rmse": 39.96505109977777,
        "r2": 0.2797912982226944
      },
      {
        "id": "ridge__cc",
        "method": "Ridge, country/crop",
        "n": 220,
        "mae": 27.09153530770117,
        "rmse": 40.34439422386404,
        "r2": 0.2660541538670465
      },
      {
        "id": "ridge__climate",
        "method": "Ridge + climate",
        "n": 220,
        "mae": 27.47126508081025,
        "rmse": 40.39705999713836,
        "r2": 0.2641367100327594
      },
      {
        "id": "ridge__fertilizer",
        "method": "Ridge + fertilizer",
        "n": 220,
        "mae": 26.607478754986488,
        "rmse": 39.84594998282875,
        "r2": 0.2840775355273733
      },
      {
        "id": "ridge__both",
        "method": "Ridge + climate + fertilizer",
        "n": 220,
        "mae": 27.022979655853668,
        "rmse": 40.06259982083638,
        "r2": 0.2762711636384252
      },
      {
        "id": "tree__cc",
        "method": "Shallow Tree, country/crop",
        "n": 220,
        "mae": 27.290277313353847,
        "rmse": 42.3219592587126,
        "r2": 0.1923389323970896
      },
      {
        "id": "tree__climate",
        "method": "Shallow Tree + climate",
        "n": 220,
        "mae": 28.16425100673005,
        "rmse": 42.96602910813277,
        "r2": 0.1675693628457114
      },
      {
        "id": "tree__fertilizer",
        "method": "Shallow Tree + fertilizer",
        "n": 220,
        "mae": 27.58311899810469,
        "rmse": 43.05979137153124,
        "r2": 0.1639322688483206
      },
      {
        "id": "tree__both",
        "method": "Shallow Tree + climate + fertilizer",
        "n": 220,
        "mae": 28.28886425629713,
        "rmse": 43.34084589370106,
        "r2": 0.1529824951815358
      },
      {
        "id": "forest__cc",
        "method": "Small Random Forest, country/crop",
        "n": 220,
        "mae": 27.31952219690543,
        "rmse": 41.062182442168265,
        "r2": 0.2397058030786767
      },
      {
        "id": "forest__climate",
        "method": "Small Random Forest + climate",
        "n": 220,
        "mae": 27.53717970724164,
        "rmse": 41.18463987143604,
        "r2": 0.2351642762424923
      },
      {
        "id": "forest__fertilizer",
        "method": "Small Random Forest + fertilizer",
        "n": 220,
        "mae": 27.37454292452945,
        "rmse": 41.07873271441125,
        "r2": 0.2390928005043313
      },
      {
        "id": "forest__both",
        "method": "Small Random Forest + climate + fertilizer",
        "n": 220,
        "mae": 27.23922628343943,
        "rmse": 40.91208594042267,
        "r2": 0.2452539217116498
      }
    ]
  },
  "smallFeatured": [
    "R_original_forest_cc",
    "ridge__cc",
    "ridge__fertilizer",
    "tree__cc",
    "forest__cc"
  ],
  "stability": [
    {
      "crop": "Wheat",
      "sd": 26.545800528831958,
      "countries": 61,
      "n": 1219
    },
    {
      "crop": "Rice",
      "sd": 21.951320204407708,
      "countries": 61,
      "n": 1219
    },
    {
      "crop": "Maize",
      "sd": 34.91420072296136,
      "countries": 61,
      "n": 1219
    }
  ],
  "correlations": [
    {
      "crop": "Maize",
      "n": 2493,
      "temperature_pearson": -0.049025121601968,
      "temperature_spearman": -0.0378744043829229,
      "rainfall_pearson": 0.0728154374716339,
      "rainfall_spearman": 0.1252912620244769
    },
    {
      "crop": "Rice",
      "n": 2021,
      "temperature_pearson": 0.0521232330655881,
      "temperature_spearman": 0.045904637874903,
      "rainfall_pearson": 0.0085945034551576,
      "rainfall_spearman": 0.0173509009464822
    },
    {
      "crop": "Wheat",
      "n": 1817,
      "temperature_pearson": -0.0326300658937655,
      "temperature_spearman": -0.0088954679297668,
      "rainfall_pearson": 0.0559450520642768,
      "rainfall_spearman": 0.0514635548363737
    }
  ],
  "methodology": [
    {
      "title": "Business understanding",
      "state": "Question fixed",
      "detail": "Define crop-yield variability and stability, retain the global question, and use Southeast Asia as a secondary case study."
    },
    {
      "title": "Data understanding",
      "state": "Completed",
      "detail": "Inspect provider metadata, source coverage, missing values and national annual measurements; explore trends and relationships."
    },
    {
      "title": "Data preparation",
      "state": "Completed & checked",
      "detail": "Standardize ISO3/year keys, preserve source values, validate joins and construct earlier-history climate/yield references."
    },
    {
      "title": "Modeling",
      "state": "Completed locally",
      "detail": "Compare a simple reference, Linear Regression, Decision Tree, Random Forest and later small-sample Ridge models."
    },
    {
      "title": "Evaluation",
      "state": "Completed with limits",
      "detail": "Preserve the original final test and use paired historical comparisons, error diagnostics, subgroup checks and stability sensitivities."
    },
    {
      "title": "Communication",
      "state": "M4 preparation",
      "detail": "Explain research through this static journal. Final paper and presentation remain in preparation; this is not a forecasting API."
    }
  ],
  "v2References": [
    {
      "id": "full",
      "method": "Full-history linear reference",
      "n": 6331,
      "mae": 31.8492588209108,
      "rmse": 53.86484148467101,
      "r2": -0.0288338471069917
    },
    {
      "id": "recent20",
      "method": "Recent 20-year linear reference",
      "n": 6331,
      "mae": 29.61229747676441,
      "rmse": 48.57369402958805,
      "r2": 0.1633636363849673
    },
    {
      "id": "mean5",
      "method": "Previous five-year mean reference",
      "n": 6331,
      "mae": 27.849641466684893,
      "rmse": 47.34793708358036,
      "r2": 0.2050558917665078
    }
  ],
  "adjustedAssociations": [
    {
      "crop": "maize",
      "term": "temperature_C",
      "coefficient": -3.327231269228993,
      "low95": -10.276427962851532,
      "high95": 3.6219654243935455,
      "n": 2493,
      "clusters": 127
    },
    {
      "crop": "maize",
      "term": "precipitation_per_10pp",
      "coefficient": 1.3785581477420836,
      "low95": -0.6337470332954023,
      "high95": 3.3908633287795693,
      "n": 2493,
      "clusters": 127
    },
    {
      "crop": "maize",
      "term": "temperature_x_precipitation",
      "coefficient": 0.5494619432421268,
      "low95": -1.501698025328668,
      "high95": 2.600621911812921,
      "n": 2493,
      "clusters": 127
    },
    {
      "crop": "rice",
      "term": "temperature_C",
      "coefficient": 0.2840702028555974,
      "low95": -4.26810595049067,
      "high95": 4.8362463562018645,
      "n": 2021,
      "clusters": 102
    },
    {
      "crop": "rice",
      "term": "precipitation_per_10pp",
      "coefficient": 0.933532153138804,
      "low95": -0.6702217798884791,
      "high95": 2.537286086166086,
      "n": 2021,
      "clusters": 102
    },
    {
      "crop": "rice",
      "term": "temperature_x_precipitation",
      "coefficient": 0.4191352252678961,
      "low95": -1.235445560329425,
      "high95": 2.0737160108652173,
      "n": 2021,
      "clusters": 102
    },
    {
      "crop": "wheat",
      "term": "temperature_C",
      "coefficient": -2.403663791555644,
      "low95": -7.821463292488425,
      "high95": 3.014135709377137,
      "n": 1817,
      "clusters": 94
    },
    {
      "crop": "wheat",
      "term": "precipitation_per_10pp",
      "coefficient": -0.0589485956257531,
      "low95": -1.608697306188681,
      "high95": 1.4908001149371746,
      "n": 1817,
      "clusters": 94
    },
    {
      "crop": "wheat",
      "term": "temperature_x_precipitation",
      "coefficient": 1.2028910645319453,
      "low95": -0.2411797751918865,
      "high95": 2.646961904255777,
      "n": 1817,
      "clusters": 94
    }
  ],
  "stabilityPairs": [
    {
      "first_crop": "wheat",
      "second_crop": "rice",
      "countries": 61,
      "difference": 4.59448032442425,
      "low95": -1.750303848554003,
      "high95": 11.93509166609834
    },
    {
      "first_crop": "wheat",
      "second_crop": "maize",
      "countries": 61,
      "difference": -8.368400194129407,
      "low95": -17.753783430414714,
      "high95": 0.6970888650556449
    },
    {
      "first_crop": "rice",
      "second_crop": "maize",
      "countries": 61,
      "difference": -12.962880518553654,
      "low95": -21.898919193688496,
      "high95": -5.355811696669921
    }
  ]
};
