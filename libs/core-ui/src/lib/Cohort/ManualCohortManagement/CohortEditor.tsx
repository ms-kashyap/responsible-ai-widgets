// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IComboBoxOption,
  IComboBox,
  Text,
  TextField,
  DefaultButton,
  PrimaryButton,
  Stack,
  Panel,
  Link,
  ChoiceGroup,
  IChoiceGroupOption
} from "@fluentui/react";
import { localization } from "@responsible-ai/localization";
import { RangeTypes } from "@responsible-ai/mlchartlib";
import _ from "lodash";
import React, { FormEvent } from "react";

import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import {
  FilterMethods,
  ICompositeFilter,
  IFilter
} from "../../Interfaces/IFilter";
import { IJointMeta, JointDataset } from "../../util/JointDataset";
import { Cohort } from "../Cohort";

import { cohortEditorStyles } from "./CohortEditor.styles";
import { CohortEditorFilter } from "./CohortEditorFilter";
import { CohortEditorFilterList } from "./CohortEditorFilterList";
import { EmptyCohortDialog } from "./EmptyCohortDialog";

export interface ICohortEditorProps {
  jointDataset: JointDataset;
  cohortName: string;
  isNewCohort: boolean;
  deleteIsDisabled: boolean;
  disableEditName?: boolean;
  existingCohortNames?: string[];
  onSave: (newCohort: Cohort, switchNew?: boolean) => void;
  closeCohortEditor: () => void;
  closeCohortEditorPanel: () => void;
  filterList?: IFilter[];
  compositeFilters?: ICompositeFilter[];
  onDelete?: () => void;
}

export interface ICohortEditorState {
  openedFilter?: IFilter;
  filterIndex?: number;
  filters: IFilter[];
  compositeFilters: ICompositeFilter[];
  cohortName?: string;
  selectedFilterCategory?: string;
  showConfirmation: boolean;
  showEmptyCohortError: boolean;
  showInvalidMinMaxValueError: boolean;
  showInvalidValueError: boolean;
}

export class CohortEditor extends React.PureComponent<
  ICohortEditorProps,
  ICohortEditorState
