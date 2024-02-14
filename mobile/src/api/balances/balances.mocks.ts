// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HttpResponse, http } from "msw";
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
  http.get(`${backendApiUrl}/api/accounts/balances`, _ => {
    return HttpResponse.json(defaultBalancesResponse, { status: 200 });
  }),
];
