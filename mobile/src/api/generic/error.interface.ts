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
