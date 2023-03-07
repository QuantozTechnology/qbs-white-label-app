import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Limits } from "./limits.interface";

async function getCustomerLimits() {
  const { data } = await paymentsApi.get<GenericApiResponse<Limits[]>>(
    `/api/customers/limits`
  );

  return data;
}

export function useCustomerLimits() {
  return useQuery({
    queryKey: ["limits"],
    queryFn: getCustomerLimits,
  });
}
