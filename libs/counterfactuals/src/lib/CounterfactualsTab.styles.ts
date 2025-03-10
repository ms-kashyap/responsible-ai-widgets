// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IStyle,
  mergeStyleSets,
  IProcessedStyleSet,
  getTheme
} from "@fluentui/react";
import { descriptionMaxWidth } from "@responsible-ai/core-ui";

export interface ICounterfactualsTabStyles {
  container: IStyle;
  infoWithText: IStyle;
}

export const counterfactualsTabStyles: () => IProcessedStyleSet<ICounterfactualsTabStyles> =
  () => {
    const theme = getTheme();
    return mergeStyleSets<ICounterfactualsTabStyles>({
      container: {
        color: theme.semanticColors.bodyText,
        padding: "0 40px 10px 40px"
      },
      infoWithText: { maxWidth: descriptionMaxWidth }
    });
  };
