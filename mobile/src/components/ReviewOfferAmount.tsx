// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { Heading, HStack, Icon, Input, Text, VStack } from "native-base";
import { Dispatch, SetStateAction } from "react";
import { CreateOfferPayload, Offer } from "../api/offers/offers.interface";
import { displayFiatAmount } from "../utils/currencies";

type ReviewOfferAmountProps = {
  offer: Offer | CreateOfferPayload;
  maxAmount?: string;
  customAmount?: string | undefined;
  setCustomAmount?: Dispatch<SetStateAction<string | undefined>>;
};

function ReviewOfferAmount({
  offer,
  maxAmount,
  customAmount,
  setCustomAmount,
}: ReviewOfferAmountProps) {
  const { action, destinationToken, sourceToken, options } = offer;
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
      {options?.payerCanChangeRequestedAmount ? (
        <Input
          variant="unstyled"
          fontSize="5xl"
          textAlign="center"
          defaultValue={destinationToken.totalAmount}
          value={customAmount}
          onChangeText={setCustomAmount}
          autoFocus
        />
      ) : (
        <Heading
          size="3xl"
          accessibilityLabel="review offer amount"
          letterSpacing="sm"
        >
          {displayFiatAmount(destinationToken.totalAmount)}
        </Heading>
      )}
      {options?.payerCanChangeRequestedAmount && maxAmount == null && (
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
      {maxAmount && customAmount && (
        <Text
          color={
            parseFloat(customAmount) > parseFloat(maxAmount)
              ? "error.500"
              : "text.400"
          }
          fontSize="md"
          fontWeight={
            parseFloat(customAmount) > parseFloat(maxAmount)
              ? "medium"
              : "normal"
          }
          accessibilityLabel="payer can change amount"
        >
          Max: {displayFiatAmount(maxAmount)}
        </Text>
      )}
    </VStack>
  );
}

export default ReviewOfferAmount;
