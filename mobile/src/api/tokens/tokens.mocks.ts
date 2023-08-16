// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { backendApiUrl, mockApiUrl } from "../../utils/axios";
import { GenericApiResponse, PaginatedResponse } from "../utils/api.interface";
import { TokenDetails, Tokens } from "./tokens.interface";

export const tokenDetailsDefaultMock: GenericApiResponse<TokenDetails> = {
  value: {
    code: "SILV",
    balance: "100.00",
    name: "Silver",
    status: "Active",
    created: 1691582675000,
    issuerAddress: "issuer-address",
    taxonomy: {
      taxonomySchemaCode: "47C03F19-F70",
      assetUrl: "https://test.com",
      taxonomyProperties: '{"Name":"Silver","Value":500}',
      hash: "B3A19E05041FB3A0CF36BF0538CE92B5E0120E313D58CD3E724A5FEE509FFE4E",
    },
    data: {
      AssetUrl: "www.test.com",
      ValidatorUrl: "www.test.com",
      OwnerUrl: "www.test.com",
    },
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
  rest.get(`${backendApiUrl}/api/tokens`, (_req, rest, ctx) => {
    return rest(
      ctx.status(200),
      ctx.set(
        "x-pagination",
        '{"TotalCount":5,"PageSize":10,"CurrentPage":1,"PreviousPage":null,"NextPage":null,"TotalPages":1}'
      ),
      ctx.json<PaginatedResponse<Tokens[]>>(tokensMock)
    );
  }),
];
