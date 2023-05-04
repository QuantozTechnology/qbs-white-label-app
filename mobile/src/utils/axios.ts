// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import axios from "axios";
import Constants from "expo-constants";
import { authStorageService } from "../auth/authStorageService";
import { AuthService } from "../auth/authService";

export const backendApiUrl = Constants.expoConfig?.extra?.API_URL;

export const mockApiUrl =
  "https://519450f7-7251-4594-97e4-e940683cb978.mock.pstmn.io";

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

paymentsApi.interceptors.request.use(async (config) => {
  const storage = authStorageService();
  const accessToken = await storage.getAccessToken();
  const authorizationHeader =
    paymentsApi.defaults.headers.common["Authorization"];

  if (accessToken !== null || authorizationHeader == null) {
    // If the token is valid, add it to the request header

    paymentsApi.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
    paymentsApi.defaults.headers.common["x-api-version"] = "1.0";

    if (config.headers) {
      // add it also to the current config
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      config.headers["x-api-version"] = "1.0";
    }
  }

  return config;
});

paymentsApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
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
);
