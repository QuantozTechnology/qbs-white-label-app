// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AxiosResponse } from "axios";
import { mockPaymentsApi } from "../../utils/axios";
import { CreateOfferPayload } from "./offers.interface";

export function createOffer(
  payload: CreateOfferPayload
): Promise<AxiosResponse<unknown, CreateOfferPayload>> {
  return mockPaymentsApi.post("/api/offers", payload, {
    headers: {
      "x-mock-response-code": 201,
    },
  });
}
