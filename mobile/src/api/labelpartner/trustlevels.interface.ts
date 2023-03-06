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
