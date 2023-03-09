// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paymentsApi } from "../../utils/axios";
import {
  CreatePaymentRequestPayload,
  PaymentRequestResponse,
  PaymentRequestResponseSchema,
} from "./paymentRequest.interface";

export async function createPaymentRequest(
  payload: CreatePaymentRequestPayload
) {
  const { data } = await paymentsApi.post("/api/paymentrequests", payload);

  return PaymentRequestResponseSchema.parse(data);
}

// GET payment request

export async function getPaymentRequest(requestId: string | undefined) {
  const { data } = await paymentsApi.get(`/api/paymentrequests/${requestId}`);

  return PaymentRequestResponseSchema.parse(data);
}

export function usePaymentRequest(
  requestId: string | undefined,
  options?: UseQueryOptions<PaymentRequestResponse>
) {
  const queryOptions: UseQueryOptions<PaymentRequestResponse> = Object.assign(
    options ?? {},
    {
      queryKey: ["paymentRequest", requestId],
      queryFn: () => getPaymentRequest(requestId),
      enabled: requestId != null,
    }
  );

  return useQuery(queryOptions);
}
