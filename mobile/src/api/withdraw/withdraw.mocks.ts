import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { IWithdrawFees } from "./withdraw.interface";

export const defaultWithdrawFeeResponse: GenericApiResponse<IWithdrawFees> = {
  value: {
    executedFiat: 10,
    fees: {
      bankFeeFiat: 1,
      serviceFeeFiat: 1,
    },
    requestedFiat: 12,
  },
};

export const withdrawMocks = [
  rest.post(
    `${backendApiUrl}/api/transactions/withdraws`,
    (_req, rest, ctx) => {
      return rest(ctx.status(201));
    }
  ),
  rest.get(
    `${backendApiUrl}/api/transactions/withdraws/fees`,
    (_req, rest, ctx) => {
      return rest(ctx.status(200), ctx.json(defaultWithdrawFeeResponse));
    }
  ),
];
