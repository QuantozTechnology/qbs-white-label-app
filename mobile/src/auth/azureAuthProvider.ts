// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import {
  AuthError,
  AuthorizeResponse,
  EndSessionRequest,
  EndSessionResponse,
  ExchangeRequest,
  IAsyncAuthProvider,
  IdToken,
  RefreshRequest,
  TokenResponse,
} from "./types";
import * as AuthSession from "expo-auth-session";
import axios from "axios";
import * as Linking from "expo-linking";
import { decode } from "./utils";
import Constants from "expo-constants";

/**
 * Default implementation using AzureB2C as identity provider.
 * @returns IAsyncAuthService
 */
export const azureAuthProvider = (): IAsyncAuthProvider => {
  /**
   * Prompt a user to login and obtain an authorization code
   */
  async function authorize(isSignUp: boolean): Promise<AuthorizeResponse> {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: Constants.expoConfig?.scheme,
        path: "authorize",
      });

      const issuerUrl = isSignUp
        ? Constants.expoConfig?.extra?.AUTH_AZURE_B2C_SIGNUP_ISSUER
        : Constants.expoConfig?.extra?.AUTH_AZURE_B2C_LOGIN_ISSUER;

      const discovery = await AuthSession.fetchDiscoveryAsync(issuerUrl);

      const nonce = await AuthSession.generateHexStringAsync(20);
      const state = await AuthSession.generateHexStringAsync(10);

      const config: AuthSession.AuthRequestConfig = {
        redirectUri: redirectUri,
        clientId: Constants.expoConfig?.extra?.AUTH_AZURE_B2C_CLIENT_ID,
        clientSecret: Constants.expoConfig?.extra?.AUTH_AZURE_B2C_CLIENT_SECRET,
        responseType: "code",
        scopes: [
          "offline_access",
          "openid",
          Constants.expoConfig?.extra?.AUTH_AZURE_B2C_SCOPE,
        ],
        usePKCE: true,
        state: state,
        extraParams: {
          nonce: nonce,
        },
        prompt: AuthSession.Prompt.Login,
      };

      const request = await AuthSession.loadAsync(config, discovery);
      const result = await request.promptAsync(discovery, {
        createTask: false,
      });

      if (!result) {
        return error(AuthErrorEnum.AUTH_INVALID_RESPONSE);
      }

      if (result.type !== "success") {
        let code: string = AuthErrorEnum.AUTH_INVALID_RESPONSE;
        if (result.type === "error") {
          if (result.error) {
            code = result.error.code;
          }
        } else if (result.type === "cancel") {
          code = AuthErrorEnum.AUTH_CANCELLED;
        } else if (result.type === "dismiss") {
          code = AuthErrorEnum.AUTH_DISMISSED;
        }
        return error(code);
      }

      if (result.params.state !== state) {
        return error(AuthErrorEnum.AUTH_INVALID_STATE);
      }

      const authCode = result.params.code;
      const codeVerifier = request.codeVerifier;

      if (!authCode || !codeVerifier) {
        return error(AuthErrorEnum.AUTH_INVALID_RESPONSE);
      }

      return {
        type: "success",
        authCode,
        codeVerifier,
        redirectUri,
        nonce,
        issuer: issuerUrl,
      };
    } catch (e: unknown) {
      if (e instanceof Error) {
        return error(e.message);
      }
      return error(AuthErrorEnum.UNHANDLED_ERROR);
    }
  }

  /**
   * Prompt a user to change their password
   */
  async function changePassword(): Promise<AuthorizeResponse> {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: Constants.expoConfig?.scheme,
        path: "authorize",
      });

      const discovery = await AuthSession.fetchDiscoveryAsync(
        Constants.expoConfig?.extra?.AUTH_AZURE_B2C_PASSWORD_ISSUER,
      );

      const nonce = await AuthSession.generateHexStringAsync(20);
      const state = await AuthSession.generateHexStringAsync(10);

      const config: AuthSession.AuthRequestConfig = {
        redirectUri: redirectUri,
        clientId: Constants.expoConfig?.extra?.AUTH_AZURE_B2C_CLIENT_ID,
        clientSecret: Constants.expoConfig?.extra?.AUTH_AZURE_B2C_CLIENT_SECRET,
        responseType: "code",
        scopes: [
          "offline_access",
          "openid",
          Constants.expoConfig?.extra?.AUTH_AZURE_B2C_SCOPE,
        ],
        usePKCE: true,
        state: state,
        extraParams: {
          nonce: nonce,
        },
        prompt: AuthSession.Prompt.Login,
      };

      const request = await AuthSession.loadAsync(config, discovery);
      const result = await request.promptAsync(discovery, {
        createTask: false,
      });

      if (!result) {
        return error(AuthErrorEnum.AUTH_INVALID_RESPONSE);
      }

      if (result.type !== "success") {
        let code: string = AuthErrorEnum.AUTH_INVALID_RESPONSE;
        if (result.type === "error") {
          if (result.error) {
            code = result.error.code;
          }
        } else if (result.type === "cancel") {
          code = AuthErrorEnum.AUTH_CANCELLED;
        } else if (result.type === "dismiss") {
          code = AuthErrorEnum.AUTH_DISMISSED;
        }
        return error(code);
      }

      if (result.params.state !== state) {
        return error(AuthErrorEnum.AUTH_INVALID_STATE);
      }

      const authCode = result.params.code;
      const codeVerifier = request.codeVerifier;

      if (!authCode || !codeVerifier) {
        return error(AuthErrorEnum.AUTH_INVALID_RESPONSE);
      }

      return {
        type: "success",
        authCode,
        codeVerifier,
        redirectUri,
        nonce,
        issuer: Constants.expoConfig?.extra?.AUTH_AZURE_B2C_PASSWORD_ISSUER,
      };
    } catch (e: unknown) {
      if (e instanceof Error) {
        return error(e.message);
      }
      return error(AuthErrorEnum.UNHANDLED_ERROR);
    }
  }

  /**
   * Exchange an authorization code for an access token
   * @param  {ExchangeRequest} request
   */
  async function exchange(request: ExchangeRequest): Promise<TokenResponse> {
    try {
      const discovery = await AuthSession.fetchDiscoveryAsync(request.issuer);

      const config: AuthSession.AccessTokenRequestConfig = {
        clientId: Constants.expoConfig?.extra?.AUTH_AZURE_B2C_CLIENT_ID,
        code: request.authCode,
        redirectUri: request.redirectUri,
      };

      if (request.codeVerifier) {
        config.extraParams = { code_verifier: request.codeVerifier };
      }

      const result = await AuthSession.exchangeCodeAsync(config, discovery);

      if (!result.idToken) {
        return error(AuthErrorEnum.EX_INVALID_RESPONSE);
      }

      if (request.nonce) {
        if (!validIdToken(request.nonce, result.idToken, request.issuer)) {
          return error(AuthErrorEnum.EX_INVALID_ID_TOKEN);
        }
      }

      return {
        type: "success",
        jwtAccessToken: result.accessToken,
        jwtIdToken: result.idToken,
        refreshToken: result.refreshToken,
      };
    } catch (e: unknown) {
      if (e instanceof Error) {
        return error(e.message);
      }
      return error(AuthErrorEnum.UNHANDLED_ERROR);
    }
  }

  /**
   * End the session and force the user to login again
   * @param  {EndSessionRequest} request
   */
  async function endSession(
    request: EndSessionRequest,
  ): Promise<EndSessionResponse> {
    try {
      const discovery = await AuthSession.fetchDiscoveryAsync(
        Constants.expoConfig?.extra?.AUTH_AZURE_B2C_LOGIN_ISSUER,
      );

      if (!discovery.endSessionEndpoint) {
        return error(AuthErrorEnum.END_SESSION_ENDPOINT_NOT_FOUND);
      }

      const logoutUrl = new URL(discovery.endSessionEndpoint);
      const redirectUri = Linking.createURL("/");
      logoutUrl.searchParams.append("post_logout_redirect_uri", redirectUri);
      logoutUrl.searchParams.append("id_token_hint", request.jwtIdToken);

      await axios.get(logoutUrl.toString());
      return { type: "success" };
    } catch (e: unknown) {
      if (e instanceof Error) {
        return error(e.message);
      }
      return error(AuthErrorEnum.UNHANDLED_ERROR);
    }
  }

  /**
   * Use a refresh token to refresh an expired access token
   * @param  {RefreshRequest} request
   */
  async function refresh(request: RefreshRequest): Promise<TokenResponse> {
    try {
      const discovery = await AuthSession.fetchDiscoveryAsync(
        Constants.expoConfig?.extra?.AUTH_AZURE_B2C_LOGIN_ISSUER,
      );
      const config: AuthSession.RefreshTokenRequestConfig = {
        clientId: Constants.expoConfig?.extra?.AUTH_AZURE_B2C_CLIENT_ID,
        refreshToken: request.jwtRefreshToken,
      };

      const result = await AuthSession.refreshAsync(config, discovery);

      if (!result.idToken) {
        return error(AuthErrorEnum.REFRESH_INVALID_RESPONSE);
      }

      if (request.nonce) {
        if (
          !validIdToken(
            request.nonce,
            result.idToken,
            Constants.expoConfig?.extra?.AUTH_AZURE_B2C_LOGIN_ISSUER,
          )
        ) {
          return error(AuthErrorEnum.REFRESH_INVALID_ID_TOKEN);
        }
      }

      return {
        type: "success",
        jwtAccessToken: result.accessToken,
        jwtIdToken: result.idToken,
        refreshToken: result.refreshToken,
      };
    } catch (e: unknown) {
      if (e instanceof Error) {
        return error(e.message);
      }
      return error(AuthErrorEnum.UNHANDLED_ERROR);
    }
  }

  return {
    authorize,
    exchange,
    endSession,
    refresh,
    changePassword,
  };
};

