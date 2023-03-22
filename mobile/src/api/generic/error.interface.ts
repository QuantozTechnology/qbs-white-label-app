// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

export interface APIError {
  Errors: ApiErrorValue[];
}

export interface ApiErrorValue {
  Code: ApiErrorCode;
  Message: string;
  Target: string | null;
}

export enum ApiErrorCode {
  NexusSDKError = "NexusSDKError",
  InternalServerError = "InternalServerError",
  ValidationError = "ValidationError",
  AuthProviderError = "AuthProviderError",
  NotFoundError = "NotFoundError",
  InvalidProperty = "InvalidProperty",
  ExistingProperty = "ExistingProperty",
  PersistenceError = "PersistenceError",
  AccountNotFoundError = "AccountNotFoundError",
  CustomerNotFoundError = "CustomerNotFoundError",
  CustomerNotActive = "CustomerNotActive",
  InvalidStatus = "InvalidStatus",
}

export const genericApiError: APIError = {
  Errors: [
    {
      Code: ApiErrorCode.InternalServerError,
      Message: "Error",
      Target: null,
    },
  ],
};
