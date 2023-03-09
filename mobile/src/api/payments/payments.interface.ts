// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { z } from "zod";

export const CreatePaymentForPaymentRequestSchema = z.object({
  paymentRequestCode: z.string(),
  amount: z.string().optional(),
});

export const CreatePaymentForAccountSchema = z.object({
  toAccountCode: z.string(),
  tokenCode: z.string(),
  amount: z.coerce.number(),
  memo: z.string().optional(),
  options: z
    .object({
      shareName: z.boolean(),
    })
    .optional(),
});

export type CreatePaymentForPaymentRequest = z.infer<
  typeof CreatePaymentForPaymentRequestSchema
>;

export type CreatePaymentForAccount = z.infer<
  typeof CreatePaymentForAccountSchema
>;
