// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { Heading, HStack, Icon, Text, VStack } from "native-base";
import { CreateOfferPayload } from "../api/offers/offers.interface";
import { displayFiatAmount } from "../utils/currencies";

type ReviewOfferAmountProps = Pick<
  CreateOfferPayload,
  "action" | "sourceToken" | "destinationToken" | "options"
>;

function ReviewOfferAmount({
  action,
  destinationToken,
  sourceToken,
  options,
}: ReviewOfferAmountProps) {
  const isBuyOffer = action === "Buy";

  return (
    <VStack
      bg="white"
      justifyContent="center"
      alignItems="center"
      py={6}
      borderRadius="md"
      space={1}
    >
      <Heading size="lg" accessibilityLabel="review offer amount label">
        {action}{" "}
        {isBuyOffer ? destinationToken.tokenCode : sourceToken.tokenCode}
      </Heading>
      <Heading size="3xl" accessibilityLabel="review offer amount">
        {displayFiatAmount(destinationToken.amount)}
      </Heading>
      {options?.payerCanChangeRequestedAmount && (
        <HStack alignItems="center" justifyContent="center" space={2}>
          <Icon as={Ionicons} name="information-circle-outline" />
          <Text
            color="text.400"
            fontSize="md"
            accessibilityLabel="payer can change amount"
          >
            {isBuyOffer ? "Seller" : "Buyer"} can change amount
          </Text>
        </HStack>
      )}
    </VStack>
  );
}

export default ReviewOfferAmount;
