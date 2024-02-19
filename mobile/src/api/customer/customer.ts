// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../../utils/axios";
import { ICreateCustomer } from "./customer.interface";

export async function getCustomer(): Promise<any> {
  // Since API response is inconsistent, we are not able to specify the exact type
  const response = await paymentsApi.get("/api/customers");
  return response;
}

export function useCustomer(options?: any) {
  const queryOptions = Object.assign(options ?? {}, {
    queryKey: ["customer"],
    queryFn: getCustomer,
  });

  return useQuery(queryOptions);
}

export function createCustomer(payload: ICreateCustomer) {
  const result = paymentsApi.post("/api/customers", payload);
  return result;
}
