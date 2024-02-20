// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HttpResponse, http } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { WithdrawResponse } from "./withdraw.interface";

export const defaultWithdrawFeeResponse: WithdrawResponse = {
  value: {
      requestedFiat: 12,
      fees: {
        bankFeeFiat: 1,
        serviceFeeFiat: 1,
      },
      executedFiat: 10
    },
};

export const withdrawMocks = [
  http.post(
    `${backendApiUrl}/api/transactions/withdraws`,
    _ => {
      return new Response(null, { status: 201 });
    }
  ),
  http.get(
    `${backendApiUrl}/api/transactions/withdraws/fees`,
    _ => {
      return HttpResponse.json(defaultWithdrawFeeResponse, { status: 200 });
    }
  ),
];
