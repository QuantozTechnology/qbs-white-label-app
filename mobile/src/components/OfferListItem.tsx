// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { FontAwesome5 } from "@expo/vector-icons";
import { Badge, HStack, Icon, Text, VStack } from "native-base";
import { Offer } from "../api/offers/offers.interface";
import { displayFiatAmount } from "../utils/currencies";

type OfferProps = {
  offer: Offer;
};

function OfferListItem({ offer }: OfferProps) {
  const { action, status: offerStatus, sourceToken, destinationToken } = offer;

  // TODO add Partial status
  return (
    <HStack
      bg="white"
      alignItems="center"
      p={4}
      rounded="md"
      accessibilityLabel="offer"
    >
      <VStack flex={1}>
        <HStack space={2}>
          <Text
            fontWeight={600}
            fontSize="md"
            accessibilityLabel="source action"
          >
            {action}
          </Text>
          {offerStatus === "Partial" && (
            <Badge
              variant="subtle"
              colorScheme="info"
              rounded="sm"
              accessibilityLabel="partial offer badge"
            >
              Partial
            </Badge>
          )}
        </HStack>
        <Text fontSize="md" accessibilityLabel="source amount">
          {action === "Buy"
            ? displayFiatAmount(destinationToken.totalAmount, {
                currency: destinationToken.tokenCode,
              })
            : displayFiatAmount(sourceToken.totalAmount, {
                currency: sourceToken.tokenCode,
              })}
        </Text>
      </VStack>
      <Icon as={FontAwesome5} name="exchange-alt" />
      <VStack flex={1} alignItems="flex-end">
        <Text
          fontWeight={600}
          fontSize="md"
          accessibilityLabel="destination action"
        >
          {action === "Buy" ? "Sell" : "Buy"}
        </Text>
        <Text fontSize="md" accessibilityLabel="destination amount">
          {action === "Buy"
            ? displayFiatAmount(sourceToken.totalAmount, {
                currency: sourceToken.tokenCode,
              })
            : displayFiatAmount(destinationToken.totalAmount, {
                currency: destinationToken.tokenCode,
              })}
        </Text>
      </VStack>
    </HStack>
  );
}

export default OfferListItem;
