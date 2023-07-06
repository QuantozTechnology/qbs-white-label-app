// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Icon, Pressable, VStack } from "native-base";
import { useEffect, useState } from "react";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import CancelOfferDialog from "../components/CancelOfferDialog";
import ScreenWrapper from "../components/ScreenWrapper";
import LargeHeaderCard from "../components/LargeHeaderCard";
import { displayFiatAmount, getDecimalCount } from "../utils/currencies";
import GenericListItem from "../components/GenericListItem";
import { OfferToken } from "../api/offers/offers.interface";
import { calculatePrice } from "../utils/offers";
import { OfferOverviewStackParamList } from "../navigation/OfferOverviewStack";

type OfferDetailsProps = NativeStackScreenProps<
  OfferOverviewStackParamList,
  "OfferDetails"
>;

function OfferDetails({ navigation, route }: OfferDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { action, offerCode, sourceToken, destinationToken } =
    route.params.offer;

  useEffect(() => {
    navigation.setOptions({
      header: (props) => (
        <CustomNavigationHeader
          {...props}
          customIcon={
            <Icon as={Ionicons} name="close" size="xl" color="primary.500" />
          }
          rightHeaderIcons={
            route.params.offerStatus === "Open" ? (
              <Pressable onPress={handleCancelOffer}>
                <Icon
                  as={Ionicons}
                  color="primary.500"
                  size="lg"
                  name="trash-outline"
                />
              </Pressable>
            ) : null
          }
        />
      ),
    });
  }, []);
  const offerMainToken = getOfferToken(action, sourceToken, destinationToken);
  const price = calculatePrice(action, sourceToken, destinationToken);

  const orderFilledEntry = getOrderFilledEntry(
    offerMainToken,
    isOfferPartiallyFilled(offerMainToken)
  );
  // TODO use the real fee value once implemented
  const fee = "0.80";
  return (
    <ScreenWrapper flex={1} justifyContent="space-between" pb={8}>
      <VStack space={2}>
        <LargeHeaderCard
          primaryText={offerMainToken.tokenCode}
          secondaryText={displayFiatAmount(offerMainToken.totalAmount)}
        />
        {orderFilledEntry}
        <GenericListItem
          accessibilityLabel="price"
          leftContent="Price"
          rightContent={`${price} ${
            action === "Buy"
              ? sourceToken.tokenCode
              : destinationToken.tokenCode
          }/${
            action === "Buy"
              ? destinationToken.tokenCode
              : sourceToken.tokenCode
          }`}
        />
        <GenericListItem
          accessibilityLabel={action === "Buy" ? "purchase" : "selling"}
          leftContent={action === "Buy" ? "Purchase value" : "Sell value"}
          rightContent={displayFiatAmount(
            parseFloat(price) * parseFloat(offerMainToken.totalAmount),
            {
              currency:
                action === "Buy"
                  ? sourceToken.tokenCode
                  : destinationToken.tokenCode,
              decimals:
                action === "Buy"
                  ? getDecimalCount(sourceToken.totalAmount)
                  : getDecimalCount(destinationToken.totalAmount),
            }
          )}
        />
        <GenericListItem
          accessibilityLabel="fee"
          leftContent="Fee"
          rightContent={displayFiatAmount(fee, {
            currency:
              action === "Buy"
                ? sourceToken.tokenCode
                : destinationToken.tokenCode,
          })}
        />
        <GenericListItem
          accessibilityLabel="total"
          leftContent={
            action === "Buy" ? "Total to be paid" : "Total to receive"
          }
          rightContent={displayFiatAmount(
            action === "Buy"
              ? parseFloat(sourceToken.totalAmount) + parseFloat(fee)
              : parseFloat(destinationToken.totalAmount) - parseFloat(fee),
            {
              currency:
                action === "Buy"
                  ? sourceToken.tokenCode
                  : destinationToken.tokenCode,
              decimals:
                action === "Buy"
                  ? getDecimalCount(sourceToken.totalAmount)
                  : getDecimalCount(destinationToken.totalAmount),
            }
          )}
          bold
        />
        <CancelOfferDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          offerCode={offerCode}
        />
      </VStack>
      <Button onPress={handleShare}>Share</Button>
    </ScreenWrapper>
  );

  function handleCancelOffer() {
    setIsOpen(true);
  }

  function handleShare() {
    navigation.navigate("ShareOffer", {
      offer: route.params.offer,
    });
  }

  function getOfferToken(
    action: "Buy" | "Sell",
    sourceToken: OfferToken,
    destinationToken: OfferToken
  ) {
    return action === "Buy" ? destinationToken : sourceToken;
  }

  function isOfferPartiallyFilled(token: OfferToken) {
    return (
      token.remainingAmount != null &&
      parseFloat(token.remainingAmount) !== 0 &&
      token.remainingAmount !== token.totalAmount
    );
  }

  function getOrderFilledEntry(token: OfferToken, isPartiallyFilled: boolean) {
    return token.remainingAmount && isPartiallyFilled ? (
      <GenericListItem
        accessibilityLabel="order filled"
        leftContent="Order filled"
        rightContent={`${displayFiatAmount(
          parseFloat(token.totalAmount) - parseFloat(token.remainingAmount),
          {
            decimals: getDecimalCount(token.totalAmount),
          }
        )}/${displayFiatAmount(token.totalAmount)}`}
      />
    ) : null;
  }
}

export default OfferDetails;
