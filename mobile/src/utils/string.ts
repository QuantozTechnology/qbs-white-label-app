// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

/**
 * Transforms the decimal separator of a string number from a comma to a dot.
 * @param {string} amount - The string representation of a number with a comma as the decimal separator.
 * @returns {string} The string representation of the input number with a dot as the decimal separator.
 */
export function formatAmount(amount: string) {
  return amount.replace(",", ".");
}
