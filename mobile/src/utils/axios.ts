// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { authStorageService } from "../auth/authStorageService";
import { AuthService } from "../auth/authService";
import * as SecureStore from "expo-secure-store";
import forge from "node-forge";

export const backendApiUrl = Constants.expoConfig?.extra?.API_URL;
//console.log("backendapi", backendApiUrl);

export const mockApiUrl = Constants.expoConfig?.extra?.POSTMAN_MOCK_API_URL;
export const mockPaymentsApi = axios.create({
  baseURL: mockApiUrl,
  headers: {
    // Postman mock headers
    "x-api-key": Constants.expoConfig?.extra?.POSTMAN_MOCK_API_KEY,
    "x-api-version": "1.0",
  },
});

export const paymentsApi = axios.create({
  baseURL: backendApiUrl,
  headers: {
    "x-api-version": "1.0",
  },
});

paymentsApi.interceptors.request.use(requestInterceptor);
paymentsApi.interceptors.response.use(
  responseInterceptor,
  responseInterceptorError
);

mockPaymentsApi.interceptors.request.use(requestInterceptor);
mockPaymentsApi.interceptors.response.use(
  responseInterceptor,
  responseInterceptorError
);

async function requestInterceptor(config: InternalAxiosRequestConfig) {
  const storage = authStorageService();
  const accessToken = await storage.getAccessToken();
  // const authorizationHeader =
  //   paymentsApi.defaults.headers.common["Authorization"];

  const pubKeyFromStore = await SecureStore.getItemAsync("publicKey");
  const privKeyFromStore = await SecureStore.getItemAsync("privateKey");

  if (accessToken !== null) {
    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;

      //console.log(accessToken, "access_token");

      if (pubKeyFromStore !== null && privKeyFromStore != null) {
        config.headers["x-public-key"] = forge.util.encode64(pubKeyFromStore);

        // console.log(forge.util.encode64(pubKeyFromStore), "public token");

        const timestampInSeconds = Math.floor(Date.now() / 1000); // Convert current time to Unix timestamp in seconds
        //timestampInSeconds = Math.floor(timestampInSeconds / 30) * 30; // Round to the nearest 30 seconds

        const payload: {
          // publicKey: string;
          timestamp: number;
          postPayload?: unknown;
        } = {
          // publicKey: pubKeyFromStore,
          timestamp: timestampInSeconds,
        };
        //console.log(timestampInSeconds, "timestamp");
        // hash POST payload if available

        if (config.method === "post") {
          // console.log(config.data);
          payload.postPayload = config.data;
          // console.log("postpayload", payload);
        }

        // console.log("METHOD", config.method);
        config.headers["x-payload"] = forge.util.encode64(
          JSON.stringify(payload)
        );

        // console.log(config.headers["x-payload"], "payload");

        // create hash and sign it
        const privateKey = forge.pki.privateKeyFromPem(privKeyFromStore);
        const md = forge.md.sha256.create();
        md.update(JSON.stringify(payload), "utf8");

        const signature = privateKey.sign(md);

        // Encode the signature in Base64 format
        const base64Signature = forge.util.encode64(signature);
        // console.log("base64Signature", base64Signature);
        config.headers["x-signature"] = base64Signature;
      }
    }
  }
  // console.log("CONFIG", config.headers);

  return config;
}

async function responseInterceptor(response: AxiosResponse) {
  return response;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function responseInterceptorError(error: any) {
  const originalRequest = error.config;

  if (error.response.status === 401) {
    const result = await AuthService().refresh();
    if (result.type === "error") {
      await AuthService().logout();
    }
    return paymentsApi(originalRequest);
  } else {
    return Promise.reject(error);
  }
}
