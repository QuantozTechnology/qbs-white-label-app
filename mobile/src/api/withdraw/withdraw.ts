// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { paymentsApi } from "../../utils/axios";
import {
  SimulateWithdrawPayload,
  WithdrawPayload,
  WithdrawResponse,
} from "./withdraw.interface";

export function createWithdraw(
  payload: WithdrawPayload
): Promise<AxiosResponse<unknown, WithdrawPayload>> {
  return paymentsApi.post("/api/transactions/withdraws", payload);
}

export async function simulateWithdraw({
  tokenCode,
  amount,
}: SimulateWithdrawPayload) {
  const { data } = await paymentsApi.get<WithdrawResponse>(
    "/api/transactions/withdraws/fees",
    {
      params: {
        tokenCode,
        amount,
      },
    }
  );

  return data;
}

export function useSimulateWithdraw(
  tokenCode: string,
  amount: string,
  options?: UseQueryOptions<WithdrawResponse>
) {
  const queryOptions: UseQueryOptions<WithdrawResponse> = Object.assign(
    options ?? {},
    {
      queryKey: ["simulateWithdraw", { amount }],
      queryFn: () => simulateWithdraw({ tokenCode, amount }),
    }
  );
  return useQuery(queryOptions);
}
