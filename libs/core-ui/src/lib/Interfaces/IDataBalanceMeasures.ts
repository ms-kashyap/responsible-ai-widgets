// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { localization } from "@responsible-ai/localization";

export interface IDataBalanceMeasures {
  AggregateBalanceMeasures?: IAggregateBalanceMeasures;
  DistributionBalanceMeasures?: IDistributionBalanceMeasures;
  FeatureBalanceMeasures?: IFeatureBalanceMeasures;
}

export interface IAggregateBalanceMeasures {
  AtkinsonIndex: number;
  TheilLIndex: number;
  TheilTIndex: number;
}

export interface IDistributionBalanceMeasures {
  [key: string]: IDistributionBalanceMeasure;
}

export interface IDistributionBalanceMeasure {
  ChiSquarePValue: number;
  ChiSquareStat: number;
  InfiniteNormDist: number;
  JensenShannonDist: number;
  KLDivergence: number;
  TotalVarianceDist: number;
  WassersteinDist: number;
  CrossEntropy: number;
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
      KeyName: "ChiSquarePValue"
    }
  ],
  [
    distLocalization.ChiSquareStatistic.Name,
    {
      Description: distLocalization.ChiSquareStatistic.Description,
      KeyName: "ChiSquareStat"
    }
  ],
  [
    distLocalization.CrossEntropy.Name,
    {
      Description: distLocalization.CrossEntropy.Description,
      KeyName: "CrossEntropy"
    }
  ],
  [
    distLocalization.InfiniteNormDistance.Name,
    {
      Description: distLocalization.InfiniteNormDistance.Description,
      KeyName: "InfiniteNormDist"
    }
  ],
  [
    distLocalization.JSDistance.Name,
    {
      Description: distLocalization.JSDistance.Description,
      KeyName: "JensenShannonDist"
    }
  ],
  [
    distLocalization.KLDivergence.Name,
    {
      Description: distLocalization.KLDivergence.Description,
      KeyName: "KLDivergence"
    }
  ],
  [
    distLocalization.TotalVariationDistance.Name,
    {
      Description: distLocalization.TotalVariationDistance.Description,
      KeyName: "TotalVarianceDist"
    }
  ],
  [
    distLocalization.WassersteinDistance.Name,
    {
      Description: distLocalization.WassersteinDistance.Description,
      KeyName: "WassersteinDist"
    }
  ]
]);

export interface IFeatureBalanceMeasures {
  [key: string]: IFeatureBalanceMeasure[];
}

export interface IFeatureBalanceMeasure {
  ClassA: string;
  ClassB: string;
  StatisticalParity: number;
  PointwiseMutualInfo: number;
  SorensonDiceCoeff: number;
  JaccardIndex: number;
  KendallRankCorrelation: number;
  LogLikelihoodRatio: number;
  TTest: number;
  TTestPValue: number;
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
      KeyName: "StatisticalParity",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.PointwiseMutualInformation.Name,
    {
      Coefficient: 1,
      Description: featLocalization.PointwiseMutualInformation.Description,
      KeyName: "PointwiseMutualInfo",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.SorensenDiceCoefficient.Name,
    {
      Coefficient: 1,
      Description: featLocalization.SorensenDiceCoefficient.Description,
      KeyName: "SorensonDiceCoeff",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.JaccardIndex.Name,
    {
      Coefficient: 1,
      Description: featLocalization.JaccardIndex.Description,
      KeyName: "JaccardIndex",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.KendallRankCorrelation.Name,
    {
      Coefficient: 1,
      Description: featLocalization.KendallRankCorrelation.Description,
      KeyName: "KendallRankCorrelation",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.LogLikelihoodRatio.Name,
    {
      Coefficient: 1,
      Description: featLocalization.LogLikelihoodRatio.Description,
      KeyName: "LogLikelihoodRatio",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.TTest.Name,
    {
      Coefficient: 1,
      Description: featLocalization.TTest.Description,
      KeyName: "TTest",
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.TTestPValue.Name,
    {
      Coefficient: 1,
      Description: featLocalization.TTestPValue.Description,
      KeyName: "TTestPValue",
      Range: [-1, 1]
    }
  ]
]);
