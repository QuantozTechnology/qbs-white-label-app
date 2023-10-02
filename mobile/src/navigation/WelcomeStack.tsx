// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
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
import FullScreenMessage from "../components/FullScreenMessage";
import { useCustomer } from "../api/customer/customer";
import { Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useDeviceVerification } from "../utils/hooks/useDeviceVerification";
import { useBiometricValidation } from "../utils/hooks/useBiometricValidation";
import { useDeviceHasScreenLock } from "../utils/hooks/useDeviceHasScreenLock";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import ConfirmDevice from "../screens/ConfirmDevice";

export type WelcomeStackParamList = {
  Home: undefined;
  RegistrationStack: undefined;
  AppStack: undefined;
  Feedback: FeedbackProps;
  SignIn: undefined;
  CreateAccount: undefined;
  ConfirmDevice: undefined;
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
  const {
    setupAndVerifyDeviceSecurity,
    error: deviceVerificationError,
    isLoading: isVerifyingDevice,
    deviceConflict,
  } = useDeviceVerification();
  const {
    hasScreenLockMechanism,
    isLoading: isCheckingScreenLockMechanism,
    error: screenLockMechanismError,
  } = useDeviceHasScreenLock();
  const {
    isBiometricCheckPassed,
    triggerRetry,
    error: biometricCheckError,
    isLoading: isCheckingBiometric,
  } = useBiometricValidation();

  const { data: customer } = useCustomer({
    enabled: auth?.userSession !== null,
  });

  useEffect(() => {
    WebBrowser.warmUpAsync();
    (async () => await setupAndVerifyDeviceSecurity())();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  if (auth?.isLoading) {
    return <FullScreenLoadingSpinner />;
  }

  // if no user session exists, show sign in screen
  if (auth?.userSession === null && !auth.isLoading) {
    return (
      <WelcomeStack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <WelcomeStack.Screen name="SignIn" component={SignIn} />
      </WelcomeStack.Navigator>
    );
  }

  // TODO customer context checks?

  if (screenLockMechanismError) {
    return (
      <WelcomeStack.Navigator>
        {showGenericErrorScreen()}
      </WelcomeStack.Navigator>
    );
  }

  if (isCheckingScreenLockMechanism) {
    return (
      <FullScreenLoadingSpinner
        message="Checking screen lock mechanism..."
        showLoginAgainButton={false}
      />
    );
  }

  if (!hasScreenLockMechanism) {
    return (
      <WelcomeStack.Navigator>
        <WelcomeStack.Screen
          name="Feedback"
          component={Feedback}
          initialParams={{
            title: "Security issue",
            description: `Your device has no security measures set up (pin, passcode or fingerprint/faceID).
Please enable one of these to be able to use the app.`,
          }}
        />
      </WelcomeStack.Navigator>
    );
  }

  if (biometricCheckError) {
    return (
      <WelcomeStack.Navigator>
        {showGenericErrorScreen()}
      </WelcomeStack.Navigator>
    );
  }

  if (isCheckingBiometric) {
    return (
      <FullScreenLoadingSpinner
        message="Checking biometric security..."
        showLoginAgainButton={false}
      />
    );
  }

  if (!isBiometricCheckPassed) {
    return (
      <FullScreenMessage
        title="Biometric check error"
        message="Please try again"
        actionButton={{
          label: "Try again",
          callback: triggerRetry,
        }}
      />
    );
  }

  if (deviceConflict) {
    return (
      <WelcomeStack.Navigator>
        {showConfirmDeviceScreens()}
      </WelcomeStack.Navigator>
    );
  }

  if (deviceVerificationError) {
    return (
      <WelcomeStack.Navigator>
        {showGenericErrorScreen()}
      </WelcomeStack.Navigator>
    );
  }

  if (isVerifyingDevice) {
    return (
      <FullScreenLoadingSpinner
        message="Verifying device, it could take up to 1 minute..."
        showLoginAgainButton={false}
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

    generateKeyPair();

    return (
      <WelcomeStack.Screen name="AppStack" component={AppBottomTabNavigator} />
    );
  }

  function showConfirmDeviceScreens() {
    return (
      <>
        <WelcomeStack.Screen
          name="ConfirmDevice"
          component={ConfirmDevice}
          options={{
            title: "Confirm device",
            header: (props) => (
              <CustomNavigationHeader
                {...props}
                customIcon={
                  <Icon
                    as={Ionicons}
                    name="close"
                    size="xl"
                    color="primary.500"
                  />
                }
              />
            ),
          }}
        />
        <WelcomeStack.Screen name="Feedback" component={Feedback} />
        <WelcomeStack.Screen
          name="AppStack"
          component={AppBottomTabNavigator}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </>
    );
  }

  function showGenericErrorScreen() {
    return (
      <WelcomeStack.Screen
        name="Feedback"
        component={Feedback}
        initialParams={{
          title: "Oops",
          description: `Something went wrong. Please close the app and try again later.`,
          illustration: ImageIdentifier.Find,
        }}
      />
    );
  }

  async function generateKeyPair() {
    const { public: pubKey, private: privKey } = await RSA.generateKeys(256);
    console.log("public key: ", pubKey);
    console.log("private key: ", privKey);
  }
}
