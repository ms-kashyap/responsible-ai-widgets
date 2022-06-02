// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IHighchartsConfig,
  IDistributionBalanceMeasure
} from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import _ from "lodash";

export function getDistributionBalanceMeasuresChart(
  distributionBalanceMeasures: IDistributionBalanceMeasure[]
): IHighchartsConfig {
  if (
    distributionBalanceMeasures === undefined ||
    distributionBalanceMeasures.length === 0
  ) {
    return {};
  }

  const chartLocalization =
    localization.ModelAssessment.DataBalance.DistributionBalanceMeasures.Chart;

  const jsDist = distributionBalanceMeasures.map((m) => m.jsDist);
  const temp = "klDivergence";
  const klDivergence = distributionBalanceMeasures.map((m) => m[temp]);

  const features = _.uniq(
    distributionBalanceMeasures.map((m) => m.FeatureName)
  );

  const measureOptions = ["jsDist", "klDivergence"];

  return {
    chart: {
      numberFormatter: (value: number) => value.toFixed(3),
      type: "bar"
    },
    series: [
      { data: jsDist, xAxis: 0, yAxis: 0 },
      { data: klDivergence, xAxis: 1, yAxis: 1 }
    ],
    title: {
      text: `${chartLocalization.Title1} ${features.join(", ")} ${
        chartLocalization.Title2
      }`
    },
    xAxis: {
      categories: measureOptions,
      title: { text: chartLocalization.Axes.DistributionMeasure }
    },
    yAxis: {
      title: { text: chartLocalization.Axes.MeasureValue }
    }
  };
}
