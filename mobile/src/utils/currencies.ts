// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

type DisplayFiatAmountConfig = {
  currency?: string;
  decimals?: number;
};

/**
 * Formats the given amount as fiat currency, optionally specifying the currency code.
 *
 * @param {number | undefined} amount - The amount to format.
 * @param {DisplayFiatAmountConfig} [options] - Configuration options for formatting the amount.
 * @param {string} [options.currency] - The currency code to display, e.g. "USD", "EUR", etc.
 * @param {boolean} [options.decimals] - Number of decimals to enforce
 *
 * @returns {string} The formatted amount as a string, with an optional currency code prefix.
 * If the `amount` parameter is `undefined`, the function returns the string "N/A".
 */
export function displayFiatAmount(
  amount: number | string | null | undefined,
  options: DisplayFiatAmountConfig = {}
): string {
  if (amount == null) {
    return "N/A";
  }

  const amountAsNumber =
    typeof amount === "string" ? parseFloat(amount) : amount;

  const decimalPlaces =
    options.decimals !== undefined
      ? options.decimals
      : typeof amount === "number"
      ? 2
      : getDecimalCount(amount.toString());
  const formattedAmount = amountAsNumber.toFixed(decimalPlaces);

  if (options.currency) {
    return `${options.currency} ${formattedAmount}`;
  }
  return formattedAmount;
}

/**
 * Returns the number of decimal places in the given value.
 *
 * This function can handle both numbers and strings. If the input is a number,
 * it is converted to a string before calculating the number of decimal places.
 *
 * @param {number | string} value - The value to find the number of decimal places in.
 *
 * @returns {number} The number of decimal places in the value. If the value has no decimal part, the function returns 0.
 */
export function getDecimalCount(value: number | string): number {
  const valueString = value.toString();
  const parts = valueString.split(".");
  return parts.length > 1 ? parts[1].length : 0;
}
