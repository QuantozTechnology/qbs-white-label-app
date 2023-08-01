// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { mockPaymentsApi, paymentsApi } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { CreateOfferPayload, Offer, Offers } from "./offers.interface";

// POST create offer
export function createOffer(
  payload: CreateOfferPayload
): Promise<AxiosResponse<unknown, CreateOfferPayload>> {
  return paymentsApi.post("/api/offers", payload);
}

// GET single offer
type GetOfferProps = {
  offerCode: string;
};

async function getOffer({ offerCode }: GetOfferProps) {
  const { data } = await paymentsApi.get<GenericApiResponse<Offer>>(
    `/api/offers/${offerCode}`
  );

  return data;
}

export function useOffer({ offerCode }: GetOfferProps) {
  return useQuery({
    queryKey: ["offer", offerCode],
    queryFn: () => getOffer({ offerCode }),
  });
}

// GET offers
export async function getOffers({ type, pageParam = 1 }: useOffersProps) {
  const { data, headers } = await paymentsApi.get<Offers>(
    `/api/offers?offerStatus=${type}&page=${pageParam}&pageSize=10`
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nextPage = JSON.parse(headers["x-pagination"]!).NextPage;
  return { ...data, nextPage };
}

type useOffersProps = {
  type: "Open" | "Closed";
  pageParam?: number;
};

export function useOffers({ type }: useOffersProps) {
  return useInfiniteQuery(["offers", type], () => getOffers({ type }), {
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    refetchInterval: 5000,
  });
}

// Cancel an offer
export function cancelOffer(offerCode: string): Promise<AxiosResponse> {
  return mockPaymentsApi.put(`/api/offers/${offerCode}/cancel`, null, {
    headers: {
      "x-mock-response-code": 201,
    },
  });
}

// POST confirm offer
type ConfirmOfferPayload = {
  amount: string;
  offerCode: string;
};

export function confirmOffer(
  payload: ConfirmOfferPayload
): Promise<AxiosResponse<unknown, ConfirmOfferPayload>> {
  return mockPaymentsApi.post("/api/offers/confirm", payload, {
    headers: {
      "x-mock-response-code": 201,
    },
  });
}
