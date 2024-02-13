// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { authStorageService } from "../auth/authStorageService";
import { AuthService } from "../auth/authService";
import * as SecureStore from "expo-secure-store";
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export const backendApiUrl = Constants.expoConfig?.extra?.API_URL;

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
  const authorizationHeader =
    paymentsApi.defaults.headers.common["Authorization"];

  const pubKeyFromStore = await SecureStore.getItemAsync("publicKey");
  const privKeyFromStore = await SecureStore.getItemAsync("privateKey");

  if (accessToken !== null || authorizationHeader == null) {
    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;

      if (pubKeyFromStore !== null && privKeyFromStore != null) {
        config.headers["x-public-key"] = pubKeyFromStore;

        const timestampInSeconds = Math.floor(Date.now() / 1000); // Convert current time to Unix timestamp in seconds

        const payload: {
          timestamp: number;
          postPayload?: unknown;
        } = {
          timestamp: timestampInSeconds,
        };

        // hash POST payload if available
        if (config.method === "post") {
          payload.postPayload = config.data;
        }

        const jsonPayload = JSON.stringify(payload);
        // base64 encode payload
        const base64Payload = Buffer.from(jsonPayload).toString("base64");

        config.headers["x-payload"] = base64Payload;

        // const buff = forge.util.createBuffer(signature).getBytes();
        const privKey = Buffer.from(privKeyFromStore, "base64");
        const privKeyHex = privKey.toString("hex");
        const messageBytes = Buffer.from(jsonPayload, "utf-8");
        const hash = ed.sign(Buffer.from(messageBytes), privKeyHex);

        // Encode the signature in Base64 format
        const base64Signature = Buffer.from(hash).toString("base64");
        config.headers["x-signature"] = base64Signature;
      }
    }
  }

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
