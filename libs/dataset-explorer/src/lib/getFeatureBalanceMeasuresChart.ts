// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IHighchartsConfig,
  IFeatureBalanceMeasures,
  nameof,
  IFeatureBalanceMeasure
} from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import { ColorAxisOptions } from "highcharts";
import _ from "lodash";
import { getTheme } from "office-ui-fabric-react";

interface IFeatureBalanceMetadata {
  Description: string;
  KeyName: string;
  // If a range is not specified (i.e. because it is [-inf, +inf]), then min/max values are used
  Range?: [number, number];
}

const featLocalization =
  localization.ModelAssessment.DataBalance.FeatureBalanceMeasures.Measures;

// Map that contains display name -> measure metadata pairs, corresponds to
// the feature balance measures that can be displayed in the heatmap
export const FeatureBalanceMeasuresMap = new Map<
  string,
  IFeatureBalanceMetadata
>([
  [
    featLocalization.StatisticalParity.Name,
    {
      Description: featLocalization.StatisticalParity.Description,
      KeyName: nameof<IFeatureBalanceMeasure>("StatisticalParity"),
      Range: [-1, 1]
    }
  ],
  [
    featLocalization.PointwiseMutualInformation.Name,
    {
      Description: featLocalization.PointwiseMutualInformation.Description,
      KeyName: nameof<IFeatureBalanceMeasure>("PointwiseMutualInfo")
    }
  ],
  [
    featLocalization.SorensenDiceCoefficient.Name,
    {
      Description: featLocalization.SorensenDiceCoefficient.Description,
      KeyName: nameof<IFeatureBalanceMeasure>("SorensonDiceCoeff")
    }
  ],
  [
    featLocalization.JaccardIndex.Name,
    {
      Description: featLocalization.JaccardIndex.Description,
      KeyName: nameof<IFeatureBalanceMeasure>("JaccardIndex")
    }
  ],
  [
    featLocalization.KendallRankCorrelation.Name,
    {
      Description: featLocalization.KendallRankCorrelation.Description,
      KeyName: nameof<IFeatureBalanceMeasure>("KendallRankCorrelation")
    }
  ],
  [
    featLocalization.LogLikelihoodRatio.Name,
    {
      Description: featLocalization.LogLikelihoodRatio.Description,
      KeyName: nameof<IFeatureBalanceMeasure>("LogLikelihoodRatio")
    }
  ],
  [
    featLocalization.TTest.Name,
    {
      Description: featLocalization.TTest.Description,
      KeyName: nameof<IFeatureBalanceMeasure>("TTest")
    }
  ],
  [
    featLocalization.TTestPValue.Name,
    {
      Description: featLocalization.TTestPValue.Description,
      KeyName: nameof<IFeatureBalanceMeasure>("TTestPValue")
    }
  ]
]);

export function getFeatureBalanceMeasuresChart(
  featureBalanceMeasures: IFeatureBalanceMeasures,
  selectedFeature: string,
  selectedMeasure: string
): IHighchartsConfig {
  const measureInfo = FeatureBalanceMeasuresMap.get(selectedMeasure);
  if (
    featureBalanceMeasures === undefined ||
    Object.keys(featureBalanceMeasures).length === 0 ||
    measureInfo === undefined
  ) {
    return {};
  }

  const chartLocalization =
    localization.ModelAssessment.DataBalance.FeatureBalanceMeasures.Chart;

  const rows = featureBalanceMeasures[selectedFeature];
  const uniqueClasses = _.uniq(
    rows.map((r) => r.ClassA).concat(rows.map((r) => r.ClassB))
  );

  const items: number[][] = [];
  uniqueClasses.forEach((classA, colIndex) => {
    uniqueClasses.forEach((classB, rowIndex) => {
      let row = rows.find((r) => r.ClassA === classA && r.ClassB === classB);
      let foundFlipped = false;

      if (row === undefined) {
        // If a row doesn't exist for ClassA vs. ClassB, try to find one for
        // ClassB vs. ClassA
        row = rows.find((r) => r.ClassA === classB && r.ClassB === classA);
        foundFlipped = true;
      }

      const measureName = measureInfo.KeyName;
      if (
        row !== undefined &&
        measureName !== undefined &&
        measureName in row
      ) {
        // If a measure value is found for ClassB vs. ClassA, flip its value
        // since every feature balance measure gap is symmetric
        const measureValue = row[measureName] * (foundFlipped ? -1 : 1);
        items.push([rowIndex, colIndex, measureValue]);
      }
    });
  });

  // Chosen color scale is "viridis", the default color scale for matplotlib, because it is:
  // - colorful (highlights differences easily)
  // - perceptually uniform (values close to each other have similar colors and vice versa)
  // - robust to colorblindness and grayscale (hotspots in heatmap are still visible)
  const theme = getTheme();
  const colorAxisOptions = {
    stops: [
      [0, theme.palette.purpleDark],
      [0.5, theme.palette.teal],
      [1, theme.palette.yellowLight]
    ]
  } as ColorAxisOptions;

  if (measureInfo.Range) {
    [colorAxisOptions.min, colorAxisOptions.max] = measureInfo.Range;
  } else {
    // an item consists of [rowIndex, colIndex, measureValue] so item[2] extracts measureValue
    const measureValues = items.map((item) => item[2]);
    colorAxisOptions.min = Math.min(...measureValues);
    colorAxisOptions.max = Math.max(...measureValues);
  }

  return {
    chart: {
      numberFormatter: (value: number) => value.toFixed(3),
      type: "heatmap"
    },
    colorAxis: colorAxisOptions,
    legend: {
      align: "right",
      enabled: true,
      layout: "vertical",
      symbolHeight: 280,
      verticalAlign: "top",
      y: 35
    },
    series: [
      {
        data: items,
        dataLabels: {
          enabled: true
        },
        name: selectedFeature,
        type: "heatmap"
      }
    ],
    tooltip: {
      formatter() {
        // to avoid semantic error during build cast point to any
        const point = this.point as any;

        // tooltip format: "{classA} and {classB} have a {measureName} of {measureValue}"
        // uniqueClasses can be used to index because it represents both xAxis and yAxis categories
        return `<b>${uniqueClasses[point.y]}</b> ${
          chartLocalization.Tooltip.And
        } <b>${uniqueClasses[point.x]}</b> ${
          chartLocalization.Tooltip.ValueDescription1
        } <b>${selectedMeasure}</b> ${
          chartLocalization.Tooltip.ValueDescription2
        } <b>${point.value.toFixed(3)}</b>`;
      }
    },
    xAxis: {
      categories: uniqueClasses,
      title: { text: chartLocalization.Axes.ClassB }
    },
    yAxis: {
      categories: uniqueClasses,
      title: { text: chartLocalization.Axes.ClassA }
    }
  };
}
