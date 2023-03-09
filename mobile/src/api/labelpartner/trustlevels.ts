// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Tiers } from "./trustlevels.interface";

async function getTrustlevels() {
  const { data } = await paymentsApi.get<GenericApiResponse<Tiers>>(
    "/api/trustlevels",
    {
      headers: {
        "x-mock-response-code": 200,
      },
    }
  );

  return data;
}

export function useTrustLevels() {
  return useQuery({
    queryKey: ["trustlevels"],
    queryFn: getTrustlevels,
  });
}
