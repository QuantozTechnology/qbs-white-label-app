// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AxiosResponse } from "axios";
import { paymentsApi } from "../../utils/axios";

export type ICreateMerchant = {
  companyName: string;
  contactPersonFullName: string;
  email: string;
  countryOfRegistration: string;
};

export function createMerchant(
  payload: ICreateMerchant
): Promise<AxiosResponse<unknown, ICreateMerchant>> {
  return paymentsApi.post("/api/customers/merchant", payload);
}
