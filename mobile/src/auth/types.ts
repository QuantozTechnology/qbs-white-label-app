// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

export interface IAsyncAuthProvider {
  /**
   * Prompt a user to login and obtain an authorization code
   */
  authorize: (isSignUp: boolean) => Promise<AuthorizeResponse>;
  /**
   * Prompt a user to change password
   */
  changePassword: () => Promise<AuthorizeResponse>;
  /**
   * Exchange an authorization code for an access token
   * @param  {ExchangeRequest} request
   */
  exchange: (request: ExchangeRequest) => Promise<TokenResponse>;
  /**
   * End the session and force the user to login again
   * @param  {EndSessionRequest} request
   */
  endSession: (request: EndSessionRequest) => Promise<EndSessionResponse>;
  /**
   * Use a refresh token to refresh an expired access token
   * @param  {RefreshRequest} request
   */
  refresh: (request: RefreshRequest) => Promise<TokenResponse>;
}

export interface IAsyncAuthService {
  /**
   * Prompt a user to login and store all relevant tokens
   */
  login: () => Promise<VoidResponse>;

  /**
   * Prompt a user to register and store all relevant tokens
   */
  signup: () => Promise<VoidResponse>;
  /**
   * Prompt user logout and clear all relevant tokens
   */
  logout: () => Promise<VoidResponse>;
  /**
   * Prompt a user to change their password and re-store all tokens
   */
  changePassword: () => Promise<VoidResponse>;
  /**
   * Refresh the access token using the refresh token and re-store all tokens
   */
  refresh: () => Promise<VoidResponse>;
  /**
   * Get a new user session based on the id token
   */
  getUserSession: () => Promise<UserSessionResponse>;
}

export interface IAsyncAuthStorageService {
  /**
   * Get the access token from storage
   * Returns null if it does not exist
   */
  getAccessToken: () => Promise<Maybe<string>>;
  /**
   * Get the id token from storage
   * Returns null if it does not exist
   */
  getIdToken: () => Promise<Maybe<string>>;
  /**
   * Get the refresh token from storage
   * Returns null if it does not exist
   */
  getRefreshToken: () => Promise<Maybe<string>>;
  /**
   * Get the token nonce from storage
   * Returns null if it does not exist
   */
  getTokenNonce: () => Promise<Maybe<string>>;
  /**
   * Set the access token in storage
   * @param  {string} accessToken
   */
  setAccessToken: (accessToken: string) => Promise<void>;
  /**
   * Set the id token in storage
   * @param  {string} idToken
   */
  setIdToken: (idToken: string) => Promise<void>;
  /**
   * Set the refresh token in storage
   * @param  {string} refreshToken
   */
  setRefreshToken: (refreshToken: string) => Promise<void>;
  /**
   * Set the token nonce in storage
   * @param  {string} nonce
   */
  setTokenNonce: (refreshToken: string) => Promise<void>;
  /**
   * Clear access, refresh and id token from storage
   */
  clearAll: () => Promise<void>;
}

export interface Token {
  exp: number; // in seconds since Unix epoch the token will expire
  nonce: string | null; // unique nonce of the token provided during authorization
  iss: string; // issuer of this token
  aud: string; // audience of the token
}

export interface IdToken extends Token {
  newUser: boolean | null; // true if the user registered
  email: string;
  phoneNumber: string;
  oid: string; // unique id of the user,
}

export type Maybe<T> = T | null;

export type RefreshRequest = {
  jwtRefreshToken: string;
  nonce?: string | null;
};

export type EndSessionRequest = {
  jwtIdToken: string; // id token to identify the user
};

export type EndSessionResponse = AuthError | Success;

export type AuthorizeResponse =
  | AuthError
  | (Success & {
      authCode: string;
      codeVerifier: string | null; // code verifier used for PCKE
      redirectUri: string;
      nonce: string | null; // nonce used in authorization request used to verify token
      issuer: string;
    });

export type ExchangeRequest = {
  authCode: string;
  codeVerifier: string | null; // code verifier used for PCKE
  redirectUri: string; // redirect uri used during authorization
  nonce: string | null; // nonce used in authorization request used to verify token
  issuer: string;
};

export type TokenResponse =
  | AuthError
  | (Success & {
      jwtAccessToken: string;
      jwtIdToken: string;
      refreshToken?: string;
    });

export type VoidResponse = AuthError | Success;

export type UserSessionResponse =
  | AuthError
  | (Success & { userSession: UserSession });

export type AuthError = { type: "error"; errorMessage: string };
export type Success = { type: "success" };

export type UserSession = {
  email: string;
  phone: string;
  isNew: boolean;
  objectId: string;
};

export type AuthContextType = {
  login: () => Promise<void>;
  signup: () => Promise<void>;
  logout: () => Promise<void>;
  changePassword: () => Promise<void>;
  userSession: UserSession | null;
  error: string | null;
  isLoading: boolean;
};

export type AuthState = {
  userSession: UserSession | null;
  isLoading: boolean;
  error: string | null;
};

export enum AuthActionType {
  INIT = "init",
  SET_USER_SESSION = "set_user_session",
  CHANGE_PASSWORD_SUCCESS = "change_password_success",
  CLEAR_USER_SESSION = "clear_user_session",
  ERROR = "error",
}

export type AuthAction =
  | { type: AuthActionType.SET_USER_SESSION; userSession: UserSession }
  | { type: AuthActionType.CLEAR_USER_SESSION }
  | { type: AuthActionType.CHANGE_PASSWORD_SUCCESS }
  | { type: AuthActionType.INIT }
  | { type: AuthActionType.ERROR; errorMessage: string };
