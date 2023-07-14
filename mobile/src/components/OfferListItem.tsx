// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Badge, HStack, Icon, Pressable, Text, VStack } from "native-base";
import { Offer } from "../api/offers/offers.interface";
import { OffersStackParamList } from "../navigation/OffersStack";
import { displayFiatAmount } from "../utils/currencies";

type OfferProps = {
  offer: Offer;
  offerStatus: "Open" | "Closed";
};

function OfferListItem({ offer, offerStatus }: OfferProps) {
  const { action, status, sourceToken, destinationToken } = offer;
  const navigation = useNavigation<NavigationProp<OffersStackParamList>>();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("OfferDetails", { offer, offerStatus })
      }
    >
      <HStack
        bg="white"
        alignItems="center"
        p={4}
        m={1}
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
            {status === "Partial" && (
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
    </Pressable>
  );
}

export default OfferListItem;
