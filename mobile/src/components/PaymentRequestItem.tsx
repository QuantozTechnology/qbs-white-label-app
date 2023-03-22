import { NavigationProp, useNavigation } from "@react-navigation/native";
import { HStack, Pressable, Text, VStack } from "native-base";
import { PaymentRequestDetails } from "../api/paymentrequest/paymentRequest.interface";
import { displayFiatAmount } from "../utils/currencies";
import { PaymentRequestsTabParamList } from "../navigation/PaymentRequestsTab";
import { PaymentRequestsStackParamList } from "../navigation/PaymentRequestsStack";
import { calculateValidity } from "../utils/dates";

type Props = {
  details: PaymentRequestDetails;
};

function PaymentRequestItem({ details }: Props) {
  const navigation =
    useNavigation<NavigationProp<PaymentRequestsTabParamList>>();

  return (
    <Pressable onPress={handlePress} accessibilityLabel="payment request item">
      <HStack
        bg="white"
        p={4}
        rounded="md"
        justifyContent="space-between"
        alignItems="center"
        h={20}
        borderBottomWidth={1}
        borderBottomColor="gray.200"
      >
        <VStack justifyContent="center">
          <Text fontWeight="medium" accessibilityLabel="message">
            {details.options.memo ?? "Message N/A"}
          </Text>
          <Text color="muted.500" accessibilityLabel="validity">
            {calculateValidity(details.options.expiresOn)}
          </Text>
        </VStack>
        <Text accessibilityLabel="amount">
          {displayFiatAmount(details.requestedAmount, {
            currency: details.tokenCode,
          })}
        </Text>
      </HStack>
    </Pressable>
  );

  function handlePress() {
    navigation
      .getParent<NavigationProp<PaymentRequestsStackParamList>>()
      .navigate("PaymentRequestDetails", { details });
  }
}

export default PaymentRequestItem;
