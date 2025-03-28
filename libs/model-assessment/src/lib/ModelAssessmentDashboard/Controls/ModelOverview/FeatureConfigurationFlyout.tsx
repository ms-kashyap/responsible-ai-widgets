// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CheckboxVisibility,
  Stack,
  Panel,
  PrimaryButton,
  DefaultButton,
  Text,
  PanelType,
  DetailsList,
  IColumn,
  Label,
  SpinButton,
  Selection,
  SelectionMode,
  MessageBar,
  MessageBarType
} from "@fluentui/react";
import {
  defaultModelAssessmentContext,
  getCompositeFilterString,
  ModelAssessmentContext
} from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import React from "react";

import { defaultNumberOfContinuousFeatureBins } from "./Constants";
import { generateFeatureBasedFilters } from "./DisaggregatedAnalysisUtils";

interface IFeatureConfigurationFlyoutProps {
  isOpen: boolean;
  onDismissFlyout: () => void;
  selectedFeatures: number[];
  numberOfContinuousFeatureBins: { [featureIndex: number]: number };
  updateSelectedFeatures: (
    newSelectedFeatures: number[],
    numberOfContinuousFeatureBins: { [featureIndex: number]: number }
  ) => void;
}

interface IFeatureConfigurationFlyoutState {
  newlySelectedFeatures: number[];
  newNumberOfContinuousFeatureBins: { [featureIndex: number]: number };
  items: IFeatureConfigurationRow[];
}

interface IFeatureConfigurationRow {
  key: string;
  featureName: string;
  featureRemark: string;
  groups: string[];
  continuousFeatureBinningEnabled: boolean;
}

const maxFeatureBins = 10;
const minFeatureBins = 2;

export class FeatureConfigurationFlyout extends React.Component<
  IFeatureConfigurationFlyoutProps,
  IFeatureConfigurationFlyoutState
