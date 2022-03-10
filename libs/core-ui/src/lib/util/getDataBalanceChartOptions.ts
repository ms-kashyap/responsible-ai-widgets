// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Point, SeriesOptionsType, TitleOptions } from "highcharts";

import { IHighchartsConfig } from "../Highchart/IHighchartsConfig";
import {
  aggregateBalanceMeasureMap,
  featureBalanceMeasureMap,
  getDistributionBalanceMeasures,
  getFeatureBalanceMeasures,
  IAggregateBalanceMeasures,
  IDistributionBalanceMeasures,
  IFeatureBalanceMeasures
} from "../Interfaces/DataBalanceInterfaces";

export function getDistributionBalanceChartOptions(
  distributionBalanceMeasures: IDistributionBalanceMeasures,
  datasetName?: string
): IHighchartsConfig {
  const features = distributionBalanceMeasures.features;
  const data = features.map(
    (featureName: string) =>
      ({
        data: Object.values(
          getDistributionBalanceMeasures(
            distributionBalanceMeasures.measures,
            featureName
          )
        ),
        name: featureName,
        type: "column"
      } as SeriesOptionsType)
  );

  // Assume that every feature has the same measures calculated
  // and use the 1st feature to get a list of measure types
  const firstMeasure = Object.values(distributionBalanceMeasures.measures)[0];
  const measureTypes = Object.keys(firstMeasure);

  const titleOptions = {
    text: `Comparing ${features.join(", ")} with Uniform Distribution`
  } as TitleOptions;
  if (datasetName) {
    titleOptions.text += ` in ${datasetName}`;
  }

  return {
    chart: {
      numberFormatter: (value: number) => value.toFixed(3),
      type: "column"
    },
    series: data,
    subtitle: {
      text: `<a target="_blank" href="https://microsoft.github.io/SynapseML/docs/features/responsible_ai/Data%20Balance%20Analysis/#distribution-balance-measures">Click here to learn more about Distribution Balance Measures</a>`,
      useHTML: true
    },
    title: titleOptions,
    xAxis: {
      categories: measureTypes,
      title: { text: "Distribution Measure" }
    },
    yAxis: {
      title: { text: "Measure Value" }
    }
  };
}

export function getFeatureBalanceChartOptions(
  featureBalanceMeasures: IFeatureBalanceMeasures,
  selectedFeature: string,
  selectedMeasure: string,
  datasetName?: string
): IHighchartsConfig {
  const measure = featureBalanceMeasureMap.get(selectedMeasure);
  if (!measure) {
    return {};
  }

  const features = new Map<string, string[]>([
    [selectedFeature, featureBalanceMeasures.featureValues[selectedFeature]]
  ]);
  const featureNames = features.get(selectedFeature);
  const featureValues: number[][] = [];

  features.forEach((classes, featureName) => {
    classes.forEach((classA, colIndex) => {
      classes.forEach((classB, rowIndex) => {
        // TODO: Need to figure out which measures are ok to use for heatmap
        const featureValue = getFeatureBalanceMeasures(
          featureBalanceMeasures.measures,
          featureName,
          classA,
          classB
        )[measure.varName];

        // Feature values don't exist for the diagonal of the heatmap (i.e. the same class)
        // Additionally, some feature values may be undefined/invalid/NaN
        if (featureValue && colIndex !== rowIndex) {
          featureValues.push(
            [colIndex, rowIndex, featureValue],
            [rowIndex, colIndex, featureValue]
          );
        }
      });
    });
  });

  const titleOptions = {
    text: `Comparing ${selectedMeasure} on all classes of ${selectedFeature}`
  } as TitleOptions;
  if (datasetName) {
    titleOptions.text += ` in ${datasetName}`;
  }

  return {
    accessibility: {
      point: {
        descriptionFormatter(point) {
          const ix = point.index + 1,
            xName = getPointCategoryName(point, "x"),
            yName = getPointCategoryName(point, "y"),
            val = point.value;
          return `${ix}. ${xName} and ${yName} have a ${selectedMeasure} of ${val}.`;
        }
      }
    },
    chart: {
      numberFormatter: (value: number) => value.toFixed(3),
      type: "heatmap"
    },
    colorAxis: {
      max: measure.range ? measure.range[1] : undefined, // undefined range => max value is used
      min: measure.range ? measure.range[0] : undefined // undefined range => min value is used
    },
    legend: {
      align: "right",
      layout: "vertical",
      margin: 0,
      symbolHeight: 280,
      verticalAlign: "top",
      y: 35
    },
    series: [
      {
        data: featureValues,
        dataLabels: {
          enabled: true
        },
        name: selectedFeature,
        type: "heatmap"
      }
    ],
    subtitle: {
      text: `<a target="_blank" href="https://microsoft.github.io/SynapseML/docs/features/responsible_ai/Data%20Balance%20Analysis/#feature-balance-measures">Click here to learn more about Feature Balance Measures</a>`,
      useHTML: true
    },
    title: titleOptions,
    tooltip: {
      formatter() {
        return `<b>${getPointCategoryName(
          this.point,
          "x"
        )}</b> and <b>${getPointCategoryName(
          this.point,
          "y"
        )}</b> have a <b>${selectedMeasure}</b> of <b>${this.point.value}</b>`;
      }
    },
    xAxis: {
      categories: featureNames,
      title: { text: "Class B" }
    },
    yAxis: {
      categories: featureNames,
      title: { text: "Class A" }
    }
  };
}

function getPointCategoryName(point: Point, dimension: "x" | "y"): string {
  if (point.x === undefined || point.y === undefined) {
    return "N/A";
  }

  const series = point.series,
    isY = dimension === "y",
    axis = series[isY ? "yAxis" : "xAxis"];
  return axis.categories[isY ? point.y : point.x];
}

export function getAggregateBalanceChartOptions(
  aggregateBalanceMeasures: IAggregateBalanceMeasures,
  datasetName?: string
): IHighchartsConfig {
  console.log(aggregateBalanceMeasureMap);

  const data = Object.entries(aggregateBalanceMeasures.measures).map(
    ([k, v]) => ({ data: [v], name: k, type: "bar" } as SeriesOptionsType)
  );

  const titleOptions = {
    text: `Aggregate Balance Measures`
  } as TitleOptions;
  if (datasetName) {
    titleOptions.text += ` in ${datasetName}`;
  }

  return {
    chart: {
      numberFormatter: (value: number) => value.toFixed(3)
    },
    exporting: {
      showTable: false
    },
    series: data,
    subtitle: {
      text: `<a target="_blank" href="https://microsoft.github.io/SynapseML/docs/features/responsible_ai/Data%20Balance%20Analysis/#aggregate-balance-measures">Click here to learn more about Aggregate Balance Measures</a>`,
      useHTML: true
    },
    title: titleOptions,
    xAxis: {
      categories: ["Aggregate Measures"]
    },
    yAxis: {
      title: { text: "Measure Value" }
    }
  };
}
