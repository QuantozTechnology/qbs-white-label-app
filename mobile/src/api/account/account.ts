import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { paymentsApi } from "../../utils/axios";
import { APIError } from "../generic/error.interface";
import { GenericApiResponse } from "../utils/api.interface";
import { Account } from "./account.interface";

export async function getAccount() {
  const response = await paymentsApi.get<GenericApiResponse<Account>>(
    "/api/accounts"
  );

  return response;
}
// TODO find a way to specify the exact type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAccount(options?: any) {
  const queryOptions = Object.assign(options ?? {}, {
    queryKey: ["account"],
    queryFn: getAccount,
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