> {
  public static contextType = ModelAssessmentContext;
  public context: React.ContextType<typeof ModelAssessmentContext> =
    defaultModelAssessmentContext;
  private _selection: Selection;

  constructor(props: IFeatureConfigurationFlyoutProps) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: (): void => {
        const selectedIndices = this._selection.getSelectedIndices().slice();
        this.setState({ newlySelectedFeatures: selectedIndices });
      }
    });

    this.state = {
      items: [],
      newlySelectedFeatures: this.props.selectedFeatures,
      newNumberOfContinuousFeatureBins: this.props.numberOfContinuousFeatureBins
    };
    this.updateSelection();
  }

  componentDidMount() {
    this.setState(
      { items: this.getItems(this.state.newNumberOfContinuousFeatureBins) },
      () => {
        this.updateSelection();
      }
    );
  }

  componentDidUpdate(prevProps: IFeatureConfigurationFlyoutProps) {
    // Update selected features in state whenever the flyout is opened.
    // At other times we can't update with props since they may be outdated compared to the state.
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState(
        { newlySelectedFeatures: this.props.selectedFeatures },
        () => {
          this.updateSelection();
        }
      );
    }
  }

  public render(): React.ReactNode {
    const columns: IColumn[] = [
      {
        key: "featureName",
        maxWidth: 350,
        minWidth: 200,
        name: localization.ModelAssessment.ModelOverview.featureConfiguration
          .featureColumnHeader,
        onRender: this.renderFeatureColumn
      },
      {
        key: "groups",
        minWidth: 300,
        name: localization.ModelAssessment.ModelOverview.featureConfiguration
          .groupsColumnHeader,
        onRender: this.renderGroups
      }
    ];

    return (
      <Panel
        isOpen={this.props.isOpen}
        closeButtonAriaLabel="Close"
        type={PanelType.large}
        onDismiss={this.props.onDismissFlyout}
        onRenderFooterContent={this.onRenderFooterContent}
        isFooterAtBottom
      >
        <Stack tokens={{ childrenGap: "10px" }}>
          <Text variant={"xLarge"}>
            {
              localization.ModelAssessment.ModelOverview.featureConfiguration
                .flyoutHeader
            }
          </Text>
          <Text variant={"large"}>
            {
              localization.ModelAssessment.ModelOverview.featureConfiguration
                .flyoutSubHeader
            }
          </Text>
          <Text>
            {
              localization.ModelAssessment.ModelOverview.featureConfiguration
                .flyoutDescription
            }
          </Text>
          <DetailsList
            items={this.state.items}
            columns={columns}
            selectionMode={SelectionMode.multiple}
            selection={this._selection}
            checkboxVisibility={CheckboxVisibility.always}
          />
        </Stack>
      </Panel>
    );
  }

  private updateSelection = () => {
    this._selection.setItems(this.state.items);
    this.state.newlySelectedFeatures.forEach((featureIndex) => {
      this._selection.setIndexSelected(featureIndex, true, true);
    });
  };

  private onConfirm = () => {
    this.props.updateSelectedFeatures(
      this.state.newlySelectedFeatures,
      this.state.newNumberOfContinuousFeatureBins
    );
  };

  private onRenderFooterContent = () => {
    const tooManyFeaturesSelected = this._selection.getSelectedCount() > 2;
    return (
      <Stack tokens={{ childrenGap: "10px" }}>
        {tooManyFeaturesSelected && (
          <MessageBar messageBarType={MessageBarType.error}>
            {
              localization.ModelAssessment.ModelOverview.featureConfiguration
                .tooManyFeaturesSelectedWarning
            }
          </MessageBar>
        )}
        <Stack horizontal tokens={{ childrenGap: "10px" }}>
          <PrimaryButton
            onClick={this.onConfirm}
            text={localization.ModelAssessment.ModelOverview.chartConfigConfirm}
            disabled={tooManyFeaturesSelected}
          />
          <DefaultButton
            onClick={this.props.onDismissFlyout}
            text={localization.ModelAssessment.ModelOverview.chartConfigCancel}
          />
        </Stack>
      </Stack>
    );
  };

  private getItems = (continuousFeatureBins: {
    [featureIndex: number]: number;
  }): IFeatureConfigurationRow[] => {
    return this.context.dataset.feature_names.map(
      (featureName, featureIndex) => {
        const featureBasedFilters = generateFeatureBasedFilters(
          this.context.jointDataset,
          this.context.dataset,
          featureIndex,
          continuousFeatureBins[featureIndex] ??
            defaultNumberOfContinuousFeatureBins
        );
        const isFeatureContinuous =
          !this.context.dataset.categorical_features.includes(featureName);
        return {
          continuousFeatureBinningEnabled: isFeatureContinuous,
          featureName,
          featureRemark: isFeatureContinuous
            ? localization.formatString(
                localization.ModelAssessment.ModelOverview.featureConfiguration
                  .continuousGroupsCountRemark,
                featureBasedFilters?.length
              )
            : localization.formatString(
                localization.ModelAssessment.ModelOverview.featureConfiguration
                  .categoricalGroupsCountRemark,
                featureBasedFilters?.length
              ),
          groups:
            featureBasedFilters?.map((filter) => {
              const cohortName = getCompositeFilterString(
                [filter],
                this.context.jointDataset
              )[0];
              return cohortName;
            }) ?? [],
          key: featureIndex.toString()
        };
      }
    );
  };

  private renderGroups = (row?: IFeatureConfigurationRow) => {
    const isStringArray =
      Array.isArray(row?.groups) &&
      row?.groups.every((group: any) => typeof group === "string");
    if (row && isStringArray) {
      return (
        <Stack>
          {row?.groups.map((group) => {
            return (
              <>
                <Text>{group}</Text>
                <br />
              </>
            );
          })}
        </Stack>
      );
    }
    return;
  };

  private renderFeatureColumn = (row?: IFeatureConfigurationRow) => {
    const isStringArray =
      Array.isArray(row?.groups) &&
      row?.groups.every((group: any) => typeof group === "string");
    if (row && isStringArray) {
      const featureIndex = Number(row.key);
      return (
        <Stack tokens={{ childrenGap: "5px" }}>
          <Label>{row.featureName}</Label>
          <Text>{row.featureRemark}</Text>
          {this.state.newlySelectedFeatures.includes(featureIndex) &&
            !this.context.dataset.categorical_features.includes(
              this.context.dataset.feature_names[featureIndex]
            ) && (
              <SpinButton
                label={
                  localization.ModelAssessment.ModelOverview
                    .featureConfiguration.continuousFeatureBinningLabel
                }
                value={
                  this.state.newNumberOfContinuousFeatureBins[
                    featureIndex
                  ]?.toString() ??
                  defaultNumberOfContinuousFeatureBins.toString()
                }
                min={minFeatureBins}
                max={maxFeatureBins}
                step={1}
                incrementButtonAriaLabel="Increase value by 1"
                decrementButtonAriaLabel="Decrease value by 1"
                onIncrement={this.onSpinButtonChange(1, featureIndex)}
                onDecrement={this.onSpinButtonChange(-1, featureIndex)}
              />
            )}
        </Stack>
      );
    }
    return;
  };

  private onSpinButtonChange(delta: number, featureIndex: number) {
    const spinButtonChangeFunction = (value?: string) => {
      if (value !== undefined) {
        const continuousFeatureBins =
          this.state.newNumberOfContinuousFeatureBins;
        const newValue = Number(value) + delta;
        if (newValue >= minFeatureBins && newValue <= maxFeatureBins) {
          continuousFeatureBins[featureIndex] = newValue;
          this.setState(
            {
              items: this.getItems(continuousFeatureBins),
              newNumberOfContinuousFeatureBins: continuousFeatureBins
            },
            () => {
              this.updateSelection();
            }
          );
        }
      }
    };
    return spinButtonChangeFunction;
  }
}
