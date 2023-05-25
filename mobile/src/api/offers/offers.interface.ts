// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { z } from "zod";

const CreateOfferOptionsSchema = z.object({
  isOneOffPayment: z.boolean().nullable(),
  payerCanChangeRequestedAmount: z.boolean().nullable(),
  expiresOn: z
    .number()
    .refine((value) => {
      const date = new Date(value);
      return date.getTime() === value;
    })
    .nullable(),
  memo: z.string().nullable(),
  shareName: z.boolean().nullable(),
  params: z.record(z.string()).nullable(),
});

const CreateOfferTokenSchema = z.object({
  tokenCode: z.string(),
  amount: z.number(),
});

const CreateOfferPayloadSchema = z.object({
  action: z.enum(["Buy", "Sell"]),
  sourceToken: CreateOfferTokenSchema,
  destinationToken: CreateOfferTokenSchema,
  options: CreateOfferOptionsSchema.nullable(),
  offerCode: z.string().nullable(),
});

export type CreateOfferPayload = z.infer<typeof CreateOfferPayloadSchema>;
