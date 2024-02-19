// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { http, HttpResponse } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Account } from "./account.interface";

export const accountsMocks = [
  http.post(`${backendApiUrl}/api/accounts`, _ => {
    return new Response(null, { status: 201 })
  }),
  http.get(`${backendApiUrl}/api/accounts`, _ => {
    return HttpResponse.json<GenericApiResponse<Account>>({
      value: {
        accountCode: "test-account-code",
        publicAddress: "test-public-key",
      }
    }, { status: 200 })
  }),
];
