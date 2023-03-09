// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

export interface Tiers {
  Tier1: Tier;
  Tier2: Tier;
  Tier3: Tier;
}

export interface Tier {
  name: string;
  description: string;
  limits: LabelPartnerTrustlevelLimits;
}

export interface LabelPartnerTrustlevelLimits {
  funding: LabelPartnerTrustlevelLimitsDetails;
  withdraw: LabelPartnerTrustlevelLimitsDetails;
}

export interface LabelPartnerTrustlevelLimitsDetails {
  monthly: number;
}
