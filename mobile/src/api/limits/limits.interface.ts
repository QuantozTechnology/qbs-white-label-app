// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

export interface Limits {
  tokenCode: string;
  funding: LimitsDetails;
  withdraw: LimitsDetails;
}

export interface LimitsDetails {
  used: Limit;
  limit: Limit;
}

export interface Limit {
  monthly: string;
}
