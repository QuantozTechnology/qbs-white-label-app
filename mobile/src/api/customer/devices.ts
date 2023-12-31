// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AxiosResponse } from "axios";
import { paymentsApi } from "../../utils/axios";
import { Device, DevicesPayload } from "./devices.interface";
import { GenericApiResponse } from "../utils/api.interface";

export function verifyDevice(
  payload: DevicesPayload
): Promise<AxiosResponse<GenericApiResponse<Device>, DevicesPayload>> {
  return paymentsApi.post("/api/customers/devices", payload);
}
