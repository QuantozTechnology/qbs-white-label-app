// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { Offers } from "./offers.interface";

export const mockOffers: Offers = {
  value: [
    {
      offerCode: "test",
      customerCode: "test-cust",
      action: "Buy",
      sourceToken: {
        tokenCode: "SCEUR",
        totalAmount: "100.00",
        remainingAmount: null,
      },
      destinationToken: {
        tokenCode: "PLAT",
        totalAmount: "500.000",
        remainingAmount: "400.000",
      },
      options: {
        isOneOffPayment: true,
        payerCanChangeRequestedAmount: false,
        expiresOn: null,
        memo: null,
        shareName: true,
        params: null,
      },
      publicKey: "pubkey",
      isMerchant: false,
      status: "Partial",
      merchantSettings: {
        callbackUrl: "https://example.com/api/callback",
        returnUrl: "https://example.com/checkout/success",
      },
      createdOn: 1683590400,
      updatedOn: 1683590400,
      callbacks: {
        code: "whatever",
        status: "Created",
      },
      payments: [
        {
          transactionCode: "123456789",
          senderPublicKey: "0x123456789abcdef",
          receiverPublicKey: "0x987654321fedcba",
          amount: "100.0",
          tokenCode: "PLAT",
          memo: null,
        },
      ],
    },
  ],
};

export const offersMocks = [
  rest.post(`${backendApiUrl}/api/offers`, (_req, rest, ctx) => {
    return rest(ctx.status(201), ctx.json({}));
  }),
  rest.get(`${backendApiUrl}/api/offers`, (_req, rest, ctx) => {
    return rest(
      ctx.status(200),
      ctx.set(
        "x-pagination",
        '{"TotalCount":5,"PageSize":10,"CurrentPage":1,"PreviousPage":null,"NextPage":null,"TotalPages":1}'
      ),
      ctx.json(mockOffers)
    );
  }),
];
