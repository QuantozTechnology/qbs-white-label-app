// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0
import { useQuery } from "@tanstack/react-query";
import { mockPaymentsApi } from "../../utils/axios";
import {
  TokenDetails,
} from "./tokens.interface";
import { GenericApiResponse } from "../utils/api.interface";

type GetTokenProps = {
  tokenCode: string;
}

async function getToken({tokenCode}: GetTokenProps) {
  const { data } = await mockPaymentsApi.get<GenericApiResponse<TokenDetails>>(
    `/api/tokens/${tokenCode}`
  );

  return data;
}

export function useToken({tokenCode}: GetTokenProps) {
  return useQuery({
    queryKey: ["token"],
    queryFn: () => getToken({tokenCode}),
  });
}
