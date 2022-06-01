// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IDistributionBalanceMeasure } from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import { Text } from "office-ui-fabric-react";
import React from "react";

import { dataBalanceTabStyles } from "./DataBalanceTab.styles";

export interface IDistributionBalanceMeasureProps {
  distributionBalanceMeasures: IDistributionBalanceMeasure[];
  datasetName?: string;
}

export class DistributionBalanceMeasuresChart extends React.PureComponent<IDistributionBalanceMeasureProps> {
  public render(): React.ReactNode {
    if (!this.props.distributionBalanceMeasures) {
      return;
    }

    const styles = dataBalanceTabStyles();

    return (
      <div>
        <Text variant="large" className={styles.boldText}>
          {
            localization.ModelAssessment.DataBalance.DistributionBalanceMeasures
              .Name
          }
        </Text>

        <br />
      </div>
    );
  }
}
