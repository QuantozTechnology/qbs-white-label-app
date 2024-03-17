// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import {
  Button,
  Checkbox,
  FormControl,
  HStack,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  useToast,
  VStack,
} from "native-base";
import { useRef, useState } from "react";
import { createCustomer } from "../api/customer/customer";
import { CreateCustomerPayloadSchema } from "../api/customer/customer.interface";
import { APIError } from "../api/generic/error.interface";
import { AxiosError } from "axios";
import Notification from "../components/Notification";
import { useAuth } from "../auth/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { getPlatformOS } from "../utils/reactNative";
import { formatError } from "../utils/errors";
import ScreenWrapper from "../components/ScreenWrapper";
import { Masks, useMaskedInputProps } from "react-native-mask-input";
import { validationCheck } from "../utils/validation/errors";
import * as Linking from "expo-linking";
import CustomCountrySelect from "../components/CustomSelect";
import { defaultConfig } from "../config/config";
import { useAppState } from "../context/AppStateContext";

function ConsumerRegistration() {
  const auth = useAuth();
  const { setIsRegistered } = useAppState();

  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [dateOfBirth, setDateOfBirth] = useState<string>();
  const [country, setCountry] = useState<string>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [open, setOpen] = useState(false);

  const toast = useToast();
  const apiErrorToastId = "api-error-toast";

  // refs to jump between text fields
  const lastNameInput = useRef();
  const dateInput = useRef();

  const { mutate: createNewCustomer, isLoading: isCreatingCustomer } =
    useMutation({
      mutationFn: createCustomer,
      async onSuccess(registrationSuccess) {
        if (registrationSuccess) {
          setIsRegistered(true);
        }
      },
      onError(error) {
        const axiosError = error as AxiosError<APIError>;
        if (!toast.isActive(apiErrorToastId)) {
          toast.show({
            render: () => (
              <Notification
                message={formatError(axiosError)}
                variant="error"
                isToastNotification
              />
            ),
            id: apiErrorToastId,
          });
        }
      },
    });

  const onCreateAccountPress = async () => {
    const userSession = auth?.userSession;

    if (userSession != null) {
      const result = validationCheck(CreateCustomerPayloadSchema, {
        reference: userSession.objectId,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth,
        countryOfResidence: country,
        email: userSession.email,
        phone: userSession.phone,
      });

      if (result != null) {
        setErrors(result);
      } else {
        if (
          firstName != null &&
          lastName != null &&
          country != null &&
          dateOfBirth != null
        ) {
          const customerPayload = {
            reference: userSession.objectId,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth,
            countryOfResidence: country,
            email: userSession.email,
            phone: userSession.phone,
          };

          createNewCustomer(customerPayload);
        }
      }
    }
  };

  // passing props for masked input to NativeBase input
  const maskedInputProps = useMaskedInputProps({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    value: dateOfBirth!,
    onChangeText: setDateOfBirth,
    mask: Masks.DATE_DDMMYYYY,
  });

  return (
    <ScreenWrapper flex={1} accessibilityLabel="consumer registration screen">
      <KeyboardAvoidingView
        behavior={getPlatformOS() === "ios" ? "padding" : undefined}
        flex={1}
      >
        <ScrollView contentContainerStyle={{ justifyContent: "space-between" }}>
          <VStack space={3} flex={1}>
            <FormControl isRequired isInvalid={"firstName" in errors}>
              <VStack>
                <FormControl.Label>First name</FormControl.Label>
                <Input
                  value={firstName}
                  accessibilityLabel="first name"
                  aria-label="First name"
                  onChangeText={setFirstName}
                  returnKeyType="next"
                  // @ts-ignore it works, but it complains about the current property possibly undefined
                  onSubmitEditing={() => lastNameInput.current.focus()}
                  blurOnSubmit={false}
                />
                <FormControl.ErrorMessage accessibilityLabel="first name error">
                  {errors["firstName"]}
                </FormControl.ErrorMessage>
              </VStack>
            </FormControl>
            <FormControl isRequired isInvalid={"lastName" in errors}>
              <VStack>
                <FormControl.Label>Last name</FormControl.Label>
                <Input
                  value={lastName}
                  accessibilityLabel="last name"
                  aria-label="Last name"
                  onChangeText={setLastName}
                  ref={lastNameInput}
                  returnKeyType="next"
                  // @ts-ignore it works, but it complains about the current property possibly undefined
                  onSubmitEditing={() => dateInput.current.focus()}
                  blurOnSubmit={false}
                />
                <FormControl.ErrorMessage accessibilityLabel="last name error">
                  {errors["lastName"]}
                </FormControl.ErrorMessage>
              </VStack>
            </FormControl>
            <FormControl isRequired isInvalid={"dateOfBirth" in errors}>
              <FormControl.Label>Date of birth (DD/MM/YYYY)</FormControl.Label>
              <Input
                ref={dateInput}
                keyboardType="numeric"
                accessibilityLabel="date of birth"
                aria-label="Date of birth"
                {...maskedInputProps}
              />
              <FormControl.ErrorMessage accessibilityLabel="date of birth error">
                {errors["dateOfBirth"]}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={"countryOfResidence" in errors}>
              <FormControl.Label>Country of residence</FormControl.Label>
              <CustomCountrySelect
                country={country}
                setCountry={setCountry}
                open={open}
                setOpen={setOpen}
                hasValidationError={"countryOfResidence" in errors}
                accessibilityLabel="country of residence"
                aria-label="Country of residence"
              />
              <FormControl.ErrorMessage accessibilityLabel="country error">
                {errors["countryOfResidence"]}
              </FormControl.ErrorMessage>
            </FormControl>
          </VStack>
        </ScrollView>
        <FormControl isRequired isInvalid={"terms" in errors}>
          <HStack p={4} pl={0} space={2}>
            <Checkbox
              value="terms"
              isChecked={termsAccepted}
              onChange={handleCheckboxTermsPress}
              accessibilityLabel="terms checkbox"
              aria-label="Terms checkbox"
            />
            <Text>
              I accept the{" "}
              <Text color="primary.500" onPress={handleTermsPress}>
                terms and conditions
              </Text>
              .
            </Text>
          </HStack>
          <FormControl.ErrorMessage mt={-2} mb={4}>
            {errors["terms"]}
          </FormControl.ErrorMessage>
        </FormControl>
        <Button
          isLoading={isCreatingCustomer}
          isLoadingText="Creating account..."
          onPress={onCreateAccountPress}
          accessibilityLabel="create account"
          aria-label="Create account"
        >
          Create account
        </Button>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );

  function handleTermsPress() {
    Linking.openURL(defaultConfig.termsUrl);
  }

  function handleCheckboxTermsPress() {
    setTermsAccepted((prevValue) => {
      if (!prevValue) {
        const newErrors = { ...errors };
        delete newErrors["terms"];
        setErrors(newErrors);
      }

      return !termsAccepted;
    });
  }
}

export default ConsumerRegistration;
