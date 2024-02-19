// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AxiosResponse } from "axios";
import { paymentsApi } from "../../utils/axios";
import { Device, DevicesPayload } from "./devices.interface";
import { GenericApiResponse } from "../utils/api.interface";
import { isNil } from "lodash";

export function verifyDevice(
  payload: DevicesPayload
): Promise<AxiosResponse<GenericApiResponse<Device>, DevicesPayload>> {
  const result = paymentsApi.post("/api/customers/devices", payload);
  // When we call this function for the first time, we won't get value.otpSeed in the response
  // The API response for first call is: {"_h": 0, "_i": 0, "_j": null, "_k": null}
  // Until we fix the API response, we need to return a fake empty response
  try {
    if (!isNil(result?.data?.value?.otpSeed)) {
      return result;
    }
  } catch (e) {
    console.log("error in verifyDevice", e);
  }

  const axiosEmptyResponse: AxiosResponse<
    GenericApiResponse<Device>,
    DevicesPayload
  > = {
    data: {
      value: {},
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {},
  };
  return Promise.resolve(axiosEmptyResponse);
}
