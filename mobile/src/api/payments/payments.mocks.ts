// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";

export const paymentsMocks = [
  rest.post(
    `${backendApiUrl}/api/transactions/payments/pay/paymentrequest`,
    (_req, rest, ctx) => {
      return rest(ctx.status(201));
    }
  ),
  rest.post(
    `${backendApiUrl}/api/transactions/payments/pay/account`,
    (_req, rest, ctx) => {
      return rest(ctx.status(201));
    }
  ),
];
