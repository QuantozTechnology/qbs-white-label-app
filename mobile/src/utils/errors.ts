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
