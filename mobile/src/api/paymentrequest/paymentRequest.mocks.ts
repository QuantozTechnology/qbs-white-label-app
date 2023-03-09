// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { PaymentRequestResponse } from "./paymentRequest.interface";

export const paymentRequestMocksDefaultResponse: PaymentRequestResponse = {
  value: {
    code: "payment-request-code",
    requestedAmount: 10,
    status: "Open",
    tokenCode: "SCEUR",
    options: {
      expiresOn: 4070957704000,
      payerCanChangeRequestedAmount: true,
      isOneOffPayment: true,
      memo: "Test message",
      name: "John Doe",
    },
  },
};

export const paymentRequestsMocks = [
  rest.post(`${backendApiUrl}/api/paymentrequests`, (_req, rest, ctx) => {
    return rest(
      ctx.status(200),
      ctx.json<PaymentRequestResponse>(paymentRequestMocksDefaultResponse)
    );
  }),
  rest.get(`${backendApiUrl}/api/paymentrequests/:code`, (_req, rest, ctx) => {
    return rest(
      ctx.status(200),
      ctx.json<PaymentRequestResponse>(paymentRequestMocksDefaultResponse)
    );
  }),
];
