// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IDistributionBalanceMeasures,
  IHighchartsConfig,
  nameof
} from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import {
  SeriesLegendItemClickEventObject,
  SeriesOptionsType,
  XAxisOptions,
  YAxisOptions
} from "highcharts";

const distLocalization =
  localization.ModelAssessment.DataBalance.DistributionBalanceMeasures.Measures;

interface IDistributionBalanceMetadata {
  Description: string;
  KeyName: string;
}

export const DistributionBalanceMeasuresMap = new Map<
  string,
  IDistributionBalanceMetadata
>([
  [
    distLocalization.ChiSquarePValue.Name,
    {
      Description: distLocalization.ChiSquarePValue.Description,
      KeyName: nameof<IDistributionBalanceMeasures>("ChiSquarePValue")
    }
  ],
  [
    distLocalization.ChiSquareStatistic.Name,
    {
      Description: distLocalization.ChiSquareStatistic.Description,
      KeyName: nameof<IDistributionBalanceMeasures>("ChiSquareStat")
    }
  ],
  [
    distLocalization.CrossEntropy.Name,
    {
      Description: distLocalization.CrossEntropy.Description,
      KeyName: nameof<IDistributionBalanceMeasures>("CrossEntropy")
    }
  ],
  [
    distLocalization.InfiniteNormDistance.Name,
    {
      Description: distLocalization.InfiniteNormDistance.Description,
      KeyName: nameof<IDistributionBalanceMeasures>("InfiniteNormDist")
    }
  ],
  [
    distLocalization.JSDistance.Name,
    {
      Description: distLocalization.JSDistance.Description,
      KeyName: nameof<IDistributionBalanceMeasures>("JensenShannonDist")
    }
  ],
  [
    distLocalization.KLDivergence.Name,
    {
      Description: distLocalization.KLDivergence.Description,
      KeyName: nameof<IDistributionBalanceMeasures>("KLDivergence")
    }
  ],
  [
    distLocalization.TotalVariationDistance.Name,
    {
      Description: distLocalization.TotalVariationDistance.Description,
      KeyName: nameof<IDistributionBalanceMeasures>("TotalVarianceDist")
    }
  ],
  [
    distLocalization.WassersteinDistance.Name,
    {
      Description: distLocalization.WassersteinDistance.Description,
      KeyName: nameof<IDistributionBalanceMeasures>("WassersteinDist")
    }
  ]
]);

