// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { ZodSchema } from "zod";

/**
 * Validates the provided data against the validation schema
 *
 * @param {ZodSchema} validationSchema - The Zod validation schema to use
 * @param {Record<string, any>} data - The data to validate
 * @param {() => void} [onSuccess] - A callback function to be executed on successful validation
 *
 * @returns {void | Record<string, string>} - Returns an object containing validation errors, if any, or void if successful
 */

export function validationCheck(
  validationSchema: ZodSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
  onSuccess?: () => void
): void | Record<string, string> {
  const validationResult = validationSchema.safeParse(data);

  if (validationResult.success) {
    onSuccess && onSuccess();
  } else {
    // set errors depending on the response
    const validationErrors = validationResult.error.issues.map((issue) => {
      return { [issue.path[0]]: issue.message };
    });

    return Object.assign({}, ...validationErrors);
  }
}
