import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Balances } from "./balances.interface";

async function getBalances() {
  const { data } = await paymentsApi.get<GenericApiResponse<Balances[]>>(
    "/api/accounts/balances"
  );

  return data;
}

export function useBalances() {
  return useQuery({
    queryKey: ["balances"],
    queryFn: getBalances,
    refetchInterval: 5000,
  });
}
