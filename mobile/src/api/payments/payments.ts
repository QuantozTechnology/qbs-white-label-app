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
