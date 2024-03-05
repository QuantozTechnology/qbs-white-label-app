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
import FullScreenMessage from "../components/FullScreenMessage";
import { useCustomer } from "../api/customer/customer";
import { Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useDeviceVerification } from "../utils/hooks/useDeviceVerification";
import { useBiometricValidation } from "../utils/hooks/useBiometricValidation";
import { useDeviceHasScreenLock } from "../utils/hooks/useDeviceHasScreenLock";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import ConfirmDevice from "../screens/ConfirmDevice";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isNil } from "lodash";

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
  const { data: customer } = useCustomer({
    enabled: auth?.userSession !== null,
  });
  const customerContext = useCustomerState();
  // We must perform verification in order to display related loading screens.
  // First, biometrics, then verifyDevice, and finally screenLock.
  const [currentOperation, setCurrentOperation] =
    useState("checkingBiometrics");
  // By using shouldVerify, we can run useDeviceVerification and useDeviceHasScreenLock manually and have more control over them.
  const [shouldVerifyDevice, setShouldVerifyDevice] = useState(false);
  const [shouldCheckScreenLockMechanism, setShouldCheckScreenLockMechanism] =
    useState(false);
  const [oid, setOid] = useState<string | null>(null);

  const {
    isBiometricCheckPassed,
    triggerRetry,
    error: biometricCheckError,
    isLoading: isCheckingBiometric,
  } = useBiometricValidation();

  const {
    error: deviceVerificationError,
    isLoading: isVerifyingDevice,
    deviceVerified,
    deviceConflict,
  } = useDeviceVerification(shouldVerifyDevice);

  const {
    hasScreenLockMechanism,
    error: screenLockMechanismError,
    isLoading: isCheckingScreenLockMechanism,
  } = useDeviceHasScreenLock(shouldCheckScreenLockMechanism);

  /*
   * This is the last step of the verification process.
   * It checks if the oid is stored in the SecureStore and applies the necessary logic.
   */
  const checkOid = async () => {
    if (isNil(oid)) {
      const customerId = await SecureStore.getItemAsync("oid");
      const pubKeyFromStore = await SecureStore.getItemAsync(
        customerId + "_publicKey"
      );

      if (isNil(customerId)) {
        if (!isNil(auth?.userSession)) {
          // something is wrong, logout
          auth.logout();
        }
        setCurrentOperation("done");
        return false;
      } else {
        if (!isNil(auth?.userSession)) {
          // logout if there is no phone or email in userSession
          if (isNil(auth.userSession.phone) || isNil(auth.userSession.email)) {
            //auth.logout();
          }
        }
        const isDeviceRegistered = await AsyncStorage.getItem(
          customerId + "_deviceRegistered"
        );
        if (isNil(pubKeyFromStore) && isDeviceRegistered) {
          // something is wrong, remove deviceRegistered and oid
          await AsyncStorage.removeItem(customerId + "_deviceRegistered");
          await SecureStore.deleteItemAsync("oid");
          checkOid();
        } else {
          // set oid and start device verification process
          setOid(customerId);
          setShouldVerifyDevice(true);
          setCurrentOperation("verifyingDevice");
          return customerId;
        }
      }
    } else {
      if (!shouldVerifyDevice) {
        setShouldVerifyDevice(true);
        setCurrentOperation("verifyingDevice");
      }
      return oid;
    }
  };

  useEffect(() => {
    if (!isCheckingBiometric) {
      if (biometricCheckError) {
        setCurrentOperation("done");
      } else if (isBiometricCheckPassed) {
        setShouldCheckScreenLockMechanism(true);
        setCurrentOperation("checkingScreenLock");
      }
    }
  }, [isCheckingBiometric, isBiometricCheckPassed, biometricCheckError]);

  useEffect(() => {
    if (
      isBiometricCheckPassed &&
      hasScreenLockMechanism &&
      shouldVerifyDevice
    ) {
      if (!isVerifyingDevice) {
        // doesn't matter if there is an error or not
        setCurrentOperation("done");
      }
    }
  }, [isVerifyingDevice]);

  useEffect(() => {
    if (
      currentOperation === "checkingScreenLock" &&
      !isCheckingScreenLockMechanism
    ) {
      if (hasScreenLockMechanism || screenLockMechanismError) {
        checkOid();
      }
    }
  }, [
    shouldCheckScreenLockMechanism,
    isCheckingScreenLockMechanism,
    hasScreenLockMechanism,
    screenLockMechanismError,
  ]);

  useEffect(() => {
    if (deviceVerified) {
      AsyncStorage.setItem("deviceVerified", "true");
    }
  }, [deviceVerified]);

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  if (currentOperation !== "done") {
    let message = "Loading...";
    switch (currentOperation) {
      case "checkingBiometrics":
        message = "Checking biometric security...";
        break;
      case "verifyingDevice":
        message = "Verifying device, it could take up to 1 minute...";
        break;
      case "checkingScreenLock":
        message = "Checking screen lock mechanism...";
        break;
    }
    return <FullScreenLoadingSpinner message={message} />;
  }

  if (auth?.isLoading) {
    return <FullScreenLoadingSpinner />;
  }

  if (currentOperation === "done") {
    if (biometricCheckError) {
      return (
        <WelcomeStack.Navigator>
          {showGenericErrorScreen(
            "Cannot verify your biometric security. Please try again later"
          )}
        </WelcomeStack.Navigator>
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

    if (deviceVerificationError) {
      return (
        <WelcomeStack.Navigator>
          {showGenericErrorScreen(
            "Cannot securely verify your device. Please try again later"
          )}
        </WelcomeStack.Navigator>
      );
    }

    if (deviceConflict) {
      return (
        <WelcomeStack.Navigator>
          {showConfirmDeviceScreens()}
        </WelcomeStack.Navigator>
      );
    }

    if (screenLockMechanismError) {
      return (
        <WelcomeStack.Navigator>
          {showGenericErrorScreen(
            "Cannot verify if your device has a screen lock mechanism. Please try again later"
          )}
        </WelcomeStack.Navigator>
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
  if (customerContext?.isLoading) {
    return <FullScreenLoadingSpinner message="Checking your account..." />;
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
            description: customer?.data?.value?.isBusiness
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

    if (customerContext?.error && isNil(customer?.data?.value?.email)) {
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

    if (customerContext?.isLoading) {
      return;
    }

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

  function showGenericErrorScreen(message?: string) {
    return (
      <WelcomeStack.Screen
        name="Feedback"
        component={Feedback}
        initialParams={{
          title: "Oops",
          description:
            message ??
            `Something went wrong. Please close the app and try again later.`,
          illustration: ImageIdentifier.Find,
        }}
      />
    );
  }
}
