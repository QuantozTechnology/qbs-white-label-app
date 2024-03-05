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
import { fromByteArray, toByteArray } from "react-native-quick-base64";
import { Buffer } from "buffer";
import { isNil } from "lodash";

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
  const oid = await SecureStore.getItemAsync("oid");
  const storage = authStorageService();
  let accessToken = await storage.getAccessToken();
  if (isNil(accessToken)) {
    // refresh token
    const result = await AuthService().refresh();
    if (result.type !== "error") {
      accessToken = await authStorageService().getAccessToken();
    }
  }

  const deviceRegistered = await SecureStore.getItemAsync(
    oid + "_deviceRegistered"
  );
  const pubKeyFromStore = await SecureStore.getItemAsync(oid + "_publicKey");
  const privKeyFromStore = await SecureStore.getItemAsync(oid + "_privateKey");
  if (
    !isNil(accessToken) &&
    !isNil(pubKeyFromStore) &&
    !isNil(privKeyFromStore) &&
    !isNil(deviceRegistered)
  ) {
    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const sigData = getSignatureHeaders(
      new Date(),
      config.data,
      privKeyFromStore
    );
    config.headers["x-public-key"] = pubKeyFromStore;
    config.headers["x-timestamp"] = sigData.timestamp;
    config.headers["x-signature"] = sigData.signature;
    config.headers["x-algorithm"] = "ED25519";
  }
  return config;
}

// the date is supplied as a parameter to allow for testing
// there were various issues with trying to mock it directly
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSignatureHeaders(
  date: Date,
  data: unknown,
  privKeyFromStore: string
) {
  const timestampInSeconds = Math.floor(date.getTime() / 1000).toString(); // Convert current time to Unix timestamp in seconds
  const dataToSign = data
    ? timestampInSeconds + JSON.stringify(data)
    : timestampInSeconds;
  const bytesToSign = Buffer.from(dataToSign, "utf-8");

  const privKey = toByteArray(privKeyFromStore);
  const privKeyHex = ed.etc.bytesToHex(privKey);

  const hash = ed.sign(bytesToSign, privKeyHex);

  // Encode the signature in Base64 format
  const base64Signature = fromByteArray(hash);

  return {
    timestamp: timestampInSeconds,
    signature: base64Signature,
  };
}

async function responseInterceptor(response: AxiosResponse) {
  return response;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function responseInterceptorError(error: any) {
  const originalRequest = error.config;

  // Check if we've already tried to retry the request
  if (!originalRequest._retryCount) originalRequest._retryCount = 0;
  if (originalRequest._retryCount > 2) {
    // Stop retrying after 3 attempts
    return Promise.reject(error);
  }

  if (error.response.status === 401) {
    originalRequest._retryCount += 1; // Increment the retry count

    try {
      // Attempt to refresh the token
      const result = await AuthService().refresh();
      if (result.type === "error") {
        // If refreshing fails, logout and reject the promise
        await AuthService().logout();
        return Promise.reject(error);
      }

      // fetch the new token
      const newToken = await authStorageService().getAccessToken();

      // Update the authorization header with the new token
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

      // Retry the original request with the updated token
      return paymentsApi(originalRequest);
    } catch (refreshError) {
      // If there's an error refreshing the token, log out and reject the promise
      await AuthService().logout();
      return Promise.reject(error);
    }
  }

  // For all other errors, just reject the promise
  return Promise.reject(error);
}
