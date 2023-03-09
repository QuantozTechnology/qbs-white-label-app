// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Account } from "./account.interface";

export const accountsMocks = [
  rest.post(`${backendApiUrl}/api/accounts`, (_req, rest, ctx) => {
    return rest(ctx.status(201));
  }),
  rest.get(`${backendApiUrl}/api/accounts`, (_req, rest, ctx) => {
    return rest(
      ctx.status(200),
      ctx.json<GenericApiResponse<Account>>({
        value: {
          accountCode: "test-account-code",
          publicAddress: "test-public-key",
        },
      })
    );
  }),
];
