// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HttpResponse, http } from "msw";
import { backendApiUrl } from "../../utils/axios";
import {
  PaymentRequestResponse,
  PaymentRequestsResponse,
} from "./paymentRequest.interface";

export const paymentRequestMocksDefaultResponse: PaymentRequestResponse = {
  value: {
    code: "payment-request-code",
    requestedAmount: 10,
    status: "Open",
    tokenCode: "SCEUR",
    createdOn: 1672562403000,
    updatedOn: 1672562403000,
    options: {
      expiresOn: 4070957704000,
      payerCanChangeRequestedAmount: true,
      isOneOffPayment: true,
      memo: "Test message",
      name: "John Doe",
    },
    payments: [
      {
        accountCode: "12345678",
        amount: 10,
        createdOn: 1672648803000,
        updatedOn: 1672648803000,
        transactionCode: "test-tx-code",
      },
    ],
  },
};

export const paymentRequestsListMocksDefaultResponse: PaymentRequestsResponse =
{
  value: [
    {
      code: "payment-request-code",
      requestedAmount: 10,
      status: "Open",
      tokenCode: "SCEUR",
      createdOn: 1672562403000,
      updatedOn: 1672562403000,
      options: {
        expiresOn: 4070957704000,
        payerCanChangeRequestedAmount: true,
        isOneOffPayment: true,
        memo: "Test message",
        name: "John Doe",
      },
      payments: [
        {
          accountCode: "12345678",
          amount: 10,
          createdOn: 1672648803000,
          updatedOn: 1672648803000,
          transactionCode: "test-tx-code",
        },
      ],
    },
  ],
};

export const paymentRequestsMocks = [
  http.post(`${backendApiUrl}/api/paymentrequests`, _ => {
    return HttpResponse.json<PaymentRequestResponse>(paymentRequestMocksDefaultResponse, { status: 201 });
  }),
  http.get(`${backendApiUrl}/api/paymentrequests/:code`, _ => {
    return HttpResponse.json<PaymentRequestResponse>(paymentRequestMocksDefaultResponse, { status: 200 });
  }),
  http.get(`${backendApiUrl}/api/paymentrequests`, _ => {
    return HttpResponse.json<PaymentRequestsResponse>(paymentRequestsListMocksDefaultResponse,
      {
        status: 200,
        headers: { "x-pagination": '{"TotalCount":5,"PageSize":10,"CurrentPage":1,"PreviousPage":null,"NextPage":null,"TotalPages":1}' }
      });
  }),
  http.put(
    `${backendApiUrl}/api/paymentrequests/:code/cancel`,
    _ => {
      return new Response(JSON.stringify({ value: { }}), { status: 200 });
    }
  ),
];
