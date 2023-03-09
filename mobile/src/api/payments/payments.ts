// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AxiosResponse } from "axios";
import { paymentsApi } from "../../utils/axios";
import {
  CreatePaymentForAccount,
  CreatePaymentForPaymentRequest,
} from "./payments.interface";

export function createPaymentForPaymentRequest(
  payload: CreatePaymentForPaymentRequest
): Promise<AxiosResponse<unknown, CreatePaymentForPaymentRequest>> {
  return paymentsApi.post(
    "/api/transactions/payments/pay/paymentrequest",
    payload
  );
}

export function createPaymentForAccount(
  payload: CreatePaymentForAccount
): Promise<AxiosResponse<unknown, CreatePaymentForAccount>> {
  return paymentsApi.post("/api/transactions/payments/pay/account", payload, {
    headers: {
      "x-mock-response-code": 201,
    },
  });
}
