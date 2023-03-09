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
  Select,
  Text,
  Toast,
  VStack,
} from "native-base";
import { getPlatformOS } from "../utils/reactNative";
import { z } from "zod";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createMerchant } from "../api/customer/merchant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RegistrationStackParamList } from "../navigation/RegistrationTopTabsStack";
import { AxiosError } from "axios";
import { APIError, ApiErrorCode } from "../api/generic/error.interface";
import Notification from "../components/Notification";
import countries from "../utils/world.json";
import { createAccount } from "../api/account/account";
import {
  BusinessRegistrationSchema,
  BusinessRegistrationSchemaKeys,
} from "../utils/validation/schemas";
import { formatError } from "../utils/errors";
import ScreenWrapper from "../components/ScreenWrapper";
import * as Linking from "expo-linking";
import { useCustomerState } from "../context/CustomerContext";

type Props = NativeStackScreenProps<RegistrationStackParamList, "Business">;

function BusinessRegistration({ navigation }: Props) {
  const customerContext = useCustomerState();

  const [companyName, setCompanyName] = useState<string | undefined>();
  const [contactPersonFullName, setContactPersonFullName] = useState<
    string | undefined
  >();
  const [businessEmail, setBusinessEmail] = useState<string | undefined>();
  const [countryOfRegistration, setCountryOfRegistration] = useState<
    string | undefined
  >();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const contactPersonFullNameInput = useRef();
  const businessEmailInput = useRef();
  const countryOfRegistrationInput = useRef();

  const {
    mutate: createNewBusinessAccount,
    isLoading: isCreatingBusinessAccount,
  } = useMutation({
    mutationFn: createAccount,
    onSuccess() {
      navigation.navigate("Feedback", {
        title: "Account created!",
        description:
          "We will contact you to ask for more information to complete the business registration. You will not be able to access the app, expect an email from ur support team.",
        variant: "success",
        button: {
          caption: "Done",
          callback: () => customerContext?.refresh(),
        },
      });
    },
    onError(error) {
      const axiosError = error as AxiosError<APIError>;

      if (axiosError.response && axiosError.response.status === 400) {
        const { Code } = axiosError.response.data.Errors[0];

        if (Code === ApiErrorCode.InvalidStatus) {
          customerContext?.refresh();
          return;
        }

        if (Code === ApiErrorCode.CustomerNotActive) {
          customerContext?.refresh();
          return;
        }
      }
    },
  });

  const {
    mutate: createNewBusinessCustomer,
    isLoading: isCreatingBusinessCustomer,
  } = useMutation({
    mutationFn: createMerchant,
    onSuccess() {
      createNewBusinessAccount();
    },
    onError(error) {
      const axiosError = error as AxiosError<APIError>;

      // If customer already exists in Nexus but not account, try to create an account
      if (
        axiosError.response?.data.Errors[0].Code ===
        ApiErrorCode.ExistingProperty
      ) {
        createNewBusinessAccount();
      } else {
        customerContext?.refresh();
        Toast.show({
          render: () => (
            <Notification message={formatError(axiosError)} variant="error" />
          ),
          id: "error-create-merchant",
        });
      }
    },
  });

  async function onCreateAccountPress() {
    try {
      validateFormData();

      if (
        businessEmail &&
        companyName &&
        contactPersonFullName &&
        countryOfRegistration
      ) {
        // call API to create merchant
        createNewBusinessCustomer({
          email: businessEmail,
          companyName,
          contactPersonFullName,
          countryOfRegistration,
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = err.issues.map((issue) => {
          return { [issue.path[0]]: issue.message };
        });
        setErrors(Object.assign({}, ...validationErrors));
      }
    }
  }

  // simplify countries object
  const minimalCountriesList = countries
    .map(({ name }) => ({ name }))
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  return (
    <KeyboardAvoidingView
      behavior={getPlatformOS() === "ios" ? "padding" : undefined}
      flex={1}
    >
      <ScreenWrapper flex={1}>
        <ScrollView contentContainerStyle={{ justifyContent: "space-between" }}>
          <VStack space={3} flex={1}>
            <FormControl isRequired isInvalid={"companyName" in errors}>
              <VStack>
                <FormControl.Label>Company name</FormControl.Label>
                <Input
                  value={companyName}
                  accessibilityLabel="company name"
                  onChangeText={(value) => {
                    setCompanyName(value);
                    validateInput("companyName", value);
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    // @ts-ignore it works, but it complains about the current property possibly undefined
                    contactPersonFullNameInput.current.focus()
                  }
                  blurOnSubmit={false}
                />
                <FormControl.ErrorMessage accessibilityLabel="company name error">
                  {errors["companyName"]}
                </FormControl.ErrorMessage>
              </VStack>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={"contactPersonFullName" in errors}
            >
              <VStack>
                <FormControl.Label>Contact person full name</FormControl.Label>
                <Input
                  value={contactPersonFullName}
                  ref={contactPersonFullNameInput}
                  accessibilityLabel="contact person full name"
                  onChangeText={(value) => {
                    setContactPersonFullName(value);
                    validateInput("contactPersonFullName", value);
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    // @ts-ignore it works, but it complains about the current property possibly undefined
                    businessEmailInput.current.focus()
                  }
                  blurOnSubmit={false}
                />
                <FormControl.ErrorMessage accessibilityLabel="contact person full name error">
                  {errors["contactPersonFullName"]}
                </FormControl.ErrorMessage>
              </VStack>
            </FormControl>
            <FormControl isRequired isInvalid={"email" in errors}>
              <VStack>
                <FormControl.Label>Business email</FormControl.Label>
                <Input
                  value={businessEmail}
                  ref={businessEmailInput}
                  accessibilityLabel="business email"
                  onChangeText={(value) => {
                    setBusinessEmail(value);
                    validateInput("email", value);
                  }}
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    // @ts-ignore it works, but it complains about the current property possibly undefined
                    countryOfRegistrationInput.current.focus()
                  }
                  blurOnSubmit={false}
                />
                <FormControl.ErrorMessage accessibilityLabel="business email error">
                  {errors["email"]}
                </FormControl.ErrorMessage>
              </VStack>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={"countryOfRegistration" in errors}
            >
              <VStack>
                <FormControl.Label>Country of registration</FormControl.Label>
                <Select
                  accessibilityLabel="country of registration"
                  placeholder="Select country"
                  onValueChange={(value) => {
                    setCountryOfRegistration(value);
                    validateInput("countryOfRegistration", value);
                  }}
                  selectedValue={countryOfRegistration}
                >
                  {minimalCountriesList.map(({ name }) => (
                    <Select.Item key={name} label={name} value={name} />
                  ))}
                </Select>
                <FormControl.ErrorMessage accessibilityLabel="country of registration error">
                  {errors["countryOfRegistration"]}
                </FormControl.ErrorMessage>
              </VStack>
            </FormControl>
          </VStack>
        </ScrollView>
        <FormControl isRequired isInvalid={"terms" in errors}>
          <HStack p={4} pl={0} space={2}>
            <Checkbox
              value="terms"
              isChecked={termsAccepted}
              onChange={(value) => {
                setTermsAccepted(value);
                validateInput("terms", value);
              }}
              accessibilityLabel="terms checkbox"
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
          isLoading={isCreatingBusinessCustomer || isCreatingBusinessAccount}
          isLoadingText="Creating business account..."
          onPress={onCreateAccountPress}
          accessibilityLabel="create account"
        >
          Create business account
        </Button>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );

  function handleTermsPress() {
    Linking.openURL("https://quantozpay.com/terms");
  }

  // It accepts an input such as {companyName: aString} to allow checking the value on text change
  function validateFormData(input?: { [key: string]: string | boolean }) {
    return BusinessRegistrationSchema.parse({
      companyName,
      contactPersonFullName,
      email: businessEmail,
      countryOfRegistration,
      terms: termsAccepted,
      ...input,
    });
  }

  async function validateInput(
    fieldId: z.infer<typeof BusinessRegistrationSchemaKeys>,
    value: string | boolean
  ) {
    try {
      validateFormData({ [fieldId]: value });
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = err.issues
          .map((issue) => {
            return { [issue.path[0]]: issue.message };
          })
          .filter((field) => {
            return Object.keys(field)[0] === fieldId;
          });
        setErrors(Object.assign({}, ...validationErrors));
      }
    }
  }
}

export default BusinessRegistration;
