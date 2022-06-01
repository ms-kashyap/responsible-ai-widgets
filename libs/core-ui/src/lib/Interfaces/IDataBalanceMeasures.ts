// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { localization } from "@responsible-ai/localization";

export interface IDataBalanceMeasures {
  aggregateBalanceMeasures?: IAggregateBalanceMeasures;
  distributionBalanceMeasures?: IDistributionBalanceMeasure[];
  featureBalanceMeasures?: IFeatureBalanceMeasure[];
}

export interface IAggregateBalanceMeasures {
  atkinsonIndex: number;
  theilLIndex: number;
  theilTIndex: number;
}

export interface IDistributionBalanceMeasure {
  chiSquarePValue: number;
  chiSquareStatistic: number;
  FeatureName: string;
  infNormDist: number;
  jsDist: number;
  klDivergence: number;
  totalVariationDist: number;
  wassersteinDist: number;
}

export interface IFeatureBalanceMeasure {
  ClassA: string;
  ClassB: string;
  FeatureName: string;
  statisticalParity: number;
  pointwiseMutualInfo: number;
  sorensenDiceCoefficient: number;
  jaccardIndex: number;
  kendallRankCorrelation: number;
  logLikelihoodRatio: number;
  tTest: number;
}

const featureBalanceMeasures =
  localization.ModelAssessment.DataBalance.FeatureBalanceMeasures.Measures;

interface IApprovedFeatureBalanceMeasure {
  Description: string;
  KeyName: string;
  // If the measure doesn't exist for ClassA vs. ClassB, that means it may exist for ClassB vs. ClassA
  // Thus, we can flip the value to work for ClassB vs. ClassA by multiplying it with a coefficient
  // If the measure is symmetric, coefficient = 1; if the measure depends on order, coefficient = -1
  Coefficient: number;
  Range: [number, number];
}

// TODO: Fix coefficients and ranges
export const ApprovedFeatureBalanceMeasures = new Map<
  string,
  IApprovedFeatureBalanceMeasure
>([
  [
    featureBalanceMeasures.StatisticalParity.Name,
    {
      Coefficient: -1,
      Description: featureBalanceMeasures.StatisticalParity.Description,
      KeyName: "statisticalParity",
      Range: [-1, 1]
    }
  ],
  [
    featureBalanceMeasures.PointwiseMutualInformation.Name,
    {
      Coefficient: 1,
      Description:
        featureBalanceMeasures.PointwiseMutualInformation.Description,
      KeyName: "pointwiseMutualInfo",
      Range: [-1, 1]
    }
  ],
  [
    featureBalanceMeasures.SorensenDiceCoefficient.Name,
    {
      Coefficient: 1,
      Description: featureBalanceMeasures.SorensenDiceCoefficient.Description,
      KeyName: "sorensenDiceCoefficient",
      Range: [-1, 1]
    }
  ],
  [
    featureBalanceMeasures.JaccardIndex.Name,
    {
      Coefficient: 1,
      Description: featureBalanceMeasures.JaccardIndex.Description,
      KeyName: "jaccardIndex",
      Range: [-1, 1]
    }
  ],
  [
    featureBalanceMeasures.KendallRankCorrelation.Name,
    {
      Coefficient: 1,
      Description: featureBalanceMeasures.KendallRankCorrelation.Description,
      KeyName: "kendallRankCorrelation",
      Range: [-1, 1]
    }
  ],
  [
    featureBalanceMeasures.LogLikelihoodRatio.Name,
    {
      Coefficient: 1,
      Description: featureBalanceMeasures.LogLikelihoodRatio.Description,
      KeyName: "logLikelihoodRatio",
      Range: [-1, 1]
    }
  ],
  [
    featureBalanceMeasures.TTest.Name,
    {
      Coefficient: 1,
      Description: featureBalanceMeasures.TTest.Description,
      KeyName: "tTest",
      Range: [-1, 1]
    }
  ]
]);
