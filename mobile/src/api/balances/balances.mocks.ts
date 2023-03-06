import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Balances } from "./balances.interface";

const defaultBalancesResponse: GenericApiResponse<Balances[]> = {
  value: [
    { tokenCode: "SCEUR", balance: 300 },
    { tokenCode: "SCUSD", balance: 10 },
  ],
};

export const balancesMocks = [
  rest.get(`${backendApiUrl}/api/accounts/balances`, (req, rest, ctx) => {
    return rest(ctx.status(200), ctx.json(defaultBalancesResponse));
  }),
];
