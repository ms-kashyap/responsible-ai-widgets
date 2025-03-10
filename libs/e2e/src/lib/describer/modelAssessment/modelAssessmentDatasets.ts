// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IModelAssessmentData } from "./IModelAssessmentData";

export const regExForNumbersWithBrackets = /^\((\d+)\)$/; // Ex: (60)

const modelAssessmentDatasets: { [name: string]: IModelAssessmentData } = {
  CensusClassificationModelDebugging: {
    causalAnalysisData: {
      hasCausalAnalysisComponent: false
    },
    cohortDefaultName: "All data",
    datasetExplorerData: {
      cohortDatasetNewValue: "40",
      colorValueButton: "Predicted Y",
      datasetBarLabel: [
        "0 - 99",
        "100 - 199",
        "200 - 299",
        "300 - 399",
        "400 - 499"
      ],
      defaultXAxis: "Index",
      defaultYAxis: "age"
    },
    errorAnalysisData: {
      hasErrorAnalysisComponent: true
    },
    featureImportanceData: {
      datapoint: 500,
      dropdownRowName: "Row 34",
      hasCorrectIncorrectDatapoints: true,
      hasFeatureImportanceComponent: true,
      newFeatureDropdownValue: "workclass",
      noDataset: false,
      noFeatureImportance: false,
      noLocalImportance: false,
      topFeaturesCurrentValue: "4",
      topFeaturesText: "Top 4 features by their importance"
    },
    featureNames: [
      "marital-status",
      "education-num",
      "capital-gain",
      "age",
      "hours-per-week",
      "relationship",
      "occupation",
      "workclass",
      "native-country",
      "fnlwgt",
      "race",
      "gender",
      "education",
      "capital-loss"
    ],
    modelStatisticsData: {
      cohortDropDownValues: [
        "All data",
        "Cohort Age and Hours-Per-Week",
        "Cohort Marital-Status",
        "Cohort Index",
        "Cohort Predicted Y",
        "Cohort True Y"
      ],
      defaultXAxis: "Probability : <=50K",
      defaultXAxisPanelValue: "Prediction probabilities",
      defaultYAxis: "Cohort",
      hasModelStatisticsComponent: true,
      hasSideBar: true,
      xAxisNewValue: "Probability : <=50K",
      yAxisNewPanelValue: "Dataset",
      yAxisNewValue: "age",
      yAxisNumberOfBins: "5"
    },
    whatIfCounterfactualsData: {
      checkForClassField: true,
      classValue: "Probability : <=50K",
      columnHeaderAfterSort: "capital-gain",
      columnHeaderBeforeSort: "age",
      createYourOwnCounterfactualDecimalInput: "18.5",
      createYourOwnCounterfactualInputFieldUpdated: "25",
      hasWhatIfCounterfactualsComponent: true,
      newClassValue: "Probability : >50K",
      searchBarQuery: "occupation",
      selectedDatapoint: "Index 1",
      whatIfNameLabel: "Copy of row 1",
      whatIfNameLabelUpdated: "New Copy of row 1",
      yAxisNewValue: "occupation",
      yAxisValue: "age"
    }
  },
  DiabetesDecisionMaking: {
    causalAnalysisData: {
      binaryDescription:
        "On average in this sample, turning on this feature will cause the predictions of the target to increase/decrease by X units.",
      continuousDescription:
        "On average in this sample, increasing this feature by 1 unit will cause the predictions of the target to increase/decrease by X units.",
      featureListInCausalTable: ["s2(num)", "bmi(num)", "bp(num)"],
      hasCausalAnalysisComponent: true
    },
    cohortDefaultName: "All data",
    datasetExplorerData: {
      cohortDatasetNewValue: "0.05",
      colorValueButton: "Predicted Y",
      datasetBarLabel: ["0 - 17", "18 - 35", "36 - 52", "53 - 70", "71 - 88"],
      defaultXAxis: "Index",
      defaultYAxis: "age"
    },
    errorAnalysisData: {
      hasErrorAnalysisComponent: false
    },
    featureImportanceData: {
      datapoint: 89,
      hasFeatureImportanceComponent: false
    },
    featureNames: [
      "s5",
      "bmi",
      "bp",
      "s3",
      "sex",
      "s1",
      "s4",
      "s2",
      "age",
      "s6"
    ],
    isRegression: true,
    modelStatisticsData: {
      cohortDropDownValues: [
        "All data",
        "Cohort Index",
        "Cohort Predicted Y",
        "Cohort True Y",
        "Cohort Regression Error",
        "Cohort Age and BMI"
      ],
      defaultXAxis: "Error",
      defaultXAxisPanelValue: "Error",
      defaultYAxis: "Cohort",
      hasModelStatisticsComponent: true,
      hasSideBar: true,
      xAxisNewValue: "Error",
      yAxisNewPanelValue: "Dataset",
      yAxisNewValue: "age",
      yAxisNumberOfBins: "5"
    },
    whatIfCounterfactualsData: {
      checkForClassField: false,
      columnHeaderAfterSort: "s5",
      columnHeaderBeforeSort: "age",
      createYourOwnCounterfactualDecimalInput: "18.5",
      createYourOwnCounterfactualInputFieldUpdated: "25",
      hasWhatIfCounterfactualsComponent: true,
      searchBarQuery: "sex",
      selectedDatapoint: "Index 1",
      whatIfNameLabel: "Copy of row 1",
      whatIfNameLabelUpdated: "New Copy of row 1",
      yAxisNewValue: "s3",
      yAxisValue: "age"
    }
  },
  DiabetesRegressionModelDebugging: {
    causalAnalysisData: {
      hasCausalAnalysisComponent: false
    },
    cohortDefaultName: "All data",
    datasetExplorerData: {
      cohortDatasetNewValue: "0.05",
      colorValueButton: "Predicted Y",
      datasetBarLabel: ["0 - 17", "18 - 35", "36 - 52", "53 - 70", "71 - 88"],
      defaultXAxis: "Index",
      defaultYAxis: "age"
    },
    errorAnalysisData: {
      hasErrorAnalysisComponent: true
    },
    featureImportanceData: {
      datapoint: 89,
      dropdownRowName: "Row 4",
      hasCorrectIncorrectDatapoints: false,
      hasFeatureImportanceComponent: true,
      newFeatureDropdownValue: "bp",
      noDataset: false,
      noFeatureImportance: false,
      noLocalImportance: false,
      topFeaturesCurrentValue: "4",
      topFeaturesText: "Top 4 features by their importance"
    },
    featureNames: [
      "s5",
      "bmi",
      "bp",
      "s3",
      "sex",
      "s1",
      "s4",
      "s2",
      "age",
      "s6"
    ],
    isRegression: true,
    modelStatisticsData: {
      cohortDropDownValues: ["All data"],
      defaultXAxis: "Error",
      defaultXAxisPanelValue: "Error",
      defaultYAxis: "Cohort",
      hasModelStatisticsComponent: true,
      hasSideBar: true,
      xAxisNewValue: "Error",
      yAxisNewPanelValue: "Dataset",
      yAxisNewValue: "age",
      yAxisNumberOfBins: "5"
    },
    whatIfCounterfactualsData: {
      checkForClassField: false,
      columnHeaderAfterSort: "s5",
      columnHeaderBeforeSort: "age",
      createYourOwnCounterfactualDecimalInput: "18.5",
      createYourOwnCounterfactualInputFieldUpdated: "25",
      hasWhatIfCounterfactualsComponent: true,
      searchBarQuery: "s6",
      selectedDatapoint: "Index 1",
      whatIfNameLabel: "Copy of row 1",
      whatIfNameLabelUpdated: "New Copy of row 1",
      yAxisNewValue: "bmi",
      yAxisValue: "age"
    }
  },
  HousingClassificationModelDebugging: {
    causalAnalysisData: {
      hasCausalAnalysisComponent: false
    },
    cohortDefaultName: "All data",
    datasetExplorerData: {
      cohortDatasetNewValue: "150",
      colorValueButton: "Predicted Y",
      datasetBarLabel: [
        "0 - 145",
        "146 - 291",
        "292 - 437",
        "438 - 583",
        "584 - 729"
      ],
      defaultXAxis: "Index",
      defaultYAxis: "LotFrontage"
    },
    errorAnalysisData: {
      hasErrorAnalysisComponent: true
    },
    featureImportanceData: {
      datapoint: 730,
      dropdownRowName: "Row 84",
      hasCorrectIncorrectDatapoints: true,
      hasFeatureImportanceComponent: true,
      newFeatureDropdownValue: "OverallQual",
      noDataset: false,
      noFeatureImportance: false,
      noLocalImportance: false,
      topFeaturesCurrentValue: "4",
      topFeaturesText: "Top 4 features by their importance"
    },
    featureNames: [
      "LotFrontage",
      "LotArea",
      "OverallQual",
      "OverallCond",
      "YearBuilt",
      "YearRemodAdd",
      "BsmtUnfSF",
      "TotalBsmtSF",
      "Ce0tralAir",
      "1stFlrSF",
      "2ndFlrSF",
      "LowQualFinSF",
      "GrLivArea",
      "BsmtFullBath",
      "BsmtHalfBath",
      "FullBath",
      "HalfBath",
      "BedroomAbvGr",
      "KitchenAbvGr",
      "TotRmsAbvGrd",
      "Fireplaces",
      "GarageYrBlt",
      "GarageCars",
      "GarageArea",
      "PavedDrive",
      "WoodDeckSF",
      "OpenPorchSF",
      "EnclosedPorch",
      "3SsnPorch",
      "ScreenPorch",
      "PoolArea",
      "YrSold"
    ],
    modelStatisticsData: {
      cohortDropDownValues: ["All data"],
      defaultXAxis: "Probability : Less than median",
      defaultXAxisPanelValue: "Prediction probabilities",
      defaultYAxis: "Cohort",
      hasModelStatisticsComponent: true,
      hasSideBar: true,
      xAxisNewValue: "Probability : Less than median",
      yAxisNewPanelValue: "Dataset",
      yAxisNewValue: "LotFrontage",
      yAxisNumberOfBins: "5"
    },
    whatIfCounterfactualsData: {
      checkForClassField: true,
      classValue: "Probability : Less than median",
      columnHeaderAfterSort: "OverallQual",
      columnHeaderBeforeSort: "LotFrontage",
      createYourOwnCounterfactualDecimalInput: "18.5",
      createYourOwnCounterfactualInputFieldUpdated: "25",
      hasWhatIfCounterfactualsComponent: true,
      newClassValue: "Probability : More than median",
      searchBarQuery: "Wood",
      selectedDatapoint: "Index 1",
      whatIfNameLabel: "Copy of row 1",
      whatIfNameLabelUpdated: "New Copy of row 1",
      yAxisNewValue: "1stFlrSF",
      yAxisValue: "LotFrontage"
    }
  },
  HousingDecisionMaking: {
    causalAnalysisData: {
      binaryDescription:
        "On average in this sample, turning on this feature will cause the predictions of the target to increase/decrease by X units.",
      continuousDescription:
        "On average in this sample, increasing this feature by 1 unit will cause the predictions of the target to increase/decrease by X units.",
      featureListInCausalTable: [
        "GarageCars(num)",
        "OverallQual(num)",
        "Fireplaces(num)",
        "OverallCond(num)",
        "ScreenPorch(num)"
      ],
      hasCausalAnalysisComponent: true
    },
    cohortDefaultName: "All data",
    datasetExplorerData: {
      cohortDatasetNewValue: "100",
      colorValueButton: "Index",
      datasetBarLabel: [
        "0 - 145",
        "146 - 291",
        "292 - 437",
        "438 - 583",
        "584 - 729"
      ],
      defaultXAxis: "Index",
      defaultYAxis: "LotFrontage"
    },
    errorAnalysisData: {
      hasErrorAnalysisComponent: false
    },
    featureImportanceData: {
      hasFeatureImportanceComponent: false
    },
    featureNames: [
      "LotFrontage",
      "LotArea",
      "OverallQual",
      "OverallCond",
      "YearBuilt",
      "YearRemodAdd",
      "BsmtUnfSF",
      "TotalBsmtSF",
      "Ce0tralAir",
      "1stFlrSF",
      "2ndFlrSF",
      "LowQualFinSF",
      "GrLivArea",
      "BsmtFullBath",
      "BsmtHalfBath",
      "FullBath",
      "HalfBath",
      "BedroomAbvGr",
      "KitchenAbvGr",
      "TotRmsAbvGrd",
      "Fireplaces",
      "GarageYrBlt",
      "GarageCars",
      "GarageArea",
      "PavedDrive",
      "WoodDeckSF",
      "OpenPorchSF",
      "EnclosedPorch",
      "3SsnPorch",
      "ScreenPorch",
      "PoolArea",
      "YrSold"
    ],
    modelStatisticsData: {
      cohortDropDownValues: ["All data"],
      hasModelStatisticsComponent: false,
      hasSideBar: false
    },
    whatIfCounterfactualsData: {
      hasWhatIfCounterfactualsComponent: false
    }
  },
  MulticlassDnnModelDebugging: {
    causalAnalysisData: {
      hasCausalAnalysisComponent: false
    },
    cohortDefaultName: "All data",
    datasetExplorerData: {
      cohortDatasetNewValue: "14.5",
      colorValueButton: "Predicted Y",
      datasetBarLabel: ["0 - 17", "18 - 35", "36 - 52", "53 - 70", "71 - 88"],
      defaultXAxis: "Index",
      defaultYAxis: "alcohol"
    },
    errorAnalysisData: {
      hasErrorAnalysisComponent: true
    },
    featureImportanceData: {
      datapoint: 500,
      dropdownRowName: "Row 24",
      hasCorrectIncorrectDatapoints: true,
      hasFeatureImportanceComponent: true,
      newFeatureDropdownValue: "ash",
      noDataset: false,
      noFeatureImportance: false,
      noLocalImportance: false,
      rowToSelect: "24",
      topFeaturesCurrentValue: "4",
      topFeaturesText: "Top 4 features by their importance"
    },
    featureNames: [
      "total_phenols",
      "proline",
      "hue",
      "alcohol",
      "proanthocyanins",
      "od280/od315_of_diluted_wines",
      "malic_acid",
      "ash",
      "alcalinity_of_ash",
      "magnesium",
      "flavanoids",
      "nonflavanoid_phenols",
      "color_intensity"
    ],
    isMulticlass: true,
    modelStatisticsData: {
      cohortDropDownValues: ["All data"],
      defaultXAxis: "Predicted Y",
      defaultXAxisPanelValue: "Prediction probabilities",
      defaultYAxis: "Cohort",
      hasModelStatisticsComponent: true,
      hasSideBar: false,
      xAxisNewValue: "Probability : 0",
      yAxisNewPanelValue: "Dataset",
      yAxisNewValue: "alcohol",
      yAxisNumberOfBins: "5"
    },
    whatIfCounterfactualsData: {
      hasWhatIfCounterfactualsComponent: false
    }
  }
};

const withType: {
  [key in keyof typeof modelAssessmentDatasets]: IModelAssessmentData;
} = modelAssessmentDatasets;

export { withType as modelAssessmentDatasets };