/**
 * Validate the idToken against nonce, issuer and audience.
 * Returns true if valid and false otherwise.
 * @param  {string} nonce
 * @param  {jwtIdToken} jwtIdToken
 */
function validIdToken(nonce: string, jwtIdToken: string, issuer: string) {
  const idToken = decode<IdToken>(jwtIdToken);
  return (
    idToken.nonce === nonce &&
    idToken.iss === issuer &&
    idToken.aud === Constants.expoConfig?.extra?.AUTH_AZURE_B2C_CLIENT_ID
  );
}

enum AuthErrorEnum {
  UNHANDLED_ERROR = "An error occured that could not be handled",
  AUTH_INVALID_RESPONSE =
  "Authorization prompt resulted in an invalid response",
  AUTH_INVALID_STATE = "Authorization redirect had invalid state parameter",
  AUTH_CANCELLED = "Authorization prompt was cancelled",
  AUTH_DISMISSED = "Authorization prompt was dismissed",
  END_SESSION_ENDPOINT_NOT_FOUND =
  "The end session endpoint was not found during discovery",
  EX_INVALID_ID_TOKEN = "The exchanged id token is invalid",
  EX_INVALID_RESPONSE = "Exchanging resulted in an invalid response",
  REFRESH_INVALID_ID_TOKEN = "The refreshed id token is invalid",
  REFRESH_INVALID_RESPONSE = "Refreshing resulted in an invalid response",
}

/**
 * Helper function to convert an enum or message to AuthError
 * @param  {AuthErrorEnum|string} code
 * @returns AuthError
 */
function error(code: AuthErrorEnum | string): AuthError {
  return { type: "error", errorMessage: code };
}
