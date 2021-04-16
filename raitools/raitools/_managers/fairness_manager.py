# Copyright (c) Microsoft Corporation
# Licensed under the MIT License.

"""Defines the Fairness Manager class."""

from typing import List, Union

import pandas as pd

from raitools._managers.base_manager import BaseManager


class TargetDataset:
    INIT = 'initialization'
    EVAL = 'evaluation'
    BOTH = 'both'

    @classmethod
    def validate(target: str):
        _all = [
            TargetDataset.INIT,
            TargetDataset.EVAL,
            TargetDataset.BOTH
        ]
        assert target in _all


class FairnessRequest:
    def __init__(self,
                 y_true: pd.Series,
                 y_pred: pd.Series,
                 sensitive_features,
                 target: str):
        self._y_true = y_true
        self._y_pred = y_pred
        self._sensitive_features = sensitive_features
        self._target = target

    @property
    def y_true(self) -> pd.Series:
        return self._y_true

    @property
    def y_pred(self) -> pd.Series:
        return self._y_pred

    @property
    def sensitive_features(self):
        return self._sensitive_features

    @property
    def target_dataset(self):
        return self._target


class FairnessManager(BaseManager):
    def __init__(self,
                 model,
                 initialization_data: pd.DataFrame,
                 evaluation_data: pd.DataFrame,
                 target_column: str,
                 task_type: str):
        self._y_true_init = initialization_data[target_column]
        self._y_true_eval = evaluation_data[target_column]
        self._init_data = initialization_data.drop(columns=[target_column])
        self._eval_data = evaluation_data.drop(columns=[target_column])
        self._y_pred_init = model.predict(self._init_data)
        self._y_pred_eval = model.predict(self._eval_data)
        self._request_list: List[FairnessRequest] = None

    def add(self,
            sensitive_features: Union[str, pd.Series],
            target_dataset: str
            ):
        TargetDataset.validate(target_dataset)

        if target_dataset == TargetDataset.INIT:
            y_t = self._y_true_init
            y_p = self._y_pred_init
            if isinstance(sensitive_features, str):
                s_f = self._init_data[sensitive_features]
        elif target_dataset == TargetDataset.EVAL:
            y_t = self._y_true_eval
            y_p = self._y_pred_eval
            if isinstance(sensitive_features, str):
                s_f = self._eval_data[sensitive_features]
        elif target_dataset == TargetDataset.BOTH:
            y_t = pd.concat([self._y_true_init, self._y_true_eval],
                            ignore_index=True, axis=1)
            y_p = pd.concat([self._y_pred_init, self._y_pred_eval],
                            ignore_index=True, axis=1)
            if isinstance(sensitive_features, str):
                s_f = pd.concat([self._init_data[sensitive_features],
                                 self._eval_data[sensitive_features]],
                                ignore_index=True, axis=1)
        else:
            raise NotImplementedError("Can't get here")

        if isinstance(sensitive_features, pd.Series):
            s_f = sensitive_features

        request = FairnessRequest(y_t, y_p, s_f, target_dataset)
        self._request_list.append(request)

    def compute(self):
        pass

    def get(self):
        raise NotImplementedError(
            "Get not implemented for FairnessManager")

    def list(self):
        pass

    @property
    def name(self):
        """Get the name of the fairness manager.

        :return: The name of the fairness manager.
        :rtype: str
        """
        return "fairness"

    def save(self, path):
        raise NotImplementedError(
            "Save not implemented for FairnessManager")

    @staticmethod
    def load(path):
        raise NotImplementedError(
            "Load not implemented for FairnessManager")
