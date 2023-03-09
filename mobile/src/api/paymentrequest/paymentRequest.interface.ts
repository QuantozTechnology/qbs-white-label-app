// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { z } from "zod";

export const CreatePaymentRequestPayloadSchema = z.object({
  tokenCode: z.string(),
  amount: z
    .number({
      invalid_type_error: "Amount must be specified",
    })
    .gt(0, "Amount must be greater than 0"),
  options: z
    .object({
      expiresOn: z.number().nullable(),
      shareName: z.boolean(),
      isOneOffPayment: z.boolean(),
      payerCanChangeRequestedAmount: z.boolean(),
      memo: z.string().trim().optional(),
      params: z.record(z.string()),
    })
    .partial(),
});

export type CreatePaymentRequestPayload = z.infer<
  typeof CreatePaymentRequestPayloadSchema
>;

export const PaymentRequestStatus = z.enum(["Open", "Paid", "Cancelled"]);

export const PaymentRequestResponseSchema = z.object({
  value: z.object({
    code: z.string(),
    tokenCode: z.string(),
    requestedAmount: z.number(),
    status: PaymentRequestStatus,
    options: z
      .object({
        expiresOn: z.number().nullable(),
        memo: z.string().trim().nullable(),
        name: z.string().nullable(),
        isOneOffPayment: z.boolean(),
        payerCanChangeRequestedAmount: z.boolean(),
        params: z.record(z.string()).optional(),
      })
      .partial(),
  }),
});

export type PaymentRequestResponse = z.infer<
  typeof PaymentRequestResponseSchema
>;
