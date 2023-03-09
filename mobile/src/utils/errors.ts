// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AxiosError } from "axios";
import { APIError } from "../api/generic/error.interface";

/**
 * Formats the given error object into a user-friendly message, depending whether it's a generic Error or an AxiosError
 *
 * @param {Error | AxiosError<APIError>} error - The error object to format.
 * @returns {string} The formatted error message.
 */
export function formatError(error: Error | AxiosError<APIError>) {
  return error instanceof AxiosError && error.response?.data
    ? error.response?.data.Errors[0].Message
    : error.message;
}
