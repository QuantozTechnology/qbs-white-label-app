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
      memo: z.string().trim().nullable().optional(),
      params: z.record(z.string()),
    })
    .partial(),
});

export type CreatePaymentRequestPayload = z.infer<
  typeof CreatePaymentRequestPayloadSchema
>;

export const PaymentRequestStatus = z.enum([
  "Open",
  "Paid",
  "Cancelled",
  "Processing",
]);

const PaymentRequestPaymentsSchema = z.array(
  z.object({
    transactionCode: z.string(),
    accountCode: z.string().nullable(),
    amount: z.number(),
    createdOn: z.number(),
    updatedOn: z.number(),
  })
);

export type PaymentRequestPayments = z.infer<
  typeof PaymentRequestPaymentsSchema
>;

export const PaymentRequestDetailsSchema = z.object({
  code: z.string(),
  tokenCode: z.string(),
  requestedAmount: z.number(),
  status: PaymentRequestStatus,
  createdOn: z.number(),
  updatedOn: z.number().nullable(),
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
  payments: PaymentRequestPaymentsSchema,
});

export type PaymentRequestDetails = z.infer<typeof PaymentRequestDetailsSchema>;

export const PaymentRequestResponseSchema = z.object({
  value: PaymentRequestDetailsSchema,
});

export type PaymentRequestResponse = z.infer<
  typeof PaymentRequestResponseSchema
>;

export const PaymentRequestsResponseSchema = z.object({
  value: z.array(PaymentRequestDetailsSchema),
});

export type PaymentRequestsResponse = z.infer<
  typeof PaymentRequestsResponseSchema
>;
