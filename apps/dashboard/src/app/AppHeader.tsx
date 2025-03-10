// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CommandBar,
  ICommandBarItemProps,
  IContextualMenuItem
} from "@fluentui/react";
import { Language } from "@responsible-ai/localization";
import {
  featureFlights,
  featureFlightSeparator,
  parseFeatureFlights
} from "@responsible-ai/model-assessment";
import React from "react";

import { applications, IApplications } from "./applications";
import { IAppSetting, noFlights } from "./IAppSetting";
import { themes } from "./themes";

export interface IAppHeaderProps extends Required<IAppSetting> {
  application: keyof IApplications;
  onSettingChanged<T extends keyof IAppSetting>(
    field: T,
    value: IAppSetting[T]
  ): void;
}

export class AppHeader extends React.Component<IAppHeaderProps> {
  private readonly onApplicationSelect = this.onSelect.bind(
    this,
    "application"
  );

  public render(): React.ReactNode {
    const items: ICommandBarItemProps[] = [
      {
        iconProps: {
          iconName: "ViewList"
        },
        key: "application",
        subMenuProps: {
          items: this.getOptions(
            Object.keys(applications),
            this.onApplicationSelect
          )
        },
        text: `Application - ${this.props.application}`
      },
      {
        iconProps: {
          iconName: "NumberField"
        },
        key: "version",
        subMenuProps: {
          items: this.getOptions(
            Object.keys(applications[this.props.application].versions),
            this.onVersionSelect
          )
        },
        text: `Version - ${this.props.version}`
      },
      {
        iconProps: {
          iconName: "Database"
        },
        key: "dataset",
        subMenuProps: {
          items: this.getOptions(
            Object.keys(applications[this.props.application].datasets),
            this.onDatasetSelect
          )
        },
        text: `Dataset - ${this.props.dataset}`
      },
      {
        iconProps: {
          iconName: "ColorSolid"
        },
        key: "theme",
        subMenuProps: {
          items: this.getOptions(Object.keys(themes), this.onThemeSelect)
        },
        text: `Theme - ${this.props.theme}`
      },
      {
        iconProps: {
          iconName: "PlainText"
        },
        key: "language",
        subMenuProps: {
          items: this.getOptions(Object.keys(Language), this.onLanguageSelect)
        },
        text: `Language - ${this.props.language}`
      }
    ];
    if (this.props.application === "modelAssessment") {
      items.push({
        iconProps: {
          iconName: "Flag"
        },
        key: "featureFlights",
        subMenuProps: {
          items: this.getOptions(
            featureFlights,
            this.onFeatureFlightSelect,
            true,
            parseFeatureFlights(
              this.props.featureFlights === noFlights
                ? ""
                : this.props.featureFlights
            )
          )
        },
        text: `Feature flights - ${this.props.featureFlights}`
      });
    }
    return <CommandBar items={items} id="TopMenuBar" />;
  }
  private getOptions(
    labels: readonly string[],
    onClick: (
      ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
      item?: IContextualMenuItem
    ) => boolean | void,
    canCheck = false,
    checkedLabels: string[] = []
  ): IContextualMenuItem[] {
    return labels.map((l) => ({
      canCheck,
      checked: checkedLabels.includes(l),
      data: l,
      key: l,
      onClick,
      text: l
    }));
  }

  private onSelect(
    field: keyof IAppSetting,
    _ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    item?: IContextualMenuItem
  ): boolean {
    if (item?.data) {
      this.props.onSettingChanged(field, item?.data);
    }
    return true;
  }

  private readonly onVersionSelect = (
    _ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    item?: IContextualMenuItem
  ): boolean => {
    return this.onSelect("version", _ev, item);
  };
  private readonly onDatasetSelect = (
    _ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    item?: IContextualMenuItem
  ): boolean => {
    return this.onSelect("dataset", _ev, item);
  };
  private readonly onThemeSelect = (
    _ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    item?: IContextualMenuItem
  ): boolean => {
    return this.onSelect("theme", _ev, item);
  };
  private readonly onLanguageSelect = (
    _ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    item?: IContextualMenuItem
  ): boolean => {
    return this.onSelect("language", _ev, item);
  };
  private readonly onFeatureFlightSelect = (
    _ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    item?: IContextualMenuItem
  ): boolean => {
    return this.onFlightSelect("featureFlights", _ev, item);
  };

  private onFlightSelect(
    field: keyof IAppSetting,
    _ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    item?: IContextualMenuItem
  ): boolean {
    if (item?.data) {
      // item.checked means it was checked before the click
      if (item.checked) {
        if (this.props.featureFlights.includes(item.data)) {
          // need to remove flight
          const previousFlights = parseFeatureFlights(
            this.props.featureFlights
          );
          const newFlights = previousFlights.filter(
            (flight) => flight !== item.data
          );
          this.props.onSettingChanged(
            field,
            newFlights.length === 0
              ? noFlights
              : newFlights.join(featureFlightSeparator)
          );
        }
      } else if (!this.props.featureFlights.includes(item.data)) {
        // need to add flight
        this.props.onSettingChanged(
          field,
          this.props.featureFlights === noFlights
            ? item.data
            : this.props.featureFlights.concat(
                featureFlightSeparator,
                item.data
              )
        );
      }
    }
    return true;
  }
}
