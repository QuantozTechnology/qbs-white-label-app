import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { paymentsApi } from "../../utils/axios";
import { APIError } from "../generic/error.interface";
import { GenericApiResponse } from "../utils/api.interface";
import { Customer, ICreateCustomer } from "./customer.interface";

export async function getCustomer() {
  const response = await paymentsApi.get<GenericApiResponse<Customer>>(
    "/api/customers"
  );

  return response;
}

// TODO find a way to specify the exact type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCustomer(options?: any) {
  const queryOptions = Object.assign(options ?? {}, {
    queryKey: ["customer"],
    queryFn: getCustomer,
  });

  return useQuery<
    AxiosResponse<GenericApiResponse<Customer>>,
    AxiosError<APIError>
  >(queryOptions);
}

export function createCustomer(
  payload: ICreateCustomer
): Promise<AxiosResponse<unknown, ICreateCustomer>> {
  return paymentsApi.post("/api/customers", payload);
}
