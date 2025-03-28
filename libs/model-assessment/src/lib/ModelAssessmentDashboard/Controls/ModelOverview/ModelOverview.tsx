// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IComboBoxOption,
  IComboBox,
  ComboBox,
  Stack,
  Text,
  Pivot,
  PivotItem,
  ActionButton,
  MessageBar,
  Toggle
} from "@fluentui/react";
import {
  MissingParametersPlaceholder,
  defaultModelAssessmentContext,
  ModelAssessmentContext,
  OverallMetricChart,
  BinaryClassificationMetrics,
  RegressionMetrics,
  JointDataset,
  generateMetrics,
  ModelTypes,
  classificationTask,
  FabricStyles,
  MulticlassClassificationMetrics,
  ErrorCohort,
  ILabeledStatistic
} from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import React from "react";

import { ChartConfigurationFlyout } from "./ChartConfigurationFlyout";
import { defaultNumberOfContinuousFeatureBins } from "./Constants";
import { DatasetCohortStatsTable } from "./DatasetCohortStatsTable";
import { DisaggregatedAnalysisTable } from "./DisaggregatedAnalysisTable";
import { generateOverlappingFeatureBasedCohorts } from "./DisaggregatedAnalysisUtils";
import { FeatureConfigurationFlyout } from "./FeatureConfigurationFlyout";
import { MetricConfigurationFlyout } from "./MetricConfigurationFlyout";
import { modelOverviewStyles } from "./ModelOverview.styles";
import { ModelOverviewMetricChart } from "./ModelOverviewMetricChart";
import { ProbabilityDistributionChart } from "./ProbabilityDistributionChart";
import { getSelectableMetrics } from "./StatsTableUtils";

interface IModelOverviewProps {
  showNewModelOverviewExperience: boolean;
}

interface IModelOverviewState {
  selectedMetrics: string[];
  selectedFeatures: number[];
  selectedFeaturesContinuousFeatureBins: { [featureIndex: number]: number };
  selectedDatasetCohorts?: number[];
  selectedFeatureBasedCohorts?: number[];
  chartConfigurationIsVisible: boolean;
  datasetCohortViewIsVisible: boolean;
  datasetCohortChartIsVisible: boolean;
  featureConfigurationIsVisible: boolean;
  metricConfigurationIsVisible: boolean;
  showHeatmapColors: boolean;
}

const datasetCohortViewPivotKey = "datasetCohortView";
const disaggregatedAnalysisPivotKey = "disaggregatedAnalysis";

export class ModelOverview extends React.Component<
  IModelOverviewProps,
  IModelOverviewState
