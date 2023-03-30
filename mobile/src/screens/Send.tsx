// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NavigationProp } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Button,
  Checkbox,
  FormControl,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Toast,
  VStack,
} from "native-base";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useBalances } from "../api/balances/balances";
import { Balances } from "../api/balances/balances.interface";
import { createPaymentForAccount } from "../api/payments/payments";
import { CreatePaymentForAccount } from "../api/payments/payments.interface";
import BalancesList from "../components/BalancesList";
import FullScreenLoadingSpinner from "../components/FullScreenLoadingSpinner";
import FullScreenMessage from "../components/FullScreenMessage";
import Notification from "../components/Notification";
import ScreenWrapper from "../components/ScreenWrapper";
import { defaultConfig } from "../config/config";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import { SendStackParamList } from "../navigation/SendStack";
import { biometricValidation } from "../utils/biometric";
import { displayFiatAmount } from "../utils/currencies";
import { getPlatformOS } from "../utils/reactNative";
import { formatAmount } from "../utils/string";
import { validationCheck } from "../utils/validation/errors";

type Props = NativeStackScreenProps<SendStackParamList, "Send">;

function Send({ navigation, route }: Props) {
  const { data: balances, status: balancesStatus } = useBalances();

  const { mutate: createSend, isLoading: isCreatingPayment } = useMutation({
    mutationFn: createPaymentForAccount,
    onSuccess() {
      Toast.show({
        render: () => (
          <Notification
            message="Payment successful"
            variant="success"
            isToastNotification
          />
        ),
      });

      navigation
        .getParent<NavigationProp<PortfolioStackParamList>>()
        .reset({ index: 0, routes: [{ name: "Portfolio" }] });
    },
    onError(error) {
      Toast.show({
        render: () => (
          <Notification
            message={
              error instanceof AxiosError
                ? error.response?.data.Errors[0].Message
                : error
            }
            variant="error"
            isToastNotification
          />
        ),
      });
    },
  });

  const [selectedToken, setSelectedToken] = useState<Balances | undefined>();
  const [accountCode, setAccountCode] = useState<string | undefined>(
    route.params?.accountCode
  );
  const [amount, setAmount] = useState<string | undefined>(
    route.params?.amount?.toString()
  );
  const [message, setMessage] = useState<string | undefined>(
    route.params?.message
  );
  const [includePersonalInfo, setIncludePersonalInfo] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<"accountCode" | "amount" | "message", string | null>
  >({ accountCode: null, amount: null, message: null });

  // refs to jump between text fields
  const amountInput = useRef();
  const messageInput = useRef();

  useEffect(() => {
    if (balances != null && selectedToken == null) {
      setSelectedToken(balances.value[0]);
    }
  }, [balances?.value]);

  if (balancesStatus === "error") {
    return (
      <FullScreenMessage
        message="Please try again later"
        title="Cannot load balances"
      />
    );
  }

  if (balancesStatus === "loading" || selectedToken == null) {
    // TODO better skeleton
    return <FullScreenLoadingSpinner />;
  }

  const validateInput = (
    field?: Partial<Record<"accountCode" | "amount" | "message", string>>
  ): void | Record<"accountCode" | "amount" | "message", string> => {
    const CreatePaymentSchema = z.object({
      accountCode: z.string().trim().length(8, {
        message: "The account code must be exactly 8 characters long.",
      }),
      amount: z.coerce
        .number({ required_error: "Required", invalid_type_error: "Required" })
        .min(
          defaultConfig.minSendAmount,
          `Min: ${displayFiatAmount(defaultConfig.minSendAmount, {
            currency: selectedToken.tokenCode,
          })}`
        )
        .max(selectedToken.balance, {
          message: `Max: ${displayFiatAmount(selectedToken.balance, {
            currency: selectedToken.tokenCode,
          })}`,
        }),
      message: z
        .string()
        .trim()
        .max(defaultConfig.maxPaymentMessageLength, {
          message: `Max ${defaultConfig.maxPaymentMessageLength} characters allowed`,
        })
        .optional(),
    });

    return validationCheck(CreatePaymentSchema, {
      accountCode: field?.accountCode ?? accountCode,
      amount: field?.amount ?? amount,
      message: field?.message ?? message,
    });
  };

  const createPayment = async () => {
    const validationResult = validateInput();

    if (validationResult != null) {
      setValidationErrors(validationResult);
    } else {
      const biometricCheck = await biometricValidation();

      if (biometricCheck.result === "success") {
        if (accountCode != null && amount != null) {
          const payload: CreatePaymentForAccount = {
            toAccountCode: accountCode,
            amount: parseFloat(formatAmount(amount)),
            tokenCode: selectedToken.tokenCode,
            memo: message,
            options: {
              shareName: includePersonalInfo,
            },
          };

          createSend(payload);
        }
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
  };

  return (
    <ScreenWrapper flex={1}>
      <KeyboardAvoidingView
        behavior={getPlatformOS() === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={144}
        flex={1}
      >
        <ScrollView>
          <VStack space={2} flex={1} pb={4}>
            <BalancesList
              selectedToken={balances.value.find(
                ({ tokenCode }) => tokenCode === selectedToken.tokenCode
              )}
              setSelectedToken={setSelectedToken}
            />
            <FormControl
              isRequired
              isInvalid={validationErrors?.accountCode != null}
            >
              <FormControl.Label>
                Receiver&apos;s account code
              </FormControl.Label>
              <Input
                value={accountCode}
                onChangeText={(value) => {
                  setAccountCode(value);
                  if (validationErrors?.accountCode) {
                    checkValidationErrorsFor({ accountCode: value });
                  }
                }}
                accessibilityLabel="account code"
                // @ts-ignore it works, but it complains about the current property possibly undefined
                onSubmitEditing={() => amountInput.current.focus()}
                blurOnSubmit={false}
              />
              <FormControl.HelperText>
                The receiver can find it in their &quot;My account&quot; screen
              </FormControl.HelperText>
              <FormControl.ErrorMessage accessibilityLabel="account code error">
                {validationErrors?.accountCode}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={validationErrors?.amount != null}
            >
              <FormControl.Label>Amount</FormControl.Label>
              <Input
                value={amount}
                keyboardType="numeric"
                onChangeText={(value) => {
                  setAmount(value);

                  if (validationErrors?.amount) {
                    checkValidationErrorsFor({ amount: value });
                  }
                }}
                accessibilityLabel="amount"
                returnKeyType="next"
                ref={amountInput}
                // @ts-ignore it works, but it complains about the current property possibly undefined
                onSubmitEditing={() => messageInput.current.focus()}
                blurOnSubmit={false}
              />
              <FormControl.ErrorMessage accessibilityLabel="amount error">
                {validationErrors?.amount}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={validationErrors?.message != null}
            >
              <FormControl.Label>Message (optional)</FormControl.Label>
              <Input
                value={message}
                onChangeText={(value) => {
                  setMessage(value);

                  if (validationErrors?.message) {
                    checkValidationErrorsFor({ message: value });
                  }
                }}
                accessibilityLabel="message"
                ref={messageInput}
                blurOnSubmit={true}
              />
              <FormControl.ErrorMessage accessibilityLabel="message error">
                {validationErrors?.message}
              </FormControl.ErrorMessage>
            </FormControl>
            <VStack mt={4}>
              <FormControl.Label>Options</FormControl.Label>
              <Checkbox
                accessibilityLabel="share name with the payer"
                value="includePersonalInfo"
                isChecked={includePersonalInfo}
                onChange={() => setIncludePersonalInfo(!includePersonalInfo)}
              >
                <Text>Share your name with the payer</Text>
              </Checkbox>
            </VStack>
          </VStack>
        </ScrollView>
        <Button
          accessibilityLabel="send"
          onPress={createPayment}
          isDisabled={disablePayment() || isCreatingPayment}
          isLoading={isCreatingPayment}
          isLoadingText="Sending..."
        >
          Send
        </Button>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );

  function checkValidationErrorsFor(
    field: Partial<Record<"accountCode" | "amount" | "message", string>>
  ) {
    const validationResult = validateInput(field);
    if (validationResult) {
      setValidationErrors(validationResult);
    } else {
      setValidationErrors({ accountCode: null, amount: null, message: null });
    }
  }

  function disablePayment(): boolean {
    return Object.values(validationErrors).every((value) => value !== null);
  }
}

export default Send;
