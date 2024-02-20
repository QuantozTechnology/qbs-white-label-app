// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HttpResponse, http } from "msw";
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
      IdBack: "https://example.com/id-back",
      IdFront: "https://example.com/id-front",
      Selfie: "https://example.com/selfie"
    },
    isBusiness: false,
  },
};

export const customerMocks = [
  http.get(`${backendApiUrl}/api/customers`, _ => {
    return HttpResponse.json<GenericApiResponse<Customer>>(customerMocksDefaultResponse, { status: 200 });
  }),
  http.post(`${backendApiUrl}/api/customers`, _ => {
    return new Response(null, { status: 201 });
  }),
];
