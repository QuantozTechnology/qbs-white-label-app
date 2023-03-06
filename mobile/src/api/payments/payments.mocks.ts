import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";

export const paymentsMocks = [
  rest.post(
    `${backendApiUrl}/api/transactions/payments/pay/paymentrequest`,
    (_req, rest, ctx) => {
      return rest(ctx.status(201));
    }
  ),
  rest.post(
    `${backendApiUrl}/api/transactions/payments/pay/account`,
    (_req, rest, ctx) => {
      return rest(ctx.status(201));
    }
  ),
];
