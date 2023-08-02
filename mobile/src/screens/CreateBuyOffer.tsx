// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { NavigationProp } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  FormControl,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ScrollView,
  Select,
  Text,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { z } from "zod";
import { useBalances } from "../api/balances/balances";
import { CreateOfferPayload } from "../api/offers/offers.interface";
import { getAvailableTokens, getOwnedTokens } from "../api/tokens/tokens";
import { Tokens } from "../api/tokens/tokens.interface";
import ScreenWrapper from "../components/ScreenWrapper";
import { defaultConfig } from "../config/config";
import {
  AddTimeIntervals,
  addTimeToDate,
  formatDateTime,
} from "../utils/dates";
import { validationCheck } from "../utils/validation/errors";
import { OffersStackParamList } from "../navigation/OffersStack";
import { CreateBuyOfferStackParamList } from "../navigation/CreateBuyOfferStack";
import CustomButtonSelect from "../components/CustomButtonSelect";

type Props = NativeStackScreenProps<
  CreateBuyOfferStackParamList,
  "CreateBuyOffer"
>;

function CreateBuyOffer({ navigation, route }: Props) {
  const queryClient = useQueryClient();
  const [selectedToken, setSelectedToken] = useState<Tokens | undefined>();
  const [amount, setAmount] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [includePersonalInfo, setIncludePersonalInfo] = useState(false);
  const [canAmountBeChanged, setCanAmountBeChanged] = useState(false);
  const [oneOffPayment, setOneOffPayment] = useState(false);
  const [expiresOn, setExpiresOn] = useState<Date | null>(null);
  const [showIosDatePicker, setShowIosDatePicker] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string | undefined;
  }>({});

  const { data: balances, status: balancesStatus } = useBalances();
  // ref to focus the amount input once the user has selected a token

  useEffect(() => {
    // Prefetch the owned tokens which the user can select, since it's most likely to happen every time
    async function prefetchOwnedTokens() {
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["owned_tokens"],
        queryFn: getOwnedTokens,
      });
    }

    async function prefetchAvailableTokens() {
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["available_tokens"],
        queryFn: getAvailableTokens,
      });
    }

    prefetchOwnedTokens();
    prefetchAvailableTokens();
  }, []);

  useEffect(() => {
    if (selectedToken != null) {
      // remove validation error if present
      setValidationErrors({ ...validationErrors, selectedToken: undefined });
    }
  }, [selectedToken]);

  useEffect(() => {
    if (route.params?.token != null) {
      setSelectedToken(route.params.token);
    }
  }, [route.params]);

  const CreateBuyOfferSchema = z
    .object({
      selectedToken: z.string({ required_error: "Select an asset" }),
      amount: z
        .string({ required_error: "Amount is required" })
        .trim()
        .min(1, "Amount is required"),
      price: z
        .string({ required_error: "Price is required" })
        .trim()
        .min(1, "Price is required"),
    })
    .refine(
      (data) => {
        const { amount, price } = data || {};

        if (amount == null || price == null) {
          return false;
        }

        const availableBalance = balances?.value.filter(
          ({ tokenCode }) => tokenCode === defaultConfig.defaultStableCoin.code
        )[0].balance;

        if (availableBalance == null) {
          return false;
        }

        return parseFloat(amount) * parseFloat(price) <= availableBalance;
      },
      {
        message: "Insufficient balance",
        path: ["price"],
      }
    );

  return (
    <ScreenWrapper flex={1} space={4}>
      <ScrollView>
        <FormControl isInvalid={validationErrors["selectedToken"] != null}>
          <FormControl.Label>Asset</FormControl.Label>
          <CustomButtonSelect
            value={selectedToken}
            valueCustomText={`${selectedToken?.name} (${selectedToken?.code})`}
            onPressCallback={handleTokenPress}
          />
          <FormControl.ErrorMessage accessibilityLabel="select token error">
            {validationErrors["selectedToken"]}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          isReadOnly={selectedToken == null}
          isInvalid={validationErrors["amount"] != null}
        >
          <FormControl.Label>Amount</FormControl.Label>
          <Input
            accessibilityLabel="amount"
            type="text"
            value={amount}
            keyboardType="numeric"
            onChangeText={(value) => {
              setAmount(value);

              const result = validationCheck(CreateBuyOfferSchema, {
                selectedToken,
                amount: value,
                price,
              });

              if (result != null && result["amount"] != null) {
                setValidationErrors({
                  ...validationErrors,
                  amount: result["amount"],
                });
              } else {
                setValidationErrors({ ...validationErrors, amount: undefined });
              }
            }}
          />
          <FormControl.ErrorMessage accessibilityLabel="amount error">
            {validationErrors["amount"]}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          isReadOnly={selectedToken == null}
          isInvalid={validationErrors["price"] != null}
        >
          <FormControl.Label>Price</FormControl.Label>
          <InputGroup>
            <Input
              accessibilityLabel="price"
              type="text"
              value={price}
              keyboardType="numeric"
              onChangeText={(value) => {
                setPrice(value);

                const result = validationCheck(CreateBuyOfferSchema, {
                  selectedToken,
                  amount,
                  price: value,
                });

                if (result != null && result["price"] != null) {
                  setValidationErrors({
                    ...validationErrors,
                    price: result["price"],
                  });
                } else {
                  setValidationErrors({
                    ...validationErrors,
                    price: undefined,
                  });
                }
              }}
              // isDisabled={selectedToken == null}
              flex={1}
            />
            <InputRightAddon>
              {`${selectedToken?.code ?? "-"}/${
                defaultConfig.defaultStableCoin.code
              }`}
            </InputRightAddon>
          </InputGroup>
          <FormControl.HelperText
            isInvalid={balancesStatus === "error"}
            accessibilityLabel="balance"
          >
            {`Balance: ${
              balancesStatus === "error"
                ? "Error getting the balance!"
                : balancesStatus === "loading"
                ? "Loading..."
                : balances.value.filter(
                    (b) => b.tokenCode === defaultConfig.defaultStableCoin.code
                  )[0].balance
            } ${defaultConfig.defaultStableCoin.code}`}
          </FormControl.HelperText>
          <FormControl.ErrorMessage accessibilityLabel="price error">
            {validationErrors["price"]}
          </FormControl.ErrorMessage>
        </FormControl>
        <VStack space={4} mt={4}>
          <FormControl.Label>Options</FormControl.Label>
          <Checkbox
            accessibilityLabel="amount can be changed by payer"
            value="amountCanBeChanged"
            isChecked={canAmountBeChanged}
            onChange={() => setCanAmountBeChanged(!canAmountBeChanged)}
          >
            <Text>Allow seller to change quantity</Text>
          </Checkbox>
          <Checkbox
            accessibilityLabel="one-off payment"
            value="oneOffPayment"
            isChecked={oneOffPayment}
            onChange={() => setOneOffPayment(!oneOffPayment)}
          >
            <Text>One-off payment</Text>
          </Checkbox>
          <Checkbox
            accessibilityLabel="share name with the payer"
            value="includePersonalInfo"
            isChecked={includePersonalInfo}
            onChange={() => setIncludePersonalInfo(!includePersonalInfo)}
          >
            <Text>Share your name</Text>
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
      </ScrollView>
      <Button accessibilityLabel="review" onPress={handleReviewPress}>
        Review
      </Button>
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

  function handleTokenPress() {
    navigation
      .getParent<NavigationProp<OffersStackParamList>>()
      .navigate("TokensOverview", { sourceScreen: "CreateBuyOffer" });
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
      setExpiresOn(null);
    }
  }

  function handleReviewPress() {
    const result = validationCheck(CreateBuyOfferSchema, {
      selectedToken: selectedToken?.code,
      amount,
      price,
    });

    if (result != null) {
      setValidationErrors(result);
    } else {
      if (amount != null && price != null && selectedToken != null) {
        const payload: CreateOfferPayload = {
          action: "Buy",
          sourceToken: {
            tokenCode: defaultConfig.defaultStableCoin.code,
            amount: (parseFloat(amount) * parseFloat(price)).toString(),
          },
          destinationToken: {
            tokenCode: selectedToken?.code,
            amount: amount,
          },
          pricePerUnit: parseFloat(price),
          options: {
            expiresOn: expiresOn?.getTime() ?? null,
            shareName: includePersonalInfo,
            isOneOffPayment: oneOffPayment,
            payerCanChangeRequestedAmount: canAmountBeChanged,
            memo: null,
            params: null,
          },
          offerCode: null,
        };

        navigation
          .getParent<NavigationProp<OffersStackParamList>>()
          .navigate("ReviewCreatedOffer", { offer: payload });
      }
    }
  }
}

export default CreateBuyOffer;
