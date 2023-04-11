// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import {
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { paymentsApi } from "../../utils/axios";
import {
  CreatePaymentRequestPayload,
  PaymentRequestResponse,
  PaymentRequestResponseSchema,
  PaymentRequestsResponse,
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

// GET all payment requests for a customer

export async function getPaymentRequests({ pageParam = 1, type }) {
  const url =
    type != null
      ? `/api/paymentrequests?page=${pageParam}&pageSize=10&status=${type}`
      : `/api/paymentrequests?page=${pageParam}&pageSize=10`;

  const { data, headers } = await paymentsApi.get<PaymentRequestsResponse>(url);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nextPage = JSON.parse(headers["x-pagination"]!).NextPage;

  return { ...data, nextPage };
}

type UsePaymentRequestsProps = {
  type?: "open" | "expired";
};

export function usePaymentRequests({ type }: UsePaymentRequestsProps) {
  return useInfiniteQuery(
    ["paymentRequests", type],
    () => getPaymentRequests({ type }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage ?? undefined;
      },
      refetchInterval: 5000,
    }
  );
}

export async function cancelPaymentRequest(requestId: string) {
  const response = await paymentsApi.put(
    `/api/paymentrequests/${requestId}/cancel`
  );

  return response;
}
