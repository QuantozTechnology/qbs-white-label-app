// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

type DisplayFiatAmountConfig = {
  currency?: string;
  alwaysRoundToTwoDecimals?: boolean;
};

/**
 * Formats the given amount as fiat currency, optionally specifying the currency code.
 *
 * @param {number | undefined} amount - The amount to format.
 * @param {DisplayFiatAmountConfig} [options] - Configuration options for formatting the amount.
 * @param {string} [options.currency] - The currency code to display, e.g. "USD", "EUR", etc.
 * @param {boolean} [options.alwaysRoundToTwoDecimals] - Whether to always round the amount to two decimal places.
 *
 * @returns {string} The formatted amount as a string, with an optional currency code prefix.
 * If the `amount` parameter is `undefined`, the function returns the string "N/A".
 */
export function displayFiatAmount(
  amount: number | undefined,
  options: DisplayFiatAmountConfig = {}
): string {
  if (amount == null) {
    return "N/A";
  }

  let formattedAmount = amount.toFixed(2);
  if (options.alwaysRoundToTwoDecimals) {
    formattedAmount = amount.toFixed(2);
  } else if (!Number.isInteger(amount)) {
    let decimalPlaces = 2;
    while (decimalPlaces < 8 && formattedAmount.endsWith("00")) {
      decimalPlaces++;
      formattedAmount = amount.toFixed(decimalPlaces);
    }
  }

  if (options.currency) {
    return `${options.currency} ${formattedAmount}`;
  }
  return formattedAmount;
}
