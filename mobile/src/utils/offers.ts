// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { OfferToken } from "../api/offers/offers.interface";
import { displayFiatAmount, getDecimalCount } from "./currencies";

export function calculatePrice(
  action: "Buy" | "Sell",
  sourceToken: OfferToken,
  destinationToken: OfferToken
) {
  const buyPrice =
    parseFloat(sourceToken.totalAmount) /
    parseFloat(destinationToken.totalAmount);
  const sellPrice =
    parseFloat(destinationToken.totalAmount) /
    parseFloat(sourceToken.totalAmount);
  const sourceTokenTotalDecimalsCount = getDecimalCount(
    sourceToken.totalAmount
  );
  const destinationTokenTotalDecimalsCount = getDecimalCount(
    destinationToken.totalAmount
  );
  let decimalsToShow =
    action === "Buy"
      ? sourceTokenTotalDecimalsCount - destinationTokenTotalDecimalsCount + 2
      : destinationTokenTotalDecimalsCount - sourceTokenTotalDecimalsCount + 2;
  decimalsToShow = Math.max(0, Math.min(decimalsToShow, 8));

  return displayFiatAmount(action === "Buy" ? buyPrice : sellPrice, {
    decimals: decimalsToShow,
  });
}
