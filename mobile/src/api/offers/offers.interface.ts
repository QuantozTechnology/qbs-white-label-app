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
  pricePerUnit: z.number(),
  options: CreateOfferOptionsSchema.nullable(),
  offerCode: z.string().nullable(),
});

export type CreateOfferPayload = z.infer<typeof CreateOfferPayloadSchema>;

// GET offers
const OfferTokenSchema = z.object({
  tokenCode: z.string(),
  totalAmount: z.string(),
  remainingAmount: z.string().nullable(),
});

export type OfferToken = z.infer<typeof OfferTokenSchema>;

const OfferSchema = z.object({
  offerCode: z.string(),
  customerCode: z.string(),
  action: z.enum(["Buy", "Sell"]),
  sourceToken: OfferTokenSchema,
  destinationToken: OfferTokenSchema,
  options: z.object({
    isOneOffPayment: z.boolean(),
    payerCanChangeRequestedAmount: z.boolean(),
    expiresOn: z.null(),
    memo: z.null(),
    shareName: z.boolean(),
    params: z.null(),
  }),
  publicKey: z.string(),
  isMerchant: z.boolean(),
  status: z.enum(["Open", "Closed", "Expired", "Partial"]),
  merchantSettings: z
    .object({
      callbackUrl: z.string().url(),
      returnUrl: z.string().url(),
    })
    .nullable(),
  createdOn: z.string(),
  updatedOn: z.string(),
  callbacks: z.object({
    code: z.string(),
    status: z.string(),
  }),
  payments: z.array(
    z.object({
      transactionCode: z.string(),
      senderPublicKey: z.string(),
      receiverPublicKey: z.string(),
      amount: z.string(),
      tokenCode: z.string(),
      memo: z.string().nullable(),
    })
  ),
});

const OffersSchema = z.object({
  value: z.array(OfferSchema),
});
export type Offer = z.infer<typeof OfferSchema>;
export type Offers = z.infer<typeof OffersSchema>;
