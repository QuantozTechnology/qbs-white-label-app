// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { mockPaymentsApi } from "../../utils/axios";
import { TokenDetails, Tokens } from "./tokens.interface";
import { GenericApiResponse } from "../utils/api.interface";

type GetTokenProps = {
  tokenCode: string;
};

// GET available tokens

export async function getAvailableTokens({ pageParam = 1 }) {
  const { data, headers } = await mockPaymentsApi.get<
    GenericApiResponse<Tokens[]>
  >(`/api/tokens/available?page=${pageParam}&pageSize=10`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nextPage = JSON.parse(headers["x-pagination"]!).NextPage;
  return { ...data, nextPage };
}

export function useAvailableTokens() {
  return useInfiniteQuery(["available_tokens"], getAvailableTokens, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    refetchInterval: 5000,
  });
}

// GET owned tokens

export async function getOwnedTokens({ pageParam = 1 }) {
  const { data, headers } = await mockPaymentsApi.get<
    GenericApiResponse<Tokens[]>
  >(`/api/tokens/owned?page=${pageParam}&pageSize=1`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nextPage = JSON.parse(headers["x-pagination"]!).NextPage;
  return { ...data, nextPage };
}

export function useOwnedTokens() {
  return useInfiniteQuery(["owned_tokens"], getOwnedTokens, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
  });
}

// GET a single token details

async function getTokenDetails({ tokenCode }: GetTokenProps) {
  const { data } = await mockPaymentsApi.get<GenericApiResponse<TokenDetails>>(
    `/api/tokens/${tokenCode}`
  );

  return data;
}

export function useTokenDetails({ tokenCode }: GetTokenProps) {
  return useQuery({
    queryKey: ["token"],
    queryFn: () => getTokenDetails({ tokenCode }),
  });
}
