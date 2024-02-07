// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HttpResponse, http } from "msw";
import { mockApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { TokenDetails } from "./tokens.interface";

export const tokenDetailsDefaultMock: GenericApiResponse<TokenDetails> = {
  value: {
    tokenCode: "SCEUR",
    assetUrl: "https://www.example.com",
    issuerUrl: "https://www.example.com",
    validatorUrl: "https://www.example.com",
    schemaUrl: "https://www.example.com",
  },
};

export const tokenDetailsMocks = [
  http.get(`${mockApiUrl}/api/tokens/:tokenCode`, _ => {
    return HttpResponse.json(tokenDetailsDefaultMock, { status: 200 });
  }),
];
