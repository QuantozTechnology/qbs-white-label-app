// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Device } from "./devices.interface";

export const devicesMockResponse: GenericApiResponse<Device> = {
  value: {
    otpSeed: "4YPJBFPSZEV7IT2DMFRRYMBQ2FLG3WCU",
  },
};

export const devicesMocks = [
  rest.post(`${backendApiUrl}/api/customers/devices`, (_req, rest, ctx) => {
    return rest(
      ctx.status(200),
      ctx.json<typeof devicesMockResponse>(devicesMockResponse)
    );
  }),
];

export const deviceNotKnownApiResponse = rest.post(
  `${backendApiUrl}/api/customers/devices`,
  (_req, res, ctx) => {
    return res(ctx.status(409));
  }
);

export const devicesApiErrorResponse = rest.post(
  `${backendApiUrl}/api/customers/devices`,
  (_req, res, ctx) => {
    return res(ctx.status(400));
  }
);
