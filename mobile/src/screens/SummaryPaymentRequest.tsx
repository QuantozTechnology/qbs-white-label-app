// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Skeleton, Text, View, VStack } from "native-base";
import { displayFiatAmount } from "../utils/currencies";
import QRCode from "react-native-qrcode-svg";
import { Share, useWindowDimensions } from "react-native";
import DataDisplayField from "../components/DataDisplayField";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import ScreenWrapper from "../components/ScreenWrapper";
import { ScrollView } from "react-native-gesture-handler";
import { defaultConfig } from "../config/config";
import { usePaymentRequest } from "../api/paymentrequest/paymentRequest";
import { formatDateTime } from "../utils/dates";
import FullScreenMessage from "../components/FullScreenMessage";

type Props = NativeStackScreenProps<
  PortfolioStackParamList,
  "SummaryPaymentRequest"
>;

function SummaryPaymentRequest({ route }: Props) {
  const { code } = route.params;

  const { data, status: paymentRequestStatus } = usePaymentRequest(code);
  const { width } = useWindowDimensions();

  if (paymentRequestStatus === "error") {
    return (
      <FullScreenMessage message="Cannot load payment request. Try again later" />
    );
  }

  if (paymentRequestStatus === "loading") {
    return (
      <VStack p={4} alignItems="center" space={2}>
        <Skeleton w={200} h={200} m={12} />
        <Skeleton h={"72px"} />
        <Skeleton h={"72px"} />
        <Skeleton h={"72px"} />
        <Skeleton h={"72px"} />
      </VStack>
    );
  }

  const {
    code: paymentRequestCode,
    options,
    requestedAmount,
    tokenCode,
  } = data.value;

  return (
    <ScreenWrapper flex={1} p={-4}>
      <VStack space={3} flex={1}>
        <View
          mx="auto"
          my={6}
          accessibilityLabel="qrCode"
          bg="white"
          p={4}
          rounded="md"
        >
          <QRCode value={paymentRequestCode} size={width * 0.5} />
        </View>
        <ScrollView>
          <VStack pt={4}>
            <DataDisplayField
              label="Amount"
              value={displayFiatAmount(requestedAmount, {
                currency: tokenCode,
              })}
              accessibilityLabel="amount"
            >
              {options.payerCanChangeRequestedAmount && (
                <Text
                  fontSize="xs"
                  color="coolGray.500"
                  accessibilityLabel="amount can be changed"
                >
                  can be changed by payer
                </Text>
              )}
            </DataDisplayField>
            <DataDisplayField
              label="Message"
              value={options.memo ?? "Not specified"}
              accessibilityLabel="message"
            />
            <DataDisplayField
              label="Expires on"
              value={
                options.expiresOn ? formatDateTime(options.expiresOn) : "Never"
              }
              accessibilityLabel="expires on"
            />
            <DataDisplayField
              label="Share my name with payer"
              value={options.name ? "Yes" : "No"}
              accessibilityLabel="share name"
            />
            <DataDisplayField
              label="One-off payment"
              value={options.isOneOffPayment ? "Yes" : "No"}
              accessibilityLabel="one-off payment"
            />
          </VStack>
        </ScrollView>
      </VStack>
      <VStack space={2} p={4}>
        <Button onPress={onShare} accessibilityLabel="share">
          Share
        </Button>
      </VStack>
    </ScreenWrapper>
  );

  async function onShare() {
    try {
      await Share.share({
        message: `Hi, I've created a payment request for ${displayFiatAmount(
          requestedAmount,
          { currency: tokenCode }
        )}. You can pay through the Quantoz Payments app by tapping the following link. Thanks! ${
          defaultConfig.sharePaymentUrl + paymentRequestCode
        }`,
      });
    } catch (e) {
      const shareError = e as Error;
      alert(shareError.message);
    }
  }
}

export default SummaryPaymentRequest;
