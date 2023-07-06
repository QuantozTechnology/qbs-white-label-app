// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, View, VStack } from "native-base";
import { Share, useWindowDimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";
import GenericListItem from "../components/GenericListItem";
import LargeHeaderCard from "../components/LargeHeaderCard";
import ScreenWrapper from "../components/ScreenWrapper";
import { defaultConfig } from "../config/config";
import { OfferOverviewStackParamList } from "../navigation/OfferOverviewStack";
import { displayFiatAmount, getDecimalCount } from "../utils/currencies";

type ShareOfferProps = NativeStackScreenProps<
  OfferOverviewStackParamList,
  "ShareOffer"
>;

function ShareOffer({ route }: ShareOfferProps) {
  const { width } = useWindowDimensions();
  const { action, destinationToken, offerCode, sourceToken } =
    route.params.offer;
  const targetToken = action === "Buy" ? destinationToken : sourceToken;

  // TODO
  const fee = "0.80";

  const totalOfferValue = displayFiatAmount(
    action === "Buy"
      ? parseFloat(sourceToken.totalAmount) + parseFloat(fee)
      : parseFloat(destinationToken.totalAmount) - parseFloat(fee),
    {
      currency:
        action === "Buy" ? sourceToken.tokenCode : destinationToken.tokenCode,
      decimals:
        action === "Buy"
          ? getDecimalCount(sourceToken.totalAmount)
          : getDecimalCount(destinationToken.totalAmount),
    }
  );

  return (
    <ScreenWrapper flex={1} justifyContent="space-between" pb={8}>
      <VStack space={4}>
        <LargeHeaderCard
          primaryText={`${action} ${targetToken.tokenCode}`}
          secondaryText={displayFiatAmount(
            action === "Buy"
              ? destinationToken.totalAmount
              : sourceToken.totalAmount
          )}
        />
        <GenericListItem
          accessibilityLabel="total"
          leftContent={
            action === "Buy" ? "Total to be paid" : "Total to receive"
          }
          rightContent={totalOfferValue}
          bold
        />
        <View
          mx="auto"
          accessibilityLabel="qrCode"
          bg="white"
          p={4}
          rounded="md"
        >
          <QRCode
            value={JSON.stringify({
              code: offerCode,
              type: "offer",
            })}
            size={width * 0.82}
          />
        </View>
      </VStack>
      <Button accessibilityLabel="share" onPress={onShare}>
        Share
      </Button>
    </ScreenWrapper>
  );

  async function onShare() {
    try {
      await Share.share({
        message: `Hi, I've created a ${action} offer for ${totalOfferValue}. You can confirm it through the Quantoz Blockchain Solutions (QBS) app by tapping the following link. Thanks! ${
          defaultConfig.shareOfferUrl + offerCode
        }`,
      });
    } catch (e) {
      const shareError = e as Error;
      alert(shareError.message);
    }
  }
}

export default ShareOffer;
