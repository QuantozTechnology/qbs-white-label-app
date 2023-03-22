// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Badge, Box, Button, Heading, HStack, Text, VStack } from "native-base";
import { useAccount } from "../api/account/account";
import DataDisplayField from "../components/DataDisplayField";
import PaidBySection from "../components/PaidBySection";
import ScreenWrapper from "../components/ScreenWrapper";
import { PaymentRequestsStackParamList } from "../navigation/PaymentRequestsStack";
import { displayFiatAmount } from "../utils/currencies";
import { formatDateTime } from "../utils/dates";

type Props = NativeStackScreenProps<
  PaymentRequestsStackParamList,
  "PaymentRequestDetails"
>;

function PaymentRequestDetails({ navigation, route }: Props) {
  const { details } = route.params;
  const { data: account, status } = useAccount();

  const { code, options, payments, requestedAmount, tokenCode } = details;

  const sumTotalPaid = payments.reduce(
    (total, current) => total + current.amount,
    0
  );

  const doesNotExpire = options.expiresOn === null;
  const isExpired = options.expiresOn && options.expiresOn < Date.now();

  return (
    <ScreenWrapper flex={1} px={-4}>
      <VStack flex={1}>
        <DataDisplayField
          label="Message"
          value={options.memo ?? "N/A"}
          accessibilityLabel="message"
        />
        <DataDisplayField
          label="Amount"
          value={displayFiatAmount(requestedAmount, {
            currency: tokenCode,
          })}
          accessibilityLabel="amount"
        />
        <DataDisplayField
          accessibilityLabel="expiration"
          label="Expiration date"
          value={
            options.expiresOn ? (
              isExpired ? (
                <HStack space={2}>
                  <Text fontSize="md">{formatDateTime(options.expiresOn)}</Text>
                  <Badge
                    colorScheme="warning"
                    rounded="sm"
                    _text={{ textTransform: "uppercase" }}
                    accessibilityLabel="expired badge"
                  >
                    Expired
                  </Badge>
                </HStack>
              ) : (
                formatDateTime(options.expiresOn)
              )
            ) : (
              "Never"
            )
          }
        />
        <DataDisplayField
          label="Paid to"
          accessibilityLabel="paid to field"
          value={
            status === "error" ? (
              "N/A"
            ) : status === "loading" ? (
              "Loading..."
            ) : (
              <HStack space={2}>
                <Text fontSize="md" accessibilityLabel="paid to account">
                  {account.data.value.accountCode}
                </Text>
                <Badge
                  rounded="sm"
                  _text={{ textTransform: "uppercase" }}
                  accessibilityLabel="my account badge"
                >
                  My account
                </Badge>
              </HStack>
            )
          }
        />
        <HStack
          justifyContent="space-between"
          alignItems="center"
          pt="8"
          px={4}
        >
          <HStack alignItems="center" space={2}>
            <Heading size="xs" textTransform="uppercase" fontWeight="medium">
              Paid by
            </Heading>
            <Badge
              bg="primary.200"
              rounded="full"
              accessibilityLabel="# payments"
            >
              {payments.length}
            </Badge>
          </HStack>
          {payments.length > 0 && (
            <Heading
              size="xs"
              textTransform="uppercase"
              accessibilityLabel="total paid"
            >
              Total: {displayFiatAmount(sumTotalPaid, { currency: tokenCode })}
            </Heading>
          )}
        </HStack>
        <PaidBySection tokenCode={tokenCode} payments={payments} />
      </VStack>
      {(doesNotExpire || (!doesNotExpire && !isExpired)) && (
        <Box px={4}>
          <Button
            accessibilityLabel="share again"
            onPress={() => {
              navigation.navigate("SummaryPaymentRequest", {
                code: code,
              });
            }}
          >
            Share again
          </Button>
        </Box>
      )}
    </ScreenWrapper>
  );
}

export default PaymentRequestDetails;
