// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { paymentsApi } from "../../utils/axios";
import { APIError } from "../generic/error.interface";
import { GenericApiResponse } from "../utils/api.interface";
import { Account } from "./account.interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAccount(): Promise<any> {
  const response = await paymentsApi.get("/api/accounts");
  return response;
}
// TODO find a way to specify the exact type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAccount(options?: any) {
  const queryOptions = Object.assign(options ?? {}, {
    queryKey: ["account"],
    queryFn: getAccount,
    retry: 1,
  });
  return useQuery<
    AxiosResponse<GenericApiResponse<Account>>,
    AxiosError<APIError>
  >(queryOptions);
}

export async function createAccount(): Promise<
  AxiosResponse<unknown, unknown>
> {
  const response = await paymentsApi.post("/api/accounts");

  return response;
}
