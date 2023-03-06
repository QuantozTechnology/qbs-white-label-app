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
