// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  defaultModelAssessmentContext,
  MissingParametersPlaceholder,
  ModelAssessmentContext
} from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import _ from "lodash";
import { Stack } from "office-ui-fabric-react";
import React from "react";

import { AggregateBalanceMeasuresChart } from "./AggregateBalanceMeasuresChart";
import { dataBalanceTabStyles } from "./DataBalanceTab.styles";
import { DistributionBalanceMeasuresChart } from "./DistributionBalanceMeasuresChart";
import { FeatureBalanceMeasuresChart } from "./FeatureBalanceMeasuresChart";

export class IDataBalanceTabProps {}

export class DataBalanceTab extends React.Component<IDataBalanceTabProps> {
  public static contextType = ModelAssessmentContext;
  public context: React.ContextType<typeof ModelAssessmentContext> =
    defaultModelAssessmentContext;

  public render(): React.ReactNode {
    // If some types of measures are available but others are not (i.e. feature balance measures are not available but
    // distribution balance measures are), we still display the measures that are available.
    // We only return if either the measures weren't computed or all measures are missing.
    if (
      !this.context.dataset.dataBalanceMeasures ||
      (!this.context.dataset.dataBalanceMeasures.featureBalanceMeasures &&
        !this.context.dataset.dataBalanceMeasures.aggregateBalanceMeasures &&
        !this.context.dataset.dataBalanceMeasures.distributionBalanceMeasures)
    ) {
      return (
        <MissingParametersPlaceholder>
          {localization.ModelAssessment.DataBalance.MeasuresNotComputed}
        </MissingParametersPlaceholder>
      );
    }

    const styles = dataBalanceTabStyles();
    const dataBalanceMeasures = this.context.dataset.dataBalanceMeasures;

    return (
      <Stack grow tokens={{ childrenGap: "l1" }} className={styles.page}>
        <Stack.Item>
          {dataBalanceMeasures.featureBalanceMeasures && (
            <FeatureBalanceMeasuresChart
              featureBalanceMeasures={
                dataBalanceMeasures.featureBalanceMeasures
              }
            />
          )}
        </Stack.Item>

        <Stack.Item>
          {dataBalanceMeasures.distributionBalanceMeasures && (
            <DistributionBalanceMeasuresChart
              distributionBalanceMeasures={
                dataBalanceMeasures.distributionBalanceMeasures
              }
            />
          )}
        </Stack.Item>

        <Stack.Item>
          {dataBalanceMeasures.aggregateBalanceMeasures && (
            <AggregateBalanceMeasuresChart
              aggregateBalanceMeasures={
                dataBalanceMeasures.aggregateBalanceMeasures
              }
            />
          )}
        </Stack.Item>
      </Stack>
    );
  }
}
