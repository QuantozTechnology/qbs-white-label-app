// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HttpResponse, http } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Device } from "./devices.interface";

export const devicesMockResponse: GenericApiResponse<Device> = {
  value: {
    otpSeed: "4YPJBFPSZEV7IT2DMFRRYMBQ2FLG3WCU",
  },
};

export const devicesMocks = [
  http.post(`${backendApiUrl}/api/customers/devices`, _ => {
    return HttpResponse.json(devicesMockResponse, { status: 200 });
  }),
];

export const deviceNotKnownApiResponse = http.post(
  `${backendApiUrl}/api/customers/devices`,
  _ => {
    return new Response(null, { status: 409 });
  }
);

export const devicesApiErrorResponse = http.post(
  `${backendApiUrl}/api/customers/devices`,
  _ => {
    return new Response(null, { status: 400 });
  }
);
