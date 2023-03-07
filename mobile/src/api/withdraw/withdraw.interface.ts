import { z } from "zod";

//
// POST withdraw
//
export const WithdrawPayloadSchema = z.object({
  tokenCode: z.string().min(1),
  amount: z.string().min(1),
});

//
// POST simulate withdraw
//
export const SimulateWithdrawPayloadSchema = z.object({
  tokenCode: z.string().min(1),
  amount: z.string().min(1),
});

//
// Response schema for both withdraw and simulate
//
export const FeesBreakdownSchema = z.object({
  bankFeeFiat: z.number().optional(),
  serviceFeeFiat: z.number().optional(),
});

export const WithdrawResponseSchema = z.object({
  value: z.object({
    requestedFiat: z.number(),
    fees: FeesBreakdownSchema,
    executedFiat: z.number(),
  }),
});

export type WithdrawPayload = z.infer<typeof WithdrawPayloadSchema>;
export type SimulateWithdrawPayload = z.infer<
  typeof SimulateWithdrawPayloadSchema
>;
export type WithdrawResponse = z.infer<typeof WithdrawResponseSchema>;