> {
  private readonly leftItems: IChoiceGroupOption[] = [
    JointDataset.IndexLabel,
    JointDataset.DataLabelRoot,
    JointDataset.PredictedYLabel,
    JointDataset.TrueYLabel,
    JointDataset.ClassificationError,
    JointDataset.RegressionError
  ].reduce((previousValue: IChoiceGroupOption[], key: string) => {
    const metaVal = this.props.jointDataset.metaDict[key];
    if (
      key === JointDataset.DataLabelRoot &&
      this.props.jointDataset.hasDataset
    ) {
      previousValue.push({ key, text: "Dataset" });
      return previousValue;
    }
    if (metaVal === undefined) {
      return previousValue;
    }
    previousValue.push({ key, text: metaVal.abbridgedLabel });
    return previousValue;
  }, []);
  private _isInitialized = false;

  public constructor(props: ICohortEditorProps) {
    super(props);
    this.state = {
      cohortName: this.props.cohortName,
      compositeFilters: this.props.compositeFilters || [],
      filterIndex: this.props.filterList?.length || 0,
      filters: this.props.filterList || [],
      openedFilter: this.getFilterValue(
        this.leftItems[0] && this.leftItems[0].key
      ),
      selectedFilterCategory: this.leftItems[0] && this.leftItems[0].key,
      showConfirmation: false,
      showEmptyCohortError: false,
      showInvalidMinMaxValueError: false,
      showInvalidValueError: false
    };
    this._isInitialized = true;
  }

  public render(): React.ReactNode {
    const openedFilter = this.state.openedFilter;
    const styles = cohortEditorStyles();
    return (
      <>
        <Panel
          onOuterClick={(): number => {
            return 0;
          }} // https://github.com/microsoft/fluentui/issues/6476
          id="cohortEditPanel"
          isOpen
          onDismiss={this.props.closeCohortEditorPanel}
          onRenderFooter={this.renderFooter}
          isFooterAtBottom
          isLightDismiss
        >
          <Stack tokens={{ childrenGap: "l1" }}>
            <Stack.Item>
              <TextField
                value={this.state.cohortName}
                label={localization.Interpret.CohortEditor.cohortNameLabel}
                placeholder={
                  localization.Interpret.CohortEditor.cohortNamePlaceholder
                }
                onGetErrorMessage={this._getErrorMessage}
                disabled={this.props.disableEditName}
                onChange={this.setCohortName}
              />
            </Stack.Item>
            <Stack.Item>
              <ChoiceGroup
                options={this.leftItems}
                label={localization.Interpret.CohortEditor.selectFilter}
                onChange={this.onFilterCategoryChange}
                selectedKey={this.state.selectedFilterCategory}
              />
            </Stack.Item>
            <Stack.Item>
              {!openedFilter ? (
                <Text variant={"medium"}>
                  {localization.Interpret.CohortEditor.defaultFilterState}
                </Text>
              ) : (
                <CohortEditorFilter
                  cancelFilter={this.cancelFilter}
                  filters={this.state.filters}
                  jointDataset={this.props.jointDataset}
                  openedFilter={openedFilter}
                  saveState={this.saveState}
                  setAsCategorical={this.setAsCategorical}
                  setCategoricalValues={this.setCategoricalValues}
                  setComparison={this.setComparison}
                  setNumericValue={this.setNumericValue}
                  setSelectedProperty={this.setSelectedProperty}
                  showInvalidValueError={this.state.showInvalidValueError}
                  showInvalidMinMaxValueError={
                    this.state.showInvalidMinMaxValueError
                  }
                  filterIndex={this.state.filterIndex}
                />
              )}
            </Stack.Item>
            <Stack.Item>
              <CohortEditorFilterList
                compositeFilters={this.state.compositeFilters}
                editFilter={this.editFilter}
                removeCompositeFilter={this.removeCompositeFilter}
                removeFilter={this.removeFilter}
                filters={this.state.filters}
                jointDataset={this.props.jointDataset}
              />
            </Stack.Item>
            <Stack.Item>
              <Link
                className={styles.clearFilter}
                onClick={this.clearAllFilters}
              >
                {localization.Interpret.CohortEditor.clearAllFilters}
              </Link>
            </Stack.Item>
          </Stack>
        </Panel>
        {this.renderCancelDialog()}
        {this.renderEmptyCohortDialog()}
      </>
    );
  }
  private renderFooter = (): JSX.Element => {
    const styles = cohortEditorStyles();
    return (
      <Stack horizontal tokens={{ childrenGap: "l1", padding: "l1" }}>
        {!this.props.isNewCohort && !this.props.disableEditName && (
          <DefaultButton
            disabled={this.props.deleteIsDisabled}
            onClick={this.deleteCohort}
            className={styles.deleteCohort}
          >
            {localization.Interpret.CohortEditor.delete}
          </DefaultButton>
        )}
        <PrimaryButton
          onClick={() => this.saveCohort()}
          disabled={this.isSaveDisabled()}
        >
          {localization.Interpret.CohortEditor.save}
        </PrimaryButton>
        <DefaultButton
          onClick={() => this.saveCohort(true)}
          disabled={this.isSaveDisabled()}
        >
          {localization.Interpret.CohortEditor.saveAndSwitch}
        </DefaultButton>
        <DefaultButton onClick={this.onCancelClick}>
          {localization.Interpret.CohortEditor.cancel}
        </DefaultButton>
      </Stack>
    );
  };

  private readonly renderCancelDialog = (): React.ReactNode => {
    if (!this.state.showConfirmation) {
      return undefined;
    }
    return (
      <ConfirmationDialog
        title={localization.Interpret.CohortEditor.cancelTitle}
        subText={
          this.props.isNewCohort
            ? localization.Interpret.CohortEditor.cancelNewCohort
            : localization.Interpret.CohortEditor.cancelExistingCohort
        }
        confirmButtonText={localization.Interpret.CohortEditor.cancelYes}
        cancelButtonText={localization.Interpret.CohortEditor.cancelNo}
        onConfirm={this.onCancelConfirm}
        onClose={this.onCancelClose}
      />
    );
  };

  private readonly renderEmptyCohortDialog = (): React.ReactNode => {
    if (!this.state.showEmptyCohortError) {
      return undefined;
    }
    return <EmptyCohortDialog onClose={this.onEmptyCohortClose} />;
  };

  private isSaveDisabled = (): boolean => {
    return (
      this.isDuplicate() ||
      (!this.state.compositeFilters?.length && !this.state.filters?.length)
    );
  };

  private isDuplicate = (): boolean => {
    return !!(
      this.props.isNewCohort &&
      this.state.cohortName &&
      this.props.existingCohortNames?.includes(this.state.cohortName)
    );
  };

  private clearAllFilters = (): void => {
    this.setState({ compositeFilters: [], filters: [] });
  };

  private deleteCohort = (): void => {
    if (this.props.onDelete) {
      this.props.onDelete();
    }
  };

  private readonly onCancelClick = (): void => {
    this.setState({ showConfirmation: true });
  };

  private readonly onCancelConfirm = async (): Promise<void> => {
    const callback = this.props.isNewCohort
      ? this.props.closeCohortEditorPanel
      : this.props.closeCohortEditor;
    callback();
    this.setState({ showConfirmation: false });
  };

  private readonly onCancelClose = (): void => {
    this.setState({ showConfirmation: false });
  };

  private readonly onEmptyCohortClose = (): void => {
    this.setState({ showEmptyCohortError: false });
  };

  private readonly setAsCategorical = (
    _ev?: React.FormEvent,
    checked?: boolean
  ): void => {
    if (checked === undefined || !this.state.openedFilter) {
      return;
    }
    const openedFilter = this.state.openedFilter;
    this.props.jointDataset.setTreatAsCategorical(openedFilter.column, checked);
    if (checked) {
      this.setState({
        openedFilter: {
          arg: [],
          column: openedFilter.column,
          method: FilterMethods.Includes
        }
      });
    } else {
      this.setState({
        openedFilter: {
          arg: [
            this.props.jointDataset.metaDict[openedFilter.column].featureRange
              ?.max || Number.MAX_SAFE_INTEGER
          ],
          column: openedFilter.column,
          method: FilterMethods.LessThan
        }
      });
    }
  };

  private _getErrorMessage = (): string | undefined => {
    if (!this.state.cohortName?.length) {
      return localization.Interpret.CohortEditor.cohortNameError;
    }
    if (this.isDuplicate()) {
      return localization.Interpret.CohortEditor.cohortNameDupError;
    }
    return undefined;
  };
  private readonly onFilterCategoryChange = (
    _?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
    option?: IChoiceGroupOption | undefined
  ): void => {
    if (typeof option?.key === "string") {
      this.setState({
        filterIndex: this.state.filters.length,
        selectedFilterCategory: option.key
      });
      this.setSelection(option.key);
    }
  };

  private readonly setSelection = (property: string): void => {
    if (!this._isInitialized) {
      return;
    }
    if (property === JointDataset.DataLabelRoot) {
      property += "0";
    }
    this.setDefaultStateForKey(property);
  };

  private readonly setSelectedProperty = (
    _: React.FormEvent<IComboBox>,
    item?: IComboBoxOption
  ): void => {
    if (typeof item?.key === "string") {
      const property = item.key;
      this.setDefaultStateForKey(property);
    }
  };

  private saveState = (index?: number): void => {
    if (!this.state.openedFilter || index === undefined) {
      return;
    }
    this.updateFilter(this.state.openedFilter, index);
    this.setState({ selectedFilterCategory: undefined });
  };

  private readonly setCategoricalValues = (
    _ev?: React.FormEvent<IComboBox>,
    item?: IComboBoxOption
  ): void => {
    if (!this.state.openedFilter || (!item?.key && item?.key !== 0)) {
      return;
    }
    const openedFilter = this.state.openedFilter;
    const selectedVals = [...(openedFilter.arg as number[])];

    const index = selectedVals.indexOf(item.key as number);
    if (item.selected && index === -1) {
      selectedVals.push(item.key as number);
    } else {
      selectedVals.splice(index, 1);
    }
    this.setState({
      openedFilter: {
        arg: selectedVals,
        column: openedFilter.column,
        method: openedFilter.method
      }
    });
  };

  private readonly setComparison = (
    _ev?: React.FormEvent<IComboBox>,
    item?: IComboBoxOption
  ): void => {
    if (!this.state.openedFilter || !item) {
      return;
    }
    const openedFilter = this.state.openedFilter;
    if ((item.key as FilterMethods) === FilterMethods.InTheRangeOf) {
      //default values for in the range operation
      const meta =
        this.props.jointDataset.metaDict[openedFilter.column].featureRange;
      if (meta?.min === undefined) {
        openedFilter.arg[0] = Number.MIN_SAFE_INTEGER;
      } else {
        openedFilter.arg[0] = meta.min;
      }
      if (meta?.max === undefined) {
        openedFilter.arg[1] = Number.MAX_SAFE_INTEGER;
      } else {
        openedFilter.arg[1] = meta.max;
      }
    } else {
      //handle switch from in the range to less than, equals etc
      openedFilter.arg = openedFilter.arg.slice(0, 1);
    }
    this.setState({
      openedFilter: {
        arg: openedFilter.arg,
        column: openedFilter.column,
        method: item.key as FilterMethods
      }
    });
  };

  private readonly setNumericValue = (
    delta: number,
    column: IJointMeta,
    index: number,
    stringVal: string
  ): string | void => {
    if (!this.state.openedFilter) {
      return;
    }
    const openArg = this.state.openedFilter.arg;
    const max = column.featureRange?.max || Number.MAX_SAFE_INTEGER;
    const min = column.featureRange?.min || Number.MIN_SAFE_INTEGER;
    if (delta === 0) {
      const numberVal = +stringVal;
      if (
        (!Number.isInteger(numberVal) &&
          column.featureRange?.rangeType === RangeTypes.Integer) ||
        numberVal > max ||
        numberVal < min
      ) {
        this.setState({
          showInvalidMinMaxValueError: false,
          showInvalidValueError: true
        });
        return this.state.openedFilter.arg[index].toString();
      }
      this.setState({ showInvalidValueError: false });
      openArg[index] = numberVal;
    } else {
      const prevVal = openArg[index];
      const newVal = prevVal + delta;
      if (newVal > max || newVal < min) {
        this.setState({
          showInvalidMinMaxValueError: false,
          showInvalidValueError: true
        });
        return prevVal.toString();
      }
      this.setState({ showInvalidValueError: false });
      openArg[index] = newVal;
    }

    // in the range validation
    if (openArg[1] <= openArg[0]) {
      openArg[1] = max;
      this.setState({
        showInvalidMinMaxValueError: true,
        showInvalidValueError: false
      });
    } else {
      this.setState({ showInvalidMinMaxValueError: false });
    }

    this.setState({
      openedFilter: {
        arg: openArg,
        column: this.state.openedFilter.column,
        method: this.state.openedFilter.method
      }
    });
  };

  private setDefaultStateForKey(key: string): void {
    const filter = this.getFilterValue(key);
    this.setState({
      openedFilter: filter
    });
  }

  private getFilterValue(key: string): IFilter {
    const filter: IFilter = { column: key } as IFilter;
    const meta = this.props.jointDataset.metaDict[key];
    if (meta?.treatAsCategorical && meta.sortedCategoricalValues) {
      filter.method = FilterMethods.Includes;
      filter.arg = [...new Array(meta.sortedCategoricalValues.length).keys()];
    } else {
      filter.method = FilterMethods.LessThan;
      filter.arg = [meta.featureRange?.max || Number.MAX_SAFE_INTEGER];
    }
    return filter;
  }

  private updateFilter(filter: IFilter, index: number): void {
    const filters = [...this.state.filters];
    filters[index] = filter;
    this.setState({
      filters,
      openedFilter: undefined
    });
  }

  private cancelFilter = (): void => {
    this.setState({
      openedFilter: undefined,
      selectedFilterCategory: undefined
    });
  };

  private removeFilter = (index: number): void => {
    const filters = [...this.state.filters];
    filters.splice(index, 1);
    this.setState({ filters });
  };

  private removeCompositeFilter = (index: number): void => {
    const compositeFilters = [...this.state.compositeFilters];
    compositeFilters.splice(index, 1);
    this.setState({ compositeFilters });
  };

  private editFilter = (index: number): void => {
    const editFilter = this.state.filters[index];
    this.setState({
      filterIndex: index,
      openedFilter: _.cloneDeep(editFilter)
    });
  };

  private saveCohort = (switchNew?: boolean): void => {
    if (this.state.cohortName?.length) {
      const newCohort = new Cohort(
        this.state.cohortName,
        this.props.jointDataset,
        this.state.filters,
        this.state.compositeFilters
      );
      if (newCohort.filteredData.length === 0) {
        this.setState({ showEmptyCohortError: true });
      } else {
        this.props.onSave(newCohort, switchNew);
      }
    }
  };

  private setCohortName = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    this.setState({ cohortName: newValue });
  };
}
