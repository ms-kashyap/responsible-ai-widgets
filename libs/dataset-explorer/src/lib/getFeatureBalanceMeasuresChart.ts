// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IFeatureBalanceMeasure,
  IHighchartsConfig,
  ApprovedFeatureBalanceMeasures
} from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import { ColorAxisOptions } from "highcharts";
import _ from "lodash";

export function getFeatureBalanceMeasuresChart(
  featureBalanceMeasures: IFeatureBalanceMeasure[],
  selectedFeature: string,
  selectedMeasure: string
): IHighchartsConfig {
  const measureInfo = ApprovedFeatureBalanceMeasures.get(selectedMeasure);
  if (measureInfo === undefined) {
    return {};
  }

  const chartLocalization =
    localization.ModelAssessment.DataBalance.FeatureBalanceMeasures.Chart;

  const rows = featureBalanceMeasures.filter(
    (m) => m.FeatureName === selectedFeature
  );
  const uniqueClasses = _.uniq(
    rows.map((r) => r.ClassA).concat(rows.map((r) => r.ClassB))
  );

  const items: number[][] = [];
  uniqueClasses.forEach((classA, colIndex) => {
    uniqueClasses.forEach((classB, rowIndex) => {
      let row = rows.find((r) => r.ClassA === classA && r.ClassB === classB);
      let flipped = false;

      if (row === undefined) {
        row = rows.find((r) => r.ClassA === classB && r.ClassB === classA);
        flipped = true;
      }

      const measureName = measureInfo.KeyName;
      if (
        row !== undefined &&
        measureName !== undefined &&
        measureName in row
      ) {
        const measureValue =
          row[measureName] * (flipped ? measureInfo.Coefficient : 1);
        items.push([rowIndex, colIndex, measureValue]);
      }
    });
  });

  const colorAxisOptions = {} as ColorAxisOptions;
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
        // tooltip format: "{classA} and {classB} have a {measureName} of {measureValue}"
        // uniqueClasses can be used to index because it represents both xAxis and yAxis categories
        return `<b>${uniqueClasses[this.y]}</b> ${
          chartLocalization.Tooltip.And
        } <b>${uniqueClasses[this.point.x]}</b> ${
          chartLocalization.Tooltip.ValueDescription1
        } <b>${selectedMeasure}</b> ${
          chartLocalization.Tooltip.ValueDescription2
        } <b>${this.point.value?.toFixed(3)}</b>`;
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