export function getDistributionBalanceMeasuresChart(
  distributionBalanceMeasures: IDistributionBalanceMeasures
): IHighchartsConfig {
  if (
    distributionBalanceMeasures === undefined ||
    Object.keys(distributionBalanceMeasures).length === 0
  ) {
    return {};
  }

  const measureLocalization =
    localization.ModelAssessment.DataBalance.DistributionBalanceMeasures
      .Measures;
  const chartLocalization =
    localization.ModelAssessment.DataBalance.DistributionBalanceMeasures.Chart;
  const infoIcon = "&#9432;";

  const features = Object.keys(distributionBalanceMeasures);

  // Since each measure has its own range of values, it can be its own subplot and
  // therefore it has its own series, x-axis, and y-axis.
  const multipleSeries: SeriesOptionsType[] = [],
    xAxes: XAxisOptions[] = [],
    yAxes: YAxisOptions[] = [];

  // Keeps track of charts that are hidden at the start. Gets updated during legend click event.
  // Since there are many subplots, start with some hidden and some visible.
  const hiddenCharts = new Set([
    measureLocalization.ChiSquarePValue.Name,
    measureLocalization.KLDivergence.Name,
    measureLocalization.CrossEntropy.Name,
    measureLocalization.TotalVariationDistance.Name
  ]);

  // Calculate the width of each subplot and the padding between each subplot
  const numVisibleCharts =
    DistributionBalanceMeasuresMap.size - hiddenCharts.size;
  const width = 100 / numVisibleCharts;
  const padding = 5;

  // Represents axis.left for each subplot, meaning at which point from the left to start the subplot
  let axisLeftStart = 0;
  [...DistributionBalanceMeasuresMap.entries()].forEach(
    ([measureName, measureInfo], i) => {
      const measureValues = features.map(
        (f) => distributionBalanceMeasures[f][measureInfo.KeyName]
      );

      // axis.left defines how far from the left to place the axis
      // axis.width defines the width of the axis relative to the entire chart
      xAxes.push({
        categories: features,
        left: hiddenCharts.has(measureName) ? "0%" : `${axisLeftStart}%`,
        offset: 0,
        showEmpty: false,
        title: {
          // If user hovers over the title, they are presented with the measure description.
          text: `<div title="${measureInfo.Description}">${measureName} ${infoIcon}</div>`,
          useHTML: true
        },
        width: hiddenCharts.has(measureName) ? "0%" : `${width - padding}%`
      });
      yAxes.push({
        left: hiddenCharts.has(measureName) ? "0%" : `${axisLeftStart}%`,
        offset: 0,
        showEmpty: false,
        title: {
          // Show y-axis label on the leftmost subplot only
          text: axisLeftStart === 0 ? chartLocalization.Axes.MeasureValue : ""
        },
        width: hiddenCharts.has(measureName) ? "0%" : `${width - padding}%`
      });

      if (!hiddenCharts.has(measureName)) {
        axisLeftStart += width;
      }

      multipleSeries.push({
        data: measureValues,
        events: {
          // Define an event to re-compute the left and width of x-axis and y-axis for every
          // subplot when the user clicks on the legend to either show or hide a subplot
          legendItemClick: (e: SeriesLegendItemClickEventObject) =>
            showHideSubplot(e, hiddenCharts, padding)
        },
        name: measureName,
        type: "column",
        visible: !hiddenCharts.has(measureName),
        xAxis: i,
        yAxis: i
      });
    }
  );

  return {
    chart: {
      numberFormatter: (value: number) => value.toFixed(3),
      type: "column"
    },
    legend: {
      enabled: true
    },
    plotOptions: {
      column: {
        colorByPoint: true,
        dataLabels: {
          enabled: true
        },
        grouping: false
      }
    },
    series: multipleSeries,
    title: {
      text: `${chartLocalization.Title1} ${features.join(", ")} ${
        chartLocalization.Title2
      }`
    },
    tooltip: {
      shared: false
    },
    xAxis: xAxes,
    yAxis: yAxes
  };
}

function showHideSubplot(
  e: SeriesLegendItemClickEventObject,
  hiddenCharts: Set<string>,
  padding: number
): void {
  const chartLocalization =
    localization.ModelAssessment.DataBalance.DistributionBalanceMeasures.Chart;

  // If the clicked-on chart was already hidden, that means user clicked to show it so remove it from hidden charts.
  if (hiddenCharts.has(e.target.name)) {
    hiddenCharts.delete(e.target.name);
  } else {
    // Otherwise, the user clicked to hide the chart so add it to hidden charts.
    hiddenCharts.add(e.target.name);
  }

  // Recompute # of visible charts and the width of each subplot after updating list of hiddden charts.
  const numVisibleCharts =
    DistributionBalanceMeasuresMap.size - hiddenCharts.size;
  const width = 100 / numVisibleCharts;

  let axisLeftStart = 0;
  e.target.chart.xAxis.forEach((xAxis, i) => {
    const yAxis = e.target.chart.yAxis[i];

    // For each chart, if its title is in the hidden charts list, hide it.
    if (hiddenCharts.has(xAxis.options.title?.text ?? "")) {
      xAxis.update({ left: "0%", width: "0%" });
      yAxis.update({ left: "0%", width: "0%" });
    } else {
      // Otherwise, show it with the re-computed left and width.
      xAxis.update({
        left: `${axisLeftStart}%`,
        width: `${width - padding}%`
      });
      yAxis.update({
        left: `${axisLeftStart}%`,
        title: {
          // Show y-axis label on the leftmost subplot only
          text: axisLeftStart === 0 ? chartLocalization.Axes.MeasureValue : ""
        },
        width: `${width - padding}%`
      });

      axisLeftStart += width;
    }
  });
}
