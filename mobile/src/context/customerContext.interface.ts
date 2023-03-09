// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

export type CustomerState = {
  isLoading: boolean;
  state: CustomerStateType | null;
  error: string | null;
};

export type CustomerStateContext = {
  isLoading: boolean;
  requiresCustomer: boolean | null;
  requiresAccount: boolean | null;
  isUnderReview: boolean | null;
  error: string | null;
  refresh: () => Promise<void>;
};

export enum CustomerStateActionType {
  INIT = "init",
  UPDATE_STATE = "update_state",
  ERROR = "error",
}

export enum CustomerStateType {
  CUSTOMER_REQUIRED = "customer_required",
  ACCOUNT_REQUIRED = "account_required",
  CUSTOMER_UNDER_REVIEW = "customer_under_review",
  READY = "ready",
}

export type CustomerStateAction =
  | { type: CustomerStateActionType.INIT }
  | { type: CustomerStateActionType.UPDATE_STATE; state: CustomerStateType }
  | { type: CustomerStateActionType.ERROR; errorMessage: string };
