// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HttpResponse, http } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Limits } from "./limits.interface";

export const defaultLimitsMockResponse: GenericApiResponse<Limits[]> = {
  value: [
    {
      tokenCode: "SCEUR",
      funding: {
        limit: {
          monthly: "500",
        },
        used: {
          monthly: "100",
        },
      },
      withdraw: {
        limit: {
          monthly: "100",
        },
        used: {
          monthly: "20",
        },
      },
    },
  ],
};

export const limitsMocks = [
  http.get(`${backendApiUrl}/api/customers/limits`, _ => {
    return HttpResponse.json(defaultLimitsMockResponse, { status: 200 });
  }),
];
