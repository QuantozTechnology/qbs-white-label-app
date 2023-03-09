// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
