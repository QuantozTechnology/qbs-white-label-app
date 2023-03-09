// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import Feedback from "../screens/Feedback";
import { ImageIdentifier } from "../utils/images";
import AppBottomTabNavigator from "./AppBottomTab";
import RegistrationTopTabsStack from "./RegistrationTopTabsStack";
import * as WebBrowser from "expo-web-browser";
import SignIn from "../screens/SignIn";
import { useAuth } from "../auth/AuthContext";
import { useCustomerState } from "../context/CustomerContext";
import FullScreenLoadingSpinner from "../components/FullScreenLoadingSpinner";
import CreateAccount from "../screens/CreateAccount";
import { biometricValidation } from "../utils/biometric";
import FullScreenMessage from "../components/FullScreenMessage";
import { useCustomer } from "../api/customer/customer";

export type WelcomeStackParamList = {
  Home: undefined;
  RegistrationStack: undefined;
  AppStack: undefined;
  Feedback: FeedbackProps;
  SignIn: undefined;
  CreateAccount: undefined;
};

type FeedbackButtonProps = {
  caption: string;
  // TODO make it more strict, only existing screens in navigator(s) allowed?
  destinationScreen?: string;
  callback?: () => void;
};

export type FeedbackProps = {
  title: string;
  variant: "loading" | "success" | "error";
  button?: FeedbackButtonProps;
  description?: string;
  illustration?: ImageIdentifier;
  showFeedbackIcon?: boolean;
};

const WelcomeStack = createNativeStackNavigator<WelcomeStackParamList>();

export type CustomerStatus = {
  result: "success" | "register" | "error" | "underReview";
  message?: string;
};

export default function WelcomeStackNavigator() {
  const auth = useAuth();
  const customerContext = useCustomerState();

  const [isBiometricCheckPassed, setIsBiometricCheckPassed] = useState<
    boolean | undefined
  >();
  const [retryBiometric, setRetryBiometric] = useState<boolean | undefined>();

  const { data: customer } = useCustomer({
    enabled: auth?.userSession !== null,
  });

  useEffect(() => {
    WebBrowser.warmUpAsync();

    // check biometric
    async function checkBiometric() {
      setIsBiometricCheckPassed(undefined);
      const biometricCheck = await biometricValidation();

      if (biometricCheck.result === "success") {
        setIsBiometricCheckPassed(true);
      } else {
        setIsBiometricCheckPassed(false);
      }
    }

    if (
      auth?.userSession !== null &&
      (typeof isBiometricCheckPassed === "undefined" || retryBiometric)
    ) {
      checkBiometric();
    }

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, [auth?.userSession, retryBiometric]);

  if (auth?.isLoading) {
    return <FullScreenLoadingSpinner />;
  }

  if (auth?.userSession === null && !auth.isLoading) {
    return (
      <WelcomeStack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <WelcomeStack.Screen name="SignIn" component={SignIn} />
      </WelcomeStack.Navigator>
    );
  }

  if (
    customerContext?.isLoading ||
    typeof isBiometricCheckPassed === "undefined"
  ) {
    return <FullScreenLoadingSpinner />;
  }

  if (!isBiometricCheckPassed) {
    return (
      <FullScreenMessage
        title="Biometric check error"
        message="Please try again"
        actionButton={{
          label: "Biometric check",
          callback: () => setRetryBiometric(true),
        }}
      />
    );
  }

  return (
    <WelcomeStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      {renderCorrectStack()}
    </WelcomeStack.Navigator>
  );

  function renderCorrectStack() {
    if (customerContext?.requiresCustomer) {
      return (
        <>
          <WelcomeStack.Screen
            options={{
              title: "Complete registration",
              headerShown: true,
              headerBackVisible: false,
            }}
            name="RegistrationStack"
            component={RegistrationTopTabsStack}
          />
          <WelcomeStack.Screen name="Feedback" component={Feedback} />
        </>
      );
    }
    if (customerContext?.isUnderReview) {
      return (
        <WelcomeStack.Screen
          name="Feedback"
          component={Feedback}
          initialParams={{
            title: "Account under review",
            description: customer?.data.value.isBusiness
              ? "Your business account is being reviewed by our compliance team. You will be notified when you'll be able to access it."
              : "Our operators are checking your account details. We will let you know when you can access it.",
            illustration: ImageIdentifier.Find,
          }}
        />
      );
    }

    if (customerContext?.requiresAccount) {
      return (
        <>
          <WelcomeStack.Screen name="CreateAccount" component={CreateAccount} />
          <WelcomeStack.Screen name="Feedback" component={Feedback} />
        </>
      );
    }

    if (customerContext?.error) {
      return (
        <WelcomeStack.Screen
          name="Feedback"
          component={Feedback}
          initialParams={{
            title: "Login error",
            description: "Sorry for the inconvenience, please try again later",

            illustration: ImageIdentifier.Find,
          }}
        />
      );
    }

    return (
      <WelcomeStack.Screen name="AppStack" component={AppBottomTabNavigator} />
    );
    // }
  }
}
