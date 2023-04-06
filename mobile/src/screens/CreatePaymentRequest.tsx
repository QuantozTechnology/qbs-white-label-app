// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  Checkbox,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
  Select,
  Modal,
  KeyboardAvoidingView,
} from "native-base";
import { useBalances } from "../api/balances/balances";
import { Balances } from "../api/balances/balances.interface";
import BalancesList from "../components/BalancesList";
import FormControlSkeleton from "../components/FormControlSkeleton";
import FullScreenMessage from "../components/FullScreenMessage";
import ScreenWrapper from "../components/ScreenWrapper";
import { defaultConfig } from "../config/config";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { APIError } from "../api/generic/error.interface";
import { createPaymentRequest } from "../api/paymentrequest/paymentRequest";
import Notification from "../components/Notification";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  AddTimeIntervals,
  addTimeToDate,
  formatDateTime,
} from "../utils/dates";
import { getPlatformOS } from "../utils/reactNative";
import { formatAmount } from "../utils/string";
import { validationCheck } from "../utils/validation/errors";
import {
  CreatePaymentRequestPayload,
  CreatePaymentRequestPayloadSchema,
} from "../api/paymentrequest/paymentRequest.interface";

type Props = NativeStackScreenProps<
  PortfolioStackParamList,
  "CreatePaymentRequest"
>;

