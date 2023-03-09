// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Customer } from "./customer.interface";

export const customerMocksDefaultResponse: GenericApiResponse<Customer> = {
  value: {
    reference: "test-reference",
    email: "jd@q.c",
    status: "ACTIVE",
    trustLevel: "Tier1",
    currencyCode: "EUR",
    bankAccountNumber: null,
    data: {
      FirstName: "John",
      LastName: "Doe",
      DateOfBirth: "2000-05-27T00:00:00.000",
      CountryOfResidence: "Netherlands",
      Phone: "+31625498562",
    },
    isBusiness: false,
  },
};

export const customerMocks = [
  rest.get(`${backendApiUrl}/api/customers`, (_req, rest, ctx) => {
    return rest(
      ctx.status(200),
      ctx.json<GenericApiResponse<Customer>>(customerMocksDefaultResponse)
    );
  }),
  rest.post(`${backendApiUrl}/api/customers`, (_req, rest, ctx) => {
    return rest(ctx.status(201));
  }),
];
