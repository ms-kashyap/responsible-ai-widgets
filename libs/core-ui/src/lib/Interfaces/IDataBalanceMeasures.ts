// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { localization } from "@responsible-ai/localization";

export interface IDataBalanceMeasures {
  aggregateBalanceMeasures?: IAggregateBalanceMeasures;
  distributionBalanceMeasures?: IDistributionBalanceMeasures;
  featureBalanceMeasures?: IFeatureBalanceMeasures;
}

export interface IAggregateBalanceMeasures {
  atkinsonIndex: number;
  theilLIndex: number;
  theilTIndex: number;
}

export interface IDistributionBalanceMeasures {
  [key: string]: IDistributionBalanceMeasure;
}

export interface IDistributionBalanceMeasure {
  chiSquarePValue: number;
  chiSquareStatistic: number;
  infNormDist: number;
  jsDist: number;
  klDivergence: number;
  totalVariationDist: number;
  wassersteinDist: number;
}

const distLocalization =
  localization.ModelAssessment.DataBalance.DistributionBalanceMeasures.Measures;

interface IApprovedDistributionBalanceMeasure {
  Description: string;
  KeyName: string;
}

export const ApprovedDistributionBalanceMeasures = new Map<
  string,
  IApprovedDistributionBalanceMeasure
>([
  [
    distLocalization.ChiSquarePValue.Name,
    {
      Description: distLocalization.ChiSquarePValue.Description,
      KeyName: "chiSquarePValue"
    }
  ],
  [
    distLocalization.ChiSquareStatistic.Name,
    {
      Description: distLocalization.ChiSquareStatistic.Description,
      KeyName: "chiSquareStatistic"
    }
  ],
  [
    distLocalization.InfiniteNormDistance.Name,
    {
      Description: distLocalization.InfiniteNormDistance.Description,
      KeyName: "infNormDist"
    }
  ],
  [
    distLocalization.JSDistance.Name,
    {
      Description: distLocalization.JSDistance.Description,
      KeyName: "jsDist"
    }
  ],
  [
    distLocalization.KLDivergence.Name,
    {
      Description: distLocalization.KLDivergence.Description,
      KeyName: "klDivergence"
    }
  ],
  [
    distLocalization.TotalVariationDistance.Name,
    {
      Description: distLocalization.TotalVariationDistance.Description,
      KeyName: "totalVariationDist"
    }
  ],
  [
    distLocalization.WassersteinDistance.Name,
    {
      Description: distLocalization.WassersteinDistance.Description,
      KeyName: "wassersteinDist"
    }
  ]
]);

export interface IFeatureBalanceMeasures {
  [key: string]: IFeatureBalanceMeasure[];
}

export interface IFeatureBalanceMeasure {
  ClassA: string;
  ClassB: string;
  statisticalParity: number;
  pointwiseMutualInfo: number;
  sorensenDiceCoefficient: number;
  jaccardIndex: number;
  kendallRankCorrelation: number;
  logLikelihoodRatio: number;
  tTest: number;
}

const featLocalization =
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
    featLocalization.StatisticalParity.Name,
    {
      Coefficient: -1,
      Description: featLocalization.StatisticalParity.Description,
      KeyName: "statisticalParity",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.PointwiseMutualInformation.Name,
    {
      Coefficient: 1,
      Description: featLocalization.PointwiseMutualInformation.Description,
      KeyName: "pointwiseMutualInfo",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.SorensenDiceCoefficient.Name,
    {
      Coefficient: 1,
      Description: featLocalization.SorensenDiceCoefficient.Description,
      KeyName: "sorensenDiceCoefficient",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.JaccardIndex.Name,
    {
      Coefficient: 1,
      Description: featLocalization.JaccardIndex.Description,
      KeyName: "jaccardIndex",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.KendallRankCorrelation.Name,
    {
      Coefficient: 1,
      Description: featLocalization.KendallRankCorrelation.Description,
      KeyName: "kendallRankCorrelation",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.LogLikelihoodRatio.Name,
    {
      Coefficient: 1,
      Description: featLocalization.LogLikelihoodRatio.Description,
      KeyName: "logLikelihoodRatio",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.TTest.Name,
    {
      Coefficient: 1,
      Description: featLocalization.TTest.Description,
      KeyName: "tTest",
      Range: [-1, 1]
    }
  ]
]);
