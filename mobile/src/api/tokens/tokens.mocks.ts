// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { mockApiUrl } from "../../utils/axios";
import { GenericApiResponse, PaginatedResponse } from "../utils/api.interface";
import { TokenDetails, Tokens } from "./tokens.interface";

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
  rest.get(`${mockApiUrl}/api/tokens/:tokenCode`, (_req, rest, ctx) => {
    return rest(
      ctx.status(200),
      ctx.json<GenericApiResponse<TokenDetails>>(tokenDetailsDefaultMock)
    );
  }),
];

// Available tokens mocks

export const tokensMock: PaginatedResponse<Tokens[]> = {
  nextPage: null,
  value: [
    {
      code: "COPR",
      name: "Copper",
      issuerAddress: "0xabcdefghijkmnop",
      balance: null,
      status: "Active",
    },
    {
      code: "DIAMOND",
      name: "Diamond",
      issuerAddress: "GTHUYTRE232324",
      balance: null,
      status: "Active",
    },
  ],
};

export const tokenMocks = [
  rest.get(`${mockApiUrl}/api/tokens`, (_req, rest, ctx) => {
    return rest(
      ctx.status(200),
      ctx.json<PaginatedResponse<Tokens[]>>(tokensMock)
    );
  }),
];