> {
  public static contextType = ModelAssessmentContext;
  public context: React.ContextType<typeof ModelAssessmentContext> =
    defaultModelAssessmentContext;
  private featureComboBoxRef = React.createRef<IComboBox>();

  constructor(props: IModelOverviewProps) {
    super(props);
    this.state = {
      chartConfigurationIsVisible: false,
      datasetCohortChartIsVisible: true,
      datasetCohortViewIsVisible: true,
      featureConfigurationIsVisible: false,
      metricConfigurationIsVisible: false,
      selectedFeatures: [],
      selectedFeaturesContinuousFeatureBins: {},
      selectedMetrics: [],
      showHeatmapColors: false
    };
  }

  public componentDidMount(): void {
    let defaultSelectedMetrics: string[] = [];
    if (this.context.dataset.task_type === classificationTask) {
      if (this.context.jointDataset.getModelType() === ModelTypes.Binary) {
        defaultSelectedMetrics = [
          BinaryClassificationMetrics.Accuracy,
          BinaryClassificationMetrics.FalsePositiveRate,
          BinaryClassificationMetrics.FalseNegativeRate,
          BinaryClassificationMetrics.SelectionRate
        ];
      } else {
        defaultSelectedMetrics = [MulticlassClassificationMetrics.Accuracy];
      }
    } else {
      // task_type === "regression"
      defaultSelectedMetrics = [
        RegressionMetrics.MeanAbsoluteError,
        RegressionMetrics.MeanSquaredError,
        RegressionMetrics.MeanPrediction
      ];
    }
    this.setState({
      selectedDatasetCohorts: this.context.errorCohorts.map(
        (_cohort, index) => {
          return index;
        }
      ),
      selectedMetrics: defaultSelectedMetrics
    });
  }

  public render(): React.ReactNode {
    if (this.context.dataset.predicted_y === undefined) {
      return (
        <MissingParametersPlaceholder>
          {localization.Interpret.ModelPerformance.missingParameters}
        </MissingParametersPlaceholder>
      );
    }

    const classNames = modelOverviewStyles();

    const selectableMetrics = getSelectableMetrics(
      this.context.dataset.task_type,
      this.context.jointDataset.getModelType() === ModelTypes.Multiclass
    );

    const columns: string[] = [
      localization.ModelAssessment.ModelOverview.countColumnHeader
    ];
    columns.push(
      ...selectableMetrics
        .filter((element) =>
          this.state.selectedMetrics.includes(element.key.toString())
        )
        .map((element) => {
          return element.text;
        })
    );

    // generate table contents for dataset cohorts
    const datasetCohortLabeledStatistics = generateMetrics(
      this.context.jointDataset,
      this.context.errorCohorts.map((errorCohort) =>
        errorCohort.cohort.unwrap(JointDataset.IndexLabel)
      ),
      this.context.modelMetadata.modelType
    );

    // generate table contents for selected feature cohorts
    const featureBasedCohorts = generateOverlappingFeatureBasedCohorts(
      this.context.baseErrorCohort,
      this.context.jointDataset,
      this.context.dataset,
      this.state.selectedFeatures,
      this.state.selectedFeaturesContinuousFeatureBins
    );

    const featureBasedCohortLabeledStatistics = generateMetrics(
      this.context.jointDataset,
      featureBasedCohorts.map((errorCohort) =>
        errorCohort.cohort.unwrap(JointDataset.IndexLabel)
      ),
      this.context.modelMetadata.modelType
    );

    const featureSelectionLimitReached =
      this.state.selectedFeatures.length >= 2;
    const featureSelectionOptions: IComboBoxOption[] =
      this.context.dataset.feature_names.map((featureName, index) => {
        return {
          disabled:
            featureSelectionLimitReached &&
            !this.state.selectedFeatures.includes(index),
          key: index,
          text: featureName
        };
      });

    let chartCohorts: ErrorCohort[];
    let someCohortSelected: boolean;
    let selectedChartCohorts: number[];
    let labeledStatistics: ILabeledStatistic[][];
    if (this.state.datasetCohortChartIsVisible) {
      chartCohorts = this.context.errorCohorts;
      someCohortSelected =
        this.state.selectedDatasetCohorts !== undefined &&
        this.state.selectedDatasetCohorts.length > 0;
      selectedChartCohorts = this.state.selectedDatasetCohorts ?? [];
      labeledStatistics = datasetCohortLabeledStatistics;
    } else {
      chartCohorts = featureBasedCohorts;
      someCohortSelected =
        this.state.selectedFeatureBasedCohorts !== undefined &&
        this.state.selectedFeatureBasedCohorts.length > 0;
      selectedChartCohorts = this.state.selectedFeatureBasedCohorts ?? [];
      labeledStatistics = featureBasedCohortLabeledStatistics;
    }

    // only show heatmap toggle if there are multiple cohorts since there won't be a color gradient otherwise.
    const showHeatmapToggleInDatasetCohortView =
      this.state.datasetCohortViewIsVisible &&
      this.context.errorCohorts.length > 1;
    const showHeatmapToggleInFeatureCohortView =
      !this.state.datasetCohortViewIsVisible &&
      this.state.selectedFeatures.length > 0 &&
      featureBasedCohorts.length > 1;

    return (
      <Stack
        className={classNames.sectionStack}
        tokens={{ childrenGap: "10px" }}
      >
        {!this.props.showNewModelOverviewExperience && (
          <>
            <Text variant="medium" className={classNames.descriptionText}>
              {localization.Interpret.ModelPerformance.helperText}
            </Text>
            <OverallMetricChart />
          </>
        )}
        {this.props.showNewModelOverviewExperience && (
          <Stack tokens={{ childrenGap: "10px" }}>
            <Text variant="medium" className={classNames.descriptionText}>
              {localization.ModelAssessment.ModelOverview.topLevelDescription}
            </Text>
            <Pivot onLinkClick={this.handleViewPivot}>
              <PivotItem
                headerText={
                  localization.ModelAssessment.ModelOverview
                    .dataCohortsChartSelectionHeader
                }
                itemKey={datasetCohortViewPivotKey}
              />
              <PivotItem
                headerText={
                  localization.ModelAssessment.ModelOverview
                    .disaggregatedAnalysisHeatmapHeader
                }
                itemKey={disaggregatedAnalysisPivotKey}
              />
            </Pivot>
            {!this.state.datasetCohortViewIsVisible && (
              <Text className={classNames.descriptionText}>
                {
                  localization.ModelAssessment.ModelOverview
                    .featureBasedViewDescription
                }
              </Text>
            )}
            <Stack horizontal tokens={{ childrenGap: "10px" }}>
              <ComboBox
                placeholder={
                  localization.ModelAssessment.ModelOverview
                    .metricSelectionDropdownPlaceholder
                }
                label={
                  localization.ModelAssessment.ModelOverview.metricsDropdown
                }
                selectedKey={this.state.selectedMetrics}
                options={selectableMetrics}
                onChange={this.onMetricSelectionChange}
                multiSelect
                className={classNames.dropdown}
                styles={FabricStyles.limitedSizeMenuDropdown}
              />
              <ActionButton
                className={classNames.configurationActionButton}
                onClick={() =>
                  this.setState({ metricConfigurationIsVisible: true })
                }
                iconProps={{ iconName: "ColumnOptions" }}
              >
                {
                  localization.ModelAssessment.ModelOverview
                    .helpMeChooseMetricsButton
                }
              </ActionButton>
            </Stack>
            {!this.state.datasetCohortViewIsVisible && (
              <Stack horizontal tokens={{ childrenGap: "10px" }}>
                <ComboBox
                  componentRef={this.featureComboBoxRef}
                  placeholder={
                    localization.ModelAssessment.ModelOverview
                      .featureSelectionDropdownPlaceholder
                  }
                  label={
                    localization.ModelAssessment.ModelOverview.featuresDropdown
                  }
                  selectedKey={this.state.selectedFeatures}
                  options={featureSelectionOptions}
                  onChange={this.onFeatureSelectionChange}
                  multiSelect
                  className={classNames.dropdown}
                  styles={FabricStyles.limitedSizeMenuDropdown}
                />
                <ActionButton
                  className={classNames.configurationActionButton}
                  onClick={() =>
                    this.setState({ featureConfigurationIsVisible: true })
                  }
                  iconProps={{ iconName: "ColumnOptions" }}
                >
                  {
                    localization.ModelAssessment.ModelOverview
                      .helpMeChooseFeaturesButton
                  }
                </ActionButton>
              </Stack>
            )}
            {(showHeatmapToggleInDatasetCohortView ||
              showHeatmapToggleInFeatureCohortView) && (
              <Toggle
                label={
                  localization.ModelAssessment.ModelOverview
                    .visualDisplayToggleLabel
                }
                inlineLabel
                onChange={this.onVisualDisplayToggleChange}
              />
            )}
            {this.state.datasetCohortViewIsVisible ? (
              <DatasetCohortStatsTable
                selectableMetrics={selectableMetrics}
                selectedMetrics={this.state.selectedMetrics}
                showHeatmapColors={this.state.showHeatmapColors}
              />
            ) : (
              <>
                {this.state.selectedFeatures.length === 0 && (
                  <MissingParametersPlaceholder>
                    {
                      localization.ModelAssessment.ModelOverview
                        .disaggregatedAnalysisFeatureSelectionPlaceholder
                    }
                  </MissingParametersPlaceholder>
                )}
                {this.state.selectedFeatures.length > 0 && (
                  <>
                    <Text className={classNames.generalSemiBoldText}>
                      {localization.formatString(
                        localization.ModelAssessment.ModelOverview
                          .disaggregatedAnalysisBaseCohortDislaimer,
                        this.context.baseErrorCohort.cohort.name
                      )}
                    </Text>
                    {this.context.baseErrorCohort.cohort.filters.length +
                      this.context.baseErrorCohort.cohort.compositeFilters
                        .length >
                      0 && (
                      <MessageBar className={classNames.descriptionText}>
                        {localization.formatString(
                          localization.ModelAssessment.ModelOverview
                            .disaggregatedAnalysisBaseCohortWarning,
                          localization.ErrorAnalysis.Cohort.defaultLabel,
                          this.context.baseErrorCohort.cohort.name
                        )}
                      </MessageBar>
                    )}
                  </>
                )}
                <DisaggregatedAnalysisTable
                  selectableMetrics={selectableMetrics}
                  selectedMetrics={this.state.selectedMetrics}
                  selectedFeatures={this.state.selectedFeatures}
                  featureBasedCohorts={featureBasedCohorts}
                  showHeatmapColors={this.state.showHeatmapColors}
                />
              </>
            )}
            <ChartConfigurationFlyout
              isOpen={this.state.chartConfigurationIsVisible}
              onDismissFlyout={this.onDismissChartConfigurationFlyout}
              datasetCohorts={this.context.errorCohorts}
              featureBasedCohorts={featureBasedCohorts}
              selectedDatasetCohorts={this.state.selectedDatasetCohorts}
              selectedFeatureBasedCohorts={
                this.state.selectedFeatureBasedCohorts
              }
              updateCohortSelection={this.updateCohortSelection}
              datasetCohortViewIsSelected={
                this.state.datasetCohortChartIsVisible
              }
            />
            <FeatureConfigurationFlyout
              isOpen={this.state.featureConfigurationIsVisible}
              onDismissFlyout={this.onDismissFeatureConfigurationFlyout}
              selectedFeatures={this.state.selectedFeatures}
              numberOfContinuousFeatureBins={
                this.state.selectedFeaturesContinuousFeatureBins
              }
              updateSelectedFeatures={this.onFeatureConfigurationChange}
            />
            <MetricConfigurationFlyout
              isOpen={this.state.metricConfigurationIsVisible}
              onDismissFlyout={() => {
                this.setState({ metricConfigurationIsVisible: false });
              }}
              selectedMetrics={this.state.selectedMetrics}
              updateSelectedMetrics={this.onMetricConfigurationChange}
              selectableMetrics={selectableMetrics}
            />
            {someCohortSelected && (
              <Pivot>
                {this.context.modelMetadata.modelType === ModelTypes.Binary && (
                  <PivotItem
                    headerText={
                      localization.ModelAssessment.ModelOverview
                        .probabilityDistributionPivotItem
                    }
                  >
                    <ProbabilityDistributionChart
                      onChooseCohorts={this.onChooseCohorts}
                      cohorts={chartCohorts}
                      selectedCohorts={selectedChartCohorts}
                    />
                  </PivotItem>
                )}
                <PivotItem
                  headerText={
                    localization.ModelAssessment.ModelOverview
                      .metricsVisualizationsPivotItem
                  }
                >
                  <ModelOverviewMetricChart
                    onChooseCohorts={this.onChooseCohorts}
                    selectableMetrics={selectableMetrics}
                    cohorts={chartCohorts}
                    cohortStats={labeledStatistics}
                    selectedCohorts={selectedChartCohorts}
                  />
                </PivotItem>
              </Pivot>
            )}
          </Stack>
        )}
      </Stack>
    );
  }

  private onDismissChartConfigurationFlyout = () => {
    this.setState({ chartConfigurationIsVisible: false });
  };

  private onDismissFeatureConfigurationFlyout = () => {
    this.setState({ featureConfigurationIsVisible: false });
  };

  private onVisualDisplayToggleChange = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    checked?: boolean | undefined
  ) => {
    if (checked !== undefined) {
      this.setState({ showHeatmapColors: checked });
    }
  };

  private onChooseCohorts = () =>
    this.setState({ chartConfigurationIsVisible: true });

  private updateCohortSelection = (
    selectedDatasetCohorts: number[],
    selectedFeatureBasedCohorts: number[],
    datasetCohortChartIsSelected: boolean
  ) =>
    this.setState({
      chartConfigurationIsVisible: false,
      datasetCohortChartIsVisible: datasetCohortChartIsSelected,
      selectedDatasetCohorts,
      selectedFeatureBasedCohorts
    });

  private onMetricSelectionChange = (
    _: React.FormEvent<IComboBox>,
    item?: IComboBoxOption
  ): void => {
    if (item && item.selected !== undefined) {
      const metric = item.key.toString();
      if (item.selected && !this.state.selectedMetrics.includes(metric)) {
        this.setState({
          selectedMetrics: this.state.selectedMetrics.concat([metric])
        });
      }
      if (!item.selected && this.state.selectedMetrics.includes(metric)) {
        const selectedMetrics = this.state.selectedMetrics;
        const unselectedMetricIndex = selectedMetrics.findIndex(
          (key) => key === metric
        );
        // remove unselected metric
        selectedMetrics.splice(unselectedMetricIndex, 1);
        this.setState({
          selectedMetrics
        });
      }
    }
  };

  private onFeatureConfigurationChange = (
    newSelectedFeatures: number[],
    numberOfContinuousFeatureBins: {
      [featureIndex: number]: number;
    }
  ): void => {
    const featureBasedCohorts = this.generateFeatureBasedCohorts(
      newSelectedFeatures,
      numberOfContinuousFeatureBins
    );
    this.setState({
      featureConfigurationIsVisible: false,
      selectedFeatureBasedCohorts: featureBasedCohorts.map((_, index) => index),
      selectedFeatures: newSelectedFeatures,
      selectedFeaturesContinuousFeatureBins: numberOfContinuousFeatureBins
    });
  };

  private onMetricConfigurationChange = (metrics: string[]): void => {
    this.setState({
      metricConfigurationIsVisible: false,
      selectedMetrics: metrics
    });
  };

  private onFeatureSelectionChange = (
    _: React.FormEvent<IComboBox>,
    item?: IComboBoxOption
  ): void => {
    if (item && item.selected !== undefined && typeof item.key === "number") {
      let newlySelectedFeatures = this.state.selectedFeatures;
      // technically we know it's only numbers but item.key has type string | number
      if (item.selected && !this.state.selectedFeatures.includes(item.key)) {
        newlySelectedFeatures = newlySelectedFeatures.concat([
          item.key as number
        ]);
      }
      if (!item.selected && this.state.selectedFeatures.includes(item.key)) {
        const unselectedFeatureIndex = newlySelectedFeatures.findIndex(
          (key) => key === item.key
        );
        // remove unselected feature
        newlySelectedFeatures.splice(unselectedFeatureIndex, 1);
      }
      const numberOfContinuousFeatureBins: {
        [featureIndex: number]: number;
      } = {};
      newlySelectedFeatures.forEach((featureIndex) => {
        numberOfContinuousFeatureBins[featureIndex] =
          this.state.selectedFeaturesContinuousFeatureBins[featureIndex] ??
          defaultNumberOfContinuousFeatureBins;
      });
      const featureBasedCohorts = this.generateFeatureBasedCohorts(
        newlySelectedFeatures,
        numberOfContinuousFeatureBins
      );
      this.setState({
        selectedFeatureBasedCohorts: featureBasedCohorts.map(
          (_, index) => index
        ),
        selectedFeatures: newlySelectedFeatures,
        selectedFeaturesContinuousFeatureBins: numberOfContinuousFeatureBins
      });
    }
  };

  private generateFeatureBasedCohorts(
    selectedFeatures: number[],
    numberOfContinuousFeatureBins: { [featureIndex: number]: number }
  ) {
    return generateOverlappingFeatureBasedCohorts(
      this.context.baseErrorCohort,
      this.context.jointDataset,
      this.context.dataset,
      selectedFeatures,
      numberOfContinuousFeatureBins
    );
  }

  private handleViewPivot = (item?: PivotItem | undefined): void => {
    if (item) {
      // The table and chart are handled with separate flags here
      // because users may still want to configure the chart differently
      // from the table. However, by default we present the chart matching
      // the table, i.e., if the dataset cohort view is chosen we show
      // the dataset cohort chart and if the disaggregated analysis view
      // is chosen we show the feature-based cohort chart.
      if (item.props.itemKey === datasetCohortViewPivotKey) {
        this.setState({
          datasetCohortChartIsVisible: true,
          datasetCohortViewIsVisible: true
        });
      }
      if (item.props.itemKey === disaggregatedAnalysisPivotKey) {
        this.setState({
          datasetCohortChartIsVisible: false,
          datasetCohortViewIsVisible: false
        });
      }
    }
  };
}
