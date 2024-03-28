// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../../utils/axios";
import { ICreateCustomer } from "./customer.interface";
import * as SecureStore from "expo-secure-store";

export async function getCustomer(): Promise<any> {
  // Since API response is inconsistent, we are not able to specify the exact type
  const response = await paymentsApi.get("/api/customers");
  return response;
}

export function useCustomer(options?: any) {
  const queryOptions = Object.assign(
    {
      queryKey: ["customer"],
      queryFn: getCustomer,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    options ?? {}
  );

  return useQuery(queryOptions);
}

export async function createCustomer(payload: ICreateCustomer) {
  const customerResult = await paymentsApi.post("/api/customers", payload);
  if (customerResult) {
    const accountResult = await paymentsApi.post("/api/accounts");
    if (accountResult) {
      const oid = await SecureStore.getItemAsync("oid");
      await SecureStore.setItemAsync(oid + "RegistrationCompleted", "true");
      return true;
    } else {
      const oid = await SecureStore.getItemAsync("oid");
      await SecureStore.deleteItemAsync(oid + "RegistrationCompleted");
      return false;
    }
  } else {
    return false;
  }
}
