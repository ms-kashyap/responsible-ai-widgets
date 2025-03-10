// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  ChoiceGroup,
  Dropdown,
  IChoiceGroupOption,
  IDropdownOption,
  Stack,
  Text
} from "@fluentui/react";
import {
  Cohort,
  IExplanationModelMetadata,
  ModelTypes,
  WeightVectorOption,
  ChartTypes,
  LabelWithCallout
} from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import { Dictionary } from "lodash";
import React from "react";

import { globalTabStyles } from "./GlobalExplanationTab.styles";
import { IGlobalSeries } from "./IGlobalSeries";

export interface ISidePanelProps {
  weightOptions: WeightVectorOption[];
  metadata: IExplanationModelMetadata;
  weightLabels: Dictionary<string>;
  selectedWeightVector: WeightVectorOption;
  cohortSeries: IGlobalSeries[];
  seriesIsActive: boolean[];
  sortingSeriesIndex: number;
  cohorts: Cohort[];
  chartType: ChartTypes;
  onWeightChange(option: WeightVectorOption): void;
  setSortIndex(option: number): void;
  toggleActivation(index: number): void;
  onChartTypeChange(chartType: ChartTypes): void;
}
interface ISidePanelState {
  weightOptions: IDropdownOption[] | undefined;
}
export class SidePanel extends React.Component<
  ISidePanelProps,
  ISidePanelState
> {
  private chartOptions: IChoiceGroupOption[] = [
    {
      key: ChartTypes.Bar,
      text: localization.Interpret.FeatureImportanceWrapper.barText
    },
    {
      key: ChartTypes.Box,
      text: localization.Interpret.FeatureImportanceWrapper.boxText
    }
  ];
  public constructor(props: ISidePanelProps) {
    super(props);
    this.state = {
      weightOptions: this.getWeightOptions()
    };
  }
  public render(): React.ReactNode {
    const classNames = globalTabStyles();
    return (
      <Stack className={classNames.legendAndSort}>
        <Dropdown
          label={localization.Interpret.GlobalTab.sortBy}
          selectedKey={this.props.sortingSeriesIndex}
          options={this.props.cohortSeries.map((row, rowIndex) => ({
            key: rowIndex,
            text: row.name
          }))}
          onChange={this.onSortChange}
        />
        <ChoiceGroup
          label={localization.Interpret.DatasetExplorer.chartType}
          selectedKey={this.props.chartType}
          options={this.chartOptions}
          onChange={this.onChartTypeChange}
          id="ChartTypeSelection"
        />
        {(this.props.metadata.modelType === ModelTypes.Multiclass ||
          this.props.metadata.modelType === ModelTypes.Binary) &&
          this.state.weightOptions && (
            <div>
              <LabelWithCallout
                calloutTitle={
                  localization.Interpret.CrossClass.crossClassWeights
                }
                label={localization.Interpret.GlobalTab.weightOptions}
              >
                <Text>{localization.Interpret.CrossClass.overviewInfo}</Text>
                <ul>
                  <li>
                    <Text>
                      {localization.Interpret.CrossClass.absoluteValInfo}
                    </Text>
                  </li>
                  <li>
                    <Text>
                      {localization.Interpret.CrossClass.enumeratedClassInfo}
                    </Text>
                  </li>
                </ul>
              </LabelWithCallout>
              <Dropdown
                id={"classWeightDropdown"}
                options={this.state.weightOptions}
                selectedKey={this.props.selectedWeightVector}
                onChange={this.setWeightOption}
              />
            </div>
          )}
      </Stack>
    );
  }

  private onSortChange = (
    _event?: React.FormEvent,
    item?: IDropdownOption
  ): void => {
    if (typeof item?.key === "number") {
      this.props.setSortIndex(item.key);
    }
  };

  private onChartTypeChange = (
    _event?: React.FormEvent,
    item?: IChoiceGroupOption
  ): void => {
    if (item?.key !== undefined) {
      this.props.onChartTypeChange(item.key as ChartTypes);
    }
  };

  private getWeightOptions(): IDropdownOption[] | undefined {
    if (
      this.props.metadata.modelType === ModelTypes.Multiclass ||
      this.props.metadata.modelType === ModelTypes.Binary
    ) {
      return this.props.weightOptions.map((option) => {
        return {
          key: option,
          text: this.props.weightLabels[option]
        };
      });
    }
    return undefined;
  }

  private setWeightOption = (
    _event: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption
  ): void => {
    if (item?.key !== undefined) {
      const newIndex = item.key as WeightVectorOption;
      this.props.onWeightChange(newIndex);
    }
  };
}
