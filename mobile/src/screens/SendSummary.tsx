// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NavigationProp } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Button,
  FormControl,
  Input,
  ScrollView,
  Text,
  Toast,
  useToast,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useBalances } from "../api/balances/balances";
import { APIError } from "../api/generic/error.interface";
import { usePaymentRequest } from "../api/paymentrequest/paymentRequest";
import { createPaymentForPaymentRequest } from "../api/payments/payments";
import { CreatePaymentForPaymentRequest } from "../api/payments/payments.interface";
import DataDisplayField from "../components/DataDisplayField";
import DataDisplayFieldSkeleton from "../components/DataDisplayFieldSkeleton";
import FullScreenMessage from "../components/FullScreenMessage";
import Notification from "../components/Notification";
import ScreenWrapper from "../components/ScreenWrapper";
import { defaultConfig } from "../config/config";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import { SendStackParamList } from "../navigation/SendStack";
import { biometricValidation } from "../utils/biometric";
import { displayFiatAmount } from "../utils/currencies";
import { formatDateTime } from "../utils/dates";
import { formatError } from "../utils/errors";
import { formatAmount } from "../utils/string";
import { validationCheck } from "../utils/validation/errors";

type Props = NativeStackScreenProps<SendStackParamList, "SendSummary">;

function SendSummary({ navigation, route }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: paymentRequest, status: paymentRequestStatus } =
    usePaymentRequest(route.params.code);
  const {
    status: balancesStatus,
    error: balanceApiError,
    data: balance,
  } = useBalances();

  // for better UX, instead of filling the field with e.g. 12.00 it becomes 12. Needs to be casted twice for this
  const [amount, setAmount] = useState<string | undefined>(
    paymentRequest?.value.requestedAmount.toString()
  );
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );

  const { mutate, isLoading: isCreatingPayment } = useMutation({
    mutationFn: createPaymentForPaymentRequest,
    onSuccess() {
      toast.show({
        render: () =>
          (amount != null || paymentRequest != null) && (
            <Notification
              title="Payment successful"
              message={`Paid ${displayFiatAmount(
                amount
                  ? parseFloat(amount)
                  : paymentRequest?.value.requestedAmount,
                { currency: paymentRequest?.value.tokenCode }
              )}`}
              variant="success"
              isToastNotification
            />
          ),
        id: "api-error",
      });

      // refetch
      queryClient.invalidateQueries({
        queryKey: ["balances"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
        refetchType: "all",
      });

      navigation
        .getParent<NavigationProp<PortfolioStackParamList>>()
        .reset({ index: 0, routes: [{ name: "Portfolio" }] });
    },
    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        render: () => (
          <Notification
            message={formatError(error)}
            title="Error"
            variant="error"
            isToastNotification
          />
        ),
      });
    },
  });

  useEffect(() => {
    if (balanceApiError) {
      const axiosError = balanceApiError as AxiosError<APIError>;
      if (!toast.isActive("api-error")) {
        toast.show({
          render: () => (
            <Notification message={formatError(axiosError)} variant="error" />
          ),
          id: "api-error",
        });
      }
    }
  }, [balanceApiError]);

  if (balancesStatus === "error" || paymentRequestStatus === "error") {
    // show error message here
    return (
      <FullScreenMessage
        message="Could not scan payment request, try again later"
        title="Error"
      />
    );
  }

  if (balancesStatus === "loading" || paymentRequestStatus === "loading") {
    return (
      <VStack p={4} h="full" justifyContent="space-between">
        <VStack space={2}>
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
        </VStack>
        <Button isDisabled>Send</Button>
      </VStack>
    );
  }

  const CreatePaymentSchema = z.object({
    amount: z.coerce
      .number()
      .min(
        defaultConfig.minSendAmount,
        `Min: ${displayFiatAmount(defaultConfig.minSendAmount)}`
      )
      .max(balance.value[0].balance, "Amount greater than your balance"),
    tokenCode: z.string().refine(
      () => {
        return balance?.value.find(
          (b) => b.tokenCode === paymentRequest?.value.tokenCode
        );
      },
      {
        message: `You do not own any ${paymentRequest.value.tokenCode} token`,
      }
    ),
  });

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const AmountAndTokenValidation = CreatePaymentSchema.pick({
      amount: true,
    });

    const result = validationCheck(AmountAndTokenValidation, { amount: value });

    if (result != null) {
      setErrors(result);
    } else {
      const updatedErrors = { ...errors };
      delete updatedErrors["amount"];
      setErrors(updatedErrors);
    }
  };

  const {
    code: paymentRequestCode,
    requestedAmount,
    tokenCode,
    options,
  } = paymentRequest.value;

  return (
    <ScreenWrapper flex={1} p={-4}>
      <ScrollView flex={1}>
        <VStack flex={1}>
          {errors["amount"] === "Amount greater than your balance" && (
            <Notification
              message="You should first fund your account before being able to proceed with this payment"
              variant="info"
              actionButton={
                <Button
                  size="xs"
                  accessibilityLabel="add funds"
                  onPress={() =>
                    navigation
                      .getParent<NavigationProp<PortfolioStackParamList>>()
                      .navigate("Funding")
                  }
                >
                  Add funds
                </Button>
              }
            />
          )}
          {options?.payerCanChangeRequestedAmount ? (
            <FormControl
              isRequired
              isDisabled={"tokenCode" in errors}
              isInvalid={"amount" in errors || "tokenCode" in errors}
              p={4}
            >
              <FormControl.Label>Amount ({tokenCode})</FormControl.Label>
              <Input
                value={amount}
                defaultValue={requestedAmount.toString()}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                accessibilityLabel="editable amount"
              ></Input>
              <FormControl.ErrorMessage accessibilityLabel="amount errors">
                {errors["amount"] != null && (
                  <Text display="block">{errors["amount"]}</Text>
                )}
                {errors["tokenCode"] != null && (
                  <Text display="block">{errors["tokenCode"]}</Text>
                )}
              </FormControl.ErrorMessage>
              {!errors["tokenCode"] && (
                <FormControl.HelperText accessibilityLabel="amount balance message">
                  {`Balance: ${displayFiatAmount(
                    balance?.value.find((b) => b.tokenCode === tokenCode)
                      ?.balance,
                    { currency: tokenCode }
                  )}`}
                </FormControl.HelperText>
              )}
            </FormControl>
          ) : (
            <FormControl
              isInvalid={"amount" in errors || "tokenCode" in errors}
            >
              <DataDisplayField
                label="Amount"
                value={displayFiatAmount(
                  parseFloat(formatAmount(requestedAmount.toString())),
                  { currency: tokenCode }
                )}
                accessibilityLabel="non-editable amount"
                bg={
                  errors["tokenCode"] || errors["amount"]
                    ? "error.100"
                    : undefined
                }
              />
              <FormControl.ErrorMessage
                pl={4}
                mt={0}
                mb={2}
                accessibilityLabel="amount errors"
              >
                {errors["amount"] != null && (
                  <Text display="block">{errors["amount"]}</Text>
                )}
                {errors["tokenCode"] != null && (
                  <Text display="block">{errors["tokenCode"]}</Text>
                )}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
          <DataDisplayField
            label="Message"
            value={options.memo ?? "-"}
            accessibilityLabel="message"
          />
          <DataDisplayField
            label="Expires on"
            value={
              options.expiresOn ? formatDateTime(options.expiresOn) : "Never"
            }
            accessibilityLabel="expires"
          />
          {options.name && (
            <>
              <FormControl.Label px={4} pt={6} pb={2}>
                Recipient info
              </FormControl.Label>
              <DataDisplayField
                label="Name"
                value={options.name}
                accessibilityLabel="name"
              />
            </>
          )}
        </VStack>
      </ScrollView>
      <Button
        isDisabled={errors["amount"] != null && errors["tokenCode"] != null}
        onPress={handleSend}
        isLoading={isCreatingPayment}
        isLoadingText="Paying..."
        accessibilityLabel="send"
        m={4}
      >
        Send
      </Button>
    </ScreenWrapper>
  );

  async function handleSend() {
    if (paymentRequest != null) {
      const checkUserInput: z.infer<typeof CreatePaymentSchema> = {
        amount:
          amount != null
            ? parseFloat(formatAmount(amount))
            : parseFloat(formatAmount(requestedAmount.toString())),
        tokenCode: paymentRequest?.value.tokenCode,
      };

      const result = validationCheck(CreatePaymentSchema, checkUserInput);

      if (result != null) {
        setErrors(result);
      } else {
        const biometricCheck = await biometricValidation();

        if (biometricCheck.result === "success") {
          const createPaymentPayload: CreatePaymentForPaymentRequest = {
            amount:
              amount != null
                ? formatAmount(amount)
                : formatAmount(requestedAmount.toString()),
            paymentRequestCode: paymentRequestCode,
          };

          mutate(createPaymentPayload);
        } else {
          Toast.show({
            render: () => (
              <Notification
                message="Please complete biometric authentication"
                variant="warning"
                isToastNotification
              />
            ),
          });
        }
      }
    }
  }
}

export default SendSummary;
