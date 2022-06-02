// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  BasicHighChart,
  IDistributionBalanceMeasure,
  LabelWithCallout
} from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import { Link, Stack, Text } from "office-ui-fabric-react";
import React from "react";

import { dataBalanceTabStyles } from "./DataBalanceTab.styles";
import { getDistributionBalanceMeasuresChart } from "./getDistributionBalanceMeasuresChart";

export interface IDistributionBalanceMeasureProps {
  distributionBalanceMeasures: IDistributionBalanceMeasure[];
  datasetName?: string;
}

export class DistributionBalanceMeasuresChart extends React.PureComponent<IDistributionBalanceMeasureProps> {
  public render(): React.ReactNode {
    const distributionBalanceMeasures = this.props.distributionBalanceMeasures;
    if (!distributionBalanceMeasures) {
      return;
    }

    const styles = dataBalanceTabStyles();
    const measuresLocalization =
      localization.ModelAssessment.DataBalance.DistributionBalanceMeasures;

    return (
      <Stack tokens={{ childrenGap: "l1" }}>
        {/* Renders the title and info hover-over */}
        <Stack.Item>
          <Stack horizontal>
            <Stack.Item>
              <Text variant="large" className={styles.boldText}>
                {measuresLocalization.Name}
              </Text>
            </Stack.Item>

            <Stack.Item className={styles.callout}>
              <LabelWithCallout
                label=""
                calloutTitle={measuresLocalization.Callout.Title}
                type="button"
              >
                <Text block>{measuresLocalization.Callout.Description}</Text>
                <Link
                  href="https://microsoft.github.io/SynapseML/docs/features/responsible_ai/Data%20Balance%20Analysis/#distribution-balance-measures"
                  target="_blank"
                >
                  {localization.ModelAssessment.DataBalance.LearnMore}
                </Link>
              </LabelWithCallout>
            </Stack.Item>
          </Stack>
        </Stack.Item>

        {/* Renders the chart itself */}
        <Stack.Item>
          <BasicHighChart
            configOverride={getDistributionBalanceMeasuresChart(
              distributionBalanceMeasures
            )}
          />
        </Stack.Item>
      </Stack>
    );
  }
}
