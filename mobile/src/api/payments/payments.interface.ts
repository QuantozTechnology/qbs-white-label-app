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
