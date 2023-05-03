// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { mockApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { TokenDetails } from "./tokens.interface";

export const tokenDetailsDefaultMock: GenericApiResponse<TokenDetails> = {
  value: {
    tokenCode: "SCEUR",
    asset: "https://www.example.com",
    owner: "https://www.example.com",
    validator: "https://www.example.com",
    schema: "https://www.example.com",
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
