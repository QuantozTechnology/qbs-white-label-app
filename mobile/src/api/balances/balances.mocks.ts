// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Balances } from "./balances.interface";

export const defaultBalancesResponse: GenericApiResponse<Balances[]> = {
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