function PaymentRequest({ navigation }: Props) {
  const toast = useToast();
  const { status: balancesStatus, data: balances } = useBalances();

  const [selectedToken, setSelectedToken] = useState<Balances | undefined>(
    balances?.value[0]
  );
  const [amount, setAmount] = useState<string>("");
  const [canAmountBeChanged, setCanAmountBeChanged] = useState(false);
  const [includePersonalInfo, setIncludePersonalInfo] = useState(false);
  const [expiresOn, setExpiresOn] = useState<Date>();
  const [showIosDatePicker, setShowIosDatePicker] = useState(false);
  const [message, setMessage] = useState<string>();
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [oneOffPayment, setOneOffPayment] = useState(false);

  const {
    mutate: createNewPaymentRequest,
    isLoading: isCreatingPaymentRequest,
  } = useMutation({
    mutationFn: createPaymentRequest,
    onSuccess(response) {
      const { code } = response.value;

      navigation.navigate("SummaryPaymentRequest", {
        code,
      });
    },
    onError(error) {
      const axiosError = error as AxiosError<APIError>;

      if (!toast.isActive("create-paymentrequest-error"))
        toast.show({
          render: () => (
            <Notification
              message={
                axiosError.response?.data.Errors[0].Message ??
                axiosError.message
              }
              variant="error"
              isToastNotification
            />
          ),
          id: "create-paymentrequest-error",
        });
    },
  });

  useEffect(() => {
    if (balances != null && selectedToken == null) {
      setSelectedToken(balances.value[0]);
    }
  }, [balances]);

  if (balancesStatus === "error") {
    return (
      <FullScreenMessage
        title="Oops"
        message="An error occurred. Please try again later"
      />
    );
  }

  if (balancesStatus === "loading" || selectedToken == null) {
    return (
      <VStack p={4} space={2}>
        <FormControlSkeleton />
        <VStack>
          <FormControlSkeleton />
          <HStack space={2} alignItems="center">
            <Skeleton w="6" h="6" />
            <Skeleton w="48" h="4" />
          </HStack>
        </VStack>
        <FormControlSkeleton />
      </VStack>
    );
  }

  const handlePaymentRequestCreation = () => {
    const request: CreatePaymentRequestPayload = {
      tokenCode: selectedToken?.tokenCode ?? balances.value[0].tokenCode,
      amount: parseFloat(formatAmount(amount)),
      options: {
        shareName: includePersonalInfo,
        memo: message !== "" ? message : null,
        payerCanChangeRequestedAmount: canAmountBeChanged,
        expiresOn: expiresOn?.getTime(),
        isOneOffPayment: oneOffPayment,
      },
    };

    const result = validationCheck(CreatePaymentRequestPayloadSchema, request);

    if (result != null) {
      setErrors(result);
    } else {
      createNewPaymentRequest(request);
    }
  };

  return (
    <ScreenWrapper flex={1}>
      <KeyboardAvoidingView
        behavior={getPlatformOS() === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={144}
        flex={1}
      >
        <VStack flex={1}>
          <ScrollView>
            <BalancesList
              selectedToken={balances.value.find(
                ({ tokenCode }) => tokenCode === selectedToken.tokenCode
              )}
              setSelectedToken={setSelectedToken}
            />
            <VStack space={4}>
              <VStack space={2}>
                <FormControl isRequired isInvalid={errors["amount"] != null}>
                  {/* TODO change label with dynamically selected token */}
                  <FormControl.Label>
                    Amount ({defaultConfig.defaultStableCoin.code})
                  </FormControl.Label>
                  <Input
                    value={amount}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    accessibilityLabel="amount"
                  />
                  <FormControl.ErrorMessage accessibilityLabel="amount error">
                    {errors["amount"]}
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl>
                  <FormControl.Label>Message (optional)</FormControl.Label>
                  <Input
                    value={message}
                    onChangeText={setMessage}
                    accessibilityLabel="message"
                  />
                </FormControl>
                <FormControl.Label>Options</FormControl.Label>
                <VStack space={4}>
                  <Checkbox
                    accessibilityLabel="amount can be changed by payer"
                    value="amountCanBeChanged"
                    isChecked={canAmountBeChanged}
                    onChange={() => setCanAmountBeChanged(!canAmountBeChanged)}
                  >
                    <Text>Payer can change the amount</Text>
                  </Checkbox>
                  <Checkbox
                    accessibilityLabel="share name with the payer"
                    value="includePersonalInfo"
                    isChecked={includePersonalInfo}
                    onChange={() =>
                      setIncludePersonalInfo(!includePersonalInfo)
                    }
                  >
                    <Text>Share your name with the payer</Text>
                  </Checkbox>
                  <Checkbox
                    accessibilityLabel="one-off payment"
                    value="oneOffPayment"
                    isChecked={oneOffPayment}
                    onChange={() => setOneOffPayment(!oneOffPayment)}
                  >
                    <Text>One-off payment</Text>
                  </Checkbox>
                  <FormControl>
                    <FormControl.Label>Expiration date</FormControl.Label>

                    <Select
                      defaultValue="doesNotExpire"
                      onValueChange={handleExpirationDateChange}
                      accessibilityLabel="expiration date"
                    >
                      <Select.Item label="Never" value="doesNotExpire" />
                      <Select.Item label="15 minutes" value="fifteenMinutes" />
                      <Select.Item label="60 minutes" value="sixtyMinutes" />
                      <Select.Item label="1 day" value="oneDay" />
                      <Select.Item
                        label={
                          expiresOn != null
                            ? formatDateTime(expiresOn.getTime())
                            : "Select date..."
                        }
                        value="custom"
                      />
                    </Select>
                  </FormControl>
                </VStack>
              </VStack>
            </VStack>
          </ScrollView>
        </VStack>
        <Button
          isDisabled={isCreatingPaymentRequest}
          accessibilityLabel="create payment request"
          onPress={handlePaymentRequestCreation}
          isLoading={isCreatingPaymentRequest}
          isLoadingText="Creating payment request..."
        >
          Create request
        </Button>
      </KeyboardAvoidingView>
      <Modal isOpen={showIosDatePicker}>
        <Modal.Content>
          <Modal.Body>
            <DateTimePicker
              testID="dateTimePicker"
              value={expiresOn ?? new Date()}
              display="inline"
              onChange={onExpirationDateChange}
              minimumDate={new Date()}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </ScreenWrapper>
  );

  function handleAmountChange(value: string) {
    setAmount(value);
    setErrors({ ...errors, amount: undefined });
  }

  function onExpirationDateChange(
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) {
    if (selectedDate) {
      const currentDate = new Date(selectedDate.setHours(23, 59, 59, 999));
      setExpiresOn(currentDate);

      if (Platform.OS === "ios") {
        setShowIosDatePicker(false);
      }
    }
  }

  function handleExpirationDateChange(value: string) {
    if (
      value === AddTimeIntervals.FifteenMinutes ||
      value === AddTimeIntervals.SixtyMinutes ||
      value === AddTimeIntervals.OneDay
    ) {
      setExpiresOn(addTimeToDate(value));
      return;
    }

    if (value === "custom") {
      if (Platform.OS === "android") {
        DateTimePickerAndroid.open({
          testID: "dateTimePicker",
          value: expiresOn ?? new Date(),
          onChange: onExpirationDateChange,
          minimumDate: new Date(),
        });
      } else {
        setShowIosDatePicker(true);
      }
    } else {
      setExpiresOn(undefined);
    }
  }
}

export default PaymentRequest;
