// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { mockPaymentsApi, paymentsApi } from "../../utils/axios";
import { TokenDetails, Tokens } from "./tokens.interface";
import { GenericApiResponse, PaginatedResponse } from "../utils/api.interface";
import { constructUrlWithParams } from "../../utils/api";

type GetTokenDetailsProps = {
  tokenCode: string;
};

type GetTokensProps = {
  pageParam: number;
  type?: "available" | "owned";
};

export async function getTokens({
  pageParam = 1,
  type,
}: Partial<GetTokensProps>): Promise<PaginatedResponse<Tokens[]>> {
  const url = constructUrlWithParams("api/tokens", {
    availability: type,
    page: pageParam,
    pageSize: 5,
  });

  const { data, headers } = await paymentsApi.get<GenericApiResponse<Tokens[]>>(
    url
  );
  const nextPage: string | null = JSON.parse(headers["x-pagination"]).NextPage;

  return { ...data, nextPage };
}

export function useTokens({ type }: Partial<GetTokensProps>) {
  return useInfiniteQuery(["tokens", type], () => getTokens({ type }), {
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    refetchInterval: 5000,
  });
}

// GET a single token details

async function getTokenDetails({ tokenCode }: GetTokenDetailsProps) {
  const { data } = await mockPaymentsApi.get<GenericApiResponse<TokenDetails>>(
    `/api/tokens/${tokenCode}`
  );

  return data;
}

export function useTokenDetails({ tokenCode }: GetTokenDetailsProps) {
  return useQuery({
    queryKey: ["token"],
    queryFn: () => getTokenDetails({ tokenCode }),
  });
}
