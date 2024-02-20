// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HttpResponse, http } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Tiers } from "./trustlevels.interface";

const defaultTrustlevelsResponse: GenericApiResponse<Tiers> = {
  value: {
    Tier1: {
      name: "Tier1",
      description: "description tier 1",
      limits: {
        funding: {
          monthly: 100,
        },
        withdraw: {
          monthly: 50,
        },
      },
    },
    Tier2: {
      name: "Tier2",
      description: "tier 2 description",
      limits: {
        funding: {
          monthly: 500,
        },
        withdraw: {
          monthly: 200,
        },
      },
    },
    Tier3: {
      name: "Tier3",
      description: "tier 3 description",
      limits: {
        funding: {
          monthly: 1000,
        },
        withdraw: {
          monthly: 500,
        },
      },
    },
  },
};

export const trustlevelsMocks = [
  http.get(`${backendApiUrl}/api/trustlevels`, _ => {
    return HttpResponse.json(defaultTrustlevelsResponse, { status: 200 });
  }),
];
