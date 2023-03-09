// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Token } from "./types";
import jwt_decode from "jwt-decode";

/**
 * Returns true if the token is expired or does not exist and false otherwise
 * @param  {Token} token
 * @returns boolean
 */
export function isExpired(token: Token): boolean {
  const secondsMargin: number = 60 * 10 * -1;

  if (!token) {
    return true;
  }

  if (token.exp) {
    const now = getCurrentTimeInSeconds();
    return now >= token.exp + secondsMargin;
  }

  // if there is no expiration time but we have an access token, it is assumed to never expire
  return false;
}

/**
 * Decode a JWT token
 * @param  {string} jwtIdToken
 * @returns T
 */
export function decode<T>(jwtIdToken: string) {
  return jwt_decode<T>(jwtIdToken);
}

/**
 * Get the current time in seconds since Unix epoch
 * @returns number
 */
function getCurrentTimeInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
