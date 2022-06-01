// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IAggregateBalanceMeasures } from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import { Text } from "office-ui-fabric-react";
import React from "react";

import { dataBalanceTabStyles } from "./DataBalanceTab.styles";

export interface IAggregateBalanceMeasuresProps {
  aggregateBalanceMeasures: IAggregateBalanceMeasures;
}

export class AggregateBalanceMeasuresChart extends React.PureComponent<IAggregateBalanceMeasuresProps> {
  public render(): React.ReactNode {
    if (!this.props.aggregateBalanceMeasures) {
      return;
    }

    const styles = dataBalanceTabStyles();

    return (
      <div>
        <Text variant="large" className={styles.boldText}>
          {
            localization.ModelAssessment.DataBalance.AggregateBalanceMeasures
              .Name
          }
        </Text>

        <br />
      </div>
    );
  }
}
