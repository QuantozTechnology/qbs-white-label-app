// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Icon, Spinner, Toast } from "native-base";
import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
} from "native-base";
import { useLayoutEffect } from "react";
import { useAccount } from "../api/account/account";
import { cancelPaymentRequest } from "../api/paymentrequest/paymentRequest";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import DataDisplayField from "../components/DataDisplayField";
import Notification from "../components/Notification";
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
  const queryClient = useQueryClient();
  const { details } = route.params;
  const { code, options, payments, requestedAmount, tokenCode } = details;
  const { data: account, status } = useAccount();

  const { mutate: cancelRequest, isLoading: isCancelingRequest } = useMutation({
    mutationFn: cancelPaymentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentRequests"] });

      Toast.show({
        render: () => (
          <Notification message="Payment request cancelled" variant="success" />
        ),
      });

      navigation.replace("PaymentRequestTabs");
    },
    onError: () => {
      Toast.show({
        render: () => (
          <Notification
            message="Cannot cancel payment request"
            title="Error"
            variant="error"
          />
        ),
      });
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props) => (
        <CustomNavigationHeader
          {...props}
          rightHeaderIcons={
            options.expiresOn == null ||
            (options.expiresOn && options.expiresOn > Date.now()) ? (
              isCancelingRequest ? (
                <Spinner color="primary.500" p={3} />
              ) : (
                <IconButton
                  icon={<Icon as={Ionicons} name="trash-outline" />}
                  _icon={{ color: "primary.500", size: "lg" }}
                  onPress={handleCancelPaymentRequest}
                  accessibilityLabel="cancel payment request"
                />
              )
            ) : null
          }
        />
      ),
    });
  }, [navigation, options.expiresOn, isCancelingRequest]);

  const sumTotalPaid = payments.reduce(
    (total, current) => total + current.amount,
    0
  );

  const doesNotExpire = options.expiresOn === null;
  const isExpired = options.expiresOn && options.expiresOn < Date.now();

  return (
    <ScreenWrapper
      flex={1}
      px={-4}
      accessibilityLabel="payment request details screen"
    >
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
            isDisabled={isCancelingRequest}
          >
            Share again
          </Button>
        </Box>
      )}
    </ScreenWrapper>
  );

  function handleCancelPaymentRequest() {
    cancelRequest(code);
  }
}

export default PaymentRequestDetails;
