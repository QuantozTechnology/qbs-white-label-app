// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import {
  IAsyncAuthService,
  AuthError,
  IdToken,
  ExchangeRequest,
  TokenResponse,
  Token,
  VoidResponse,
  Success,
  UserSessionResponse,
} from "./types";
import { azureAuthProvider } from "./azureAuthProvider";
import { authStorageService } from "./authStorageService";
import { decode, isExpired } from "./utils";

const auth = azureAuthProvider();
const storage = authStorageService();

/**
 * Default implementation using AzureB2C as identity provider.
 * @returns IAsyncAuthService
 */
export const AuthService = (): IAsyncAuthService => {
  async function login(): Promise<VoidResponse> {
    // prompt the user to login and obtain authorization code
    const authResponse = await auth.authorize(false);

    if (authResponse.type === "error") {
      return error(authResponse.errorMessage);
    }

    // exchange authorization code for access token
    const exchangeRequest: ExchangeRequest = {
      authCode: authResponse.authCode,
      codeVerifier: authResponse.codeVerifier,
      redirectUri: authResponse.redirectUri,
      nonce: authResponse.nonce,
      issuer: authResponse.issuer,
    };

    const tokenResponse = await auth.exchange(exchangeRequest);

    if (tokenResponse.type === "error") {
      return error(tokenResponse.errorMessage);
    }

    await storeTokens(tokenResponse);
    return success();
  }

  async function signup(): Promise<VoidResponse> {
    // prompt the user to login and obtain authorization code
    const authResponse = await auth.authorize(true);

    if (authResponse.type === "error") {
      return error(authResponse.errorMessage);
    }

    // exchange authorization code for access token
    const exchangeRequest: ExchangeRequest = {
      authCode: authResponse.authCode,
      codeVerifier: authResponse.codeVerifier,
      redirectUri: authResponse.redirectUri,
      nonce: authResponse.nonce,
      issuer: authResponse.issuer,
    };

    const tokenResponse = await auth.exchange(exchangeRequest);

    if (tokenResponse.type === "error") {
      return error(tokenResponse.errorMessage);
    }

    await storeTokens(tokenResponse);
    return success();
  }

  async function changePassword(): Promise<VoidResponse> {
    // prompt the user to login and obtain authorization code
    const authResponse = await auth.changePassword();

    if (authResponse.type === "error") {
      return error(authResponse.errorMessage);
    }

    // exchange authorization code for access token
    const exchangeRequest: ExchangeRequest = {
      authCode: authResponse.authCode,
      codeVerifier: authResponse.codeVerifier,
      redirectUri: authResponse.redirectUri,
      nonce: authResponse.nonce,
      issuer: authResponse.issuer,
    };

    const tokenResponse = await auth.exchange(exchangeRequest);

    if (tokenResponse.type === "error") {
      return error(tokenResponse.errorMessage);
    }

    await storeTokens(tokenResponse);
    return success();
  }

  async function logout(): Promise<VoidResponse> {
    const jwtIdToken = await storage.getIdToken();

    if (!jwtIdToken) {
      return error("An error occured while logging you out");
    }

    await auth.endSession({ jwtIdToken });
    await storage.clearAll();
    return success();
  }

  async function refresh(): Promise<VoidResponse> {
    const jwtIdToken = await storage.getIdToken();
    const jwtAccessToken = await storage.getAccessToken();

    if (jwtIdToken && jwtAccessToken) {
      const idToken = decode<IdToken>(jwtIdToken);
      const accessToken = decode<Token>(jwtAccessToken);

      // only refresh if one of the tokens is expired
      if (isExpired(idToken) || isExpired(accessToken)) {
        const jwtRefreshToken = await storage.getRefreshToken();

        if (!jwtRefreshToken) {
          return login();
        } else {
          const nonce = await storage.getTokenNonce();

          const tokenResponse = await auth.refresh({
            jwtRefreshToken,
            nonce,
          });

          // If an error occurs the user needs to login again
          if (tokenResponse.type === "error") {
            return tokenResponse;
          }

          await storeTokens(tokenResponse);
        }
      }
    }

    // If we get here the tokens are either valid, the user was prompted to login
    // or the access and id token were refreshed using the refresh token
    return success();
  }

  async function getUserSession(): Promise<UserSessionResponse> {
    const jwtIdToken = await storage.getIdToken();

    if (!jwtIdToken) {
      return error("An error occured getting the user session");
    }

    const idToken = decode<IdToken>(jwtIdToken);

    return {
      type: "success",
      userSession: {
        isNew: idToken.newUser ?? false,
        objectId: idToken.oid,
        email: idToken.email,
        phone: idToken.phoneNumber,
      },
    };
  }

  return {
    login,
    signup,
    changePassword,
    logout,
    refresh,
    getUserSession,
  };
};

/**
 * Helper function to convert an enum or message to AuthError
 * @param  {string} code
 * @returns AuthError
 */
function error(code: string): AuthError {
  return { type: "error", errorMessage: code };
}

/**
 * Helper function to return success
 * @returns Success
 */
function success(): Success {
  return { type: "success" };
}

/**
 * Add the access and id token to the storage. If they exist,
 * the refresh token is added too
 * @param tokenResponse
 */
async function storeTokens(tokenResponse: TokenResponse) {
  if (tokenResponse.type === "success") {
    await storage.setAccessToken(tokenResponse.jwtAccessToken);
    await storage.setIdToken(tokenResponse.jwtIdToken);

    if (tokenResponse.refreshToken) {
      await storage.setRefreshToken(tokenResponse.refreshToken);
    }
  }
}
