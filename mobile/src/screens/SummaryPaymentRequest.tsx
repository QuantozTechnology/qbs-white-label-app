import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Text, View, VStack } from "native-base";
import { displayFiatAmount } from "../utils/currencies";
import QRCode from "react-native-qrcode-svg";
import { Share, useWindowDimensions } from "react-native";
import DataDisplayField from "../components/DataDisplayField";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import ScreenWrapper from "../components/ScreenWrapper";
import { ScrollView } from "react-native-gesture-handler";
import { formatAmount } from "../utils/string";
import { defaultConfig } from "../config/config";

type Props = NativeStackScreenProps<
  PortfolioStackParamList,
  "SummaryPaymentRequest"
>;

function SummaryPaymentRequest({ navigation, route }: Props) {
  const {
    amount,
    canChangeAmount,
    stablecoin,
    message,
    qrCode,
    expiresOn,
    shareName,
    isOneOffPayment,
  } = route.params;
  const { width } = useWindowDimensions();

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
          <QRCode value={qrCode} size={width * 0.5} />
        </View>
        <ScrollView>
          <VStack pt={4}>
            <DataDisplayField
              label="Amount"
              value={displayFiatAmount(parseFloat(amount), {
                currency: stablecoin,
              })}
              accessibilityLabel="amount"
            >
              {canChangeAmount && (
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
              value={message ?? "Not specified"}
              accessibilityLabel="message"
            />
            <DataDisplayField
              label="Expires on"
              value={expiresOn ?? "Never"}
              accessibilityLabel="expires on"
            />
            <DataDisplayField
              label="Share my name with payer"
              value={shareName ? "Yes" : "No"}
              accessibilityLabel="share name"
            />
            <DataDisplayField
              label="One-off payment"
              value={isOneOffPayment ? "Yes" : "No"}
              accessibilityLabel="one-off payment"
            />
          </VStack>
        </ScrollView>
      </VStack>
      <VStack space={2} p={4}>
        <Button onPress={onShare} accessibilityLabel="share">
          Share
        </Button>
        <Button
          variant="outline"
          onPress={() => navigation.navigate("Portfolio")}
          accessibilityLabel="close"
        >
          Close
        </Button>
      </VStack>
    </ScreenWrapper>
  );

  async function onShare() {
    try {
      const result = await Share.share({
        message: `Hi, I've created a payment request for ${displayFiatAmount(
          parseFloat(formatAmount(amount)),
          { currency: stablecoin }
        )}. You can pay through the Quantoz Payments app by tapping the following link. Thanks! ${
          defaultConfig.sharePaymentUrl + qrCode
        }`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      }
    } catch (e) {
      const shareError = e as Error;
      alert(shareError.message);
    }
  }
}

export default SummaryPaymentRequest;
