// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IModelAssessmentData,
  RAINotebookNames
} from "../IModelAssessmentData";
import { modelAssessmentDatasets } from "../modelAssessmentDatasets";

import { describeAggregatePlot } from "./describeAggregatePlot";
import { describeCohortFunctionality } from "./describeCohortFunctionality";
import { describeIndividualDatapoints } from "./describeIndividualDatapoints";

const testName = "Dataset explorer";

export function describeDatasetExplorer(
  datasetShape: IModelAssessmentData,
  name?: keyof typeof modelAssessmentDatasets
): void {
  describe(testName, () => {
    before(() => {
      if (name) {
        const hosts = Cypress.env().hosts;
        const hostDetails = hosts.find((obj: { file: string }) => {
          return obj.file === RAINotebookNames[name];
        });
        cy.task("log", hostDetails.host);
        cy.visit(hostDetails.host);
      }
      cy.get("#ModelAssessmentDashboard").should("exist");
    });
    if (datasetShape.featureImportanceData?.noDataset) {
      it("should render no data message", () => {
        cy.get("#MissingParameterPlaceHolder").contains(
          "This tab requires an evaluation dataset be supplied."
        );
      });
      return;
    }
    describeAggregatePlot(datasetShape);
    describeCohortFunctionality(datasetShape);
    describeIndividualDatapoints(datasetShape);
  });
}
