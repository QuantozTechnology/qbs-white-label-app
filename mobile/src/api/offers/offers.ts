// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { mockPaymentsApi, paymentsApi } from "../../utils/axios";
import { CreateOfferPayload, Offers } from "./offers.interface";

export function createOffer(
  payload: CreateOfferPayload
): Promise<AxiosResponse<unknown, CreateOfferPayload>> {
  return paymentsApi.post("/api/offers", payload);
}

// GET offers

export async function getOffers({ type, pageParam = 1 }: useOffersProps) {
  const { data, headers } = await mockPaymentsApi.get<Offers>(
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
