// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { backendApiUrl } from "../utils/axios";
import Constants from "expo-constants";

type AppDefaultConfig = {
  defaultFiatCurrency: string;
  defaultStableCoin: {
    code: string;
    websiteLink: string;
  };
  supportEmail: string;
  termsUrl: string;
  feeSettings: {
    minimumFee: number;
  };
  fundBankingInfo: {
    beneficiary: string;
    iban: string;
    bic: string;
  };
  sharePaymentUrl: string;
  shareOfferUrl: string;
  minSendAmount: number;
  maxPaymentMessageLength: number;
};

export const defaultConfig: AppDefaultConfig = {
  defaultFiatCurrency: "EUR",
  defaultStableCoin: {
    code: Constants.expoConfig?.extra?.DEFAULT_STABLECOIN,
    websiteLink: "https://www.quantoz.com",
  },
  supportEmail: "support@quantozpayments.com",
  termsUrl: "https://www.quantozpay.com/terms",
  feeSettings: {
    minimumFee: 2,
  },
  fundBankingInfo: {
    beneficiary: "Quantoz Payments B.V.",
    iban: "NL123456789",
    bic: "NLABN12434",
  },
  sharePaymentUrl: `${backendApiUrl}/deeplinks/paymentrequests/`,
  shareOfferUrl: `${backendApiUrl}/deeplinks/offers/`,
  minSendAmount: 0.01,
  maxPaymentMessageLength: 28,
};

export const appNavigationState = {
  screens: {
    AppStack: {
      screens: {
        PortfolioOverview: {
          screens: {
            SendStack: {
              screens: {
                SendSummary: {
                  path: "paymentrequests/:code",
                },
              },
            },
          },
        },
        Offers: {
          screens: {
            ReviewScannedOffer: {
              path: "offers/:code",
            },
          },
        },
      },
    },
  },
};
