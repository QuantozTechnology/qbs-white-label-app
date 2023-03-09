// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";

export const merchantMocks = [
  rest.post(`${backendApiUrl}/api/customers/merchant`, (_req, rest, ctx) => {
    return rest(ctx.status(201));
  }),
];
