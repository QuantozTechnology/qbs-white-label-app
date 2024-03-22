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
import { Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import ConfirmDevice from "../screens/ConfirmDevice";

import { isNil } from "lodash";
import {
  checkStoredKeys,
  getOid,
  performBiometricValidation,
  checkDeviceHasScreenLock,
} from "../utils/functions";
import { useAppState } from "../context/AppStateContext";
import FullScreenMessage from "../components/FullScreenMessage";
import * as SecureStore from "expo-secure-store";

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

type ErrorType = { message: string };

export type CustomerStatus = {
  result: "success" | "register" | "error" | "underReview";
  message?: string;
};

export type PageType =
  | "BiometricCheck"
  | "BiometricError"
  | "BiometricNone"
  | "BiometricDone"
  | "ScreenLockCheck"
  | "ScreenLockError"
  | "ScreenLockNone"
  | "ScreenLockDone"
  | "SignIn"
  | "DeviceVerificationCheck"
  | "DeviceVerificationConflict"
  | "DeviceVerificationError"
  | "DeviceVerificationDone"
  | "AutoLogin"
  | "RegistrationCompleteForm";

export default function WelcomeStackNavigator() {
  const auth = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const customerContext = useCustomerState();
  const { isRegistered } = useAppState();

  const [currentPageType, setCurrentPageType] = useState<PageType | null>(null);

  const performBiometricCheck = async () => {
    performBiometricValidation(
      (isBiometricCheckPassed: boolean, error: ErrorType | null) => {
        if (error) {
          setCurrentPageType("BiometricError");
        } else {
          setCurrentPageType(
            isBiometricCheckPassed ? "BiometricDone" : "BiometricNone"
          );
        }
      }
    );
  };

  const checkScreenLockMechanism = async () => {
    checkDeviceHasScreenLock(
      (result: boolean | null, error: { message: string } | null) => {
        if (error) {
          setCurrentPageType("ScreenLockError");
        } else if (result === null) {
          setCurrentPageType("ScreenLockError");
        } else {
          setCurrentPageType(result ? "ScreenLockDone" : "ScreenLockNone");
        }
      }
    );
  };

  const verifyCurrentDevice = async () => {
    try {
      const oid = await getOid();
      if (oid) {
        const deviceStatus = await checkStoredKeys(oid);
        if (isNil(deviceStatus)) {
          setCurrentPageType("SignIn");
          return;
        } else {
          if (deviceStatus == "conflict") {
            setCurrentPageType("DeviceVerificationConflict");
            return;
          }
          if (deviceStatus == "error") {
            setCurrentPageType("DeviceVerificationError");
            return;
          }
          setCurrentPageType("DeviceVerificationDone");
        }
      } else {
        setCurrentPageType("SignIn");
      }
    } catch (error) {
      setCurrentPageType("DeviceVerificationError");
    }
  };

  const retry = async (pageType: PageType) => {
    setCurrentPageType(pageType);
  };

  const nextAction = async () => {
    switch (currentPageType) {
      case "BiometricCheck":
        await performBiometricCheck();
        break;
      // eslint-disable-next-line
      case "BiometricDone":
        setCurrentPageType("ScreenLockCheck");
        break;
      case "ScreenLockCheck":
        await checkScreenLockMechanism();
        break;
      case "ScreenLockDone":
        if (isNil(auth?.userSession)) {
          setCurrentPageType("SignIn");
        } else {
          const oid = await getOid();
          if (!isNil(oid)) {
            const pubKey = await SecureStore.getItemAsync(oid + "_publicKey");
            const deviceVerified = await SecureStore.getItemAsync(
              oid + "deviceVerified"
            );
            const RegistrationCompleted = await SecureStore.getItemAsync(
              oid + "RegistrationCompleted"
            );
            if (!isNil(RegistrationCompleted)) {
              setCurrentPageType("AutoLogin");
            } else {
              if (isNil(pubKey) || isNil(deviceVerified)) {
                setCurrentPageType("DeviceVerificationCheck");
              } else {
                setCurrentPageType("RegistrationCompleteForm");
              }
            }
          } else {
            auth?.logout();
            setCurrentPageType("SignIn");
          }
        }

        break;
      case "DeviceVerificationCheck":
        await verifyCurrentDevice();
        break;
      case "DeviceVerificationConflict":
        if (auth?.userSession === null) {
          setCurrentPageType("SignIn");
        }
        break;
      case "DeviceVerificationDone":
        setCurrentPageType("RegistrationCompleteForm");
        break;
      case "AutoLogin":
        if (auth?.userSession === null) {
          setCurrentPageType("SignIn");
        }
        break;
      case "SignIn":
        if (auth?.userSession) {
          const oid = await getOid();
          if (!isNil(oid)) {
            const pubKey = await SecureStore.getItemAsync(oid + "_publicKey");
            const deviceVerified = await SecureStore.getItemAsync(
              oid + "deviceVerified"
            );
            const RegistrationCompleted = await SecureStore.getItemAsync(
              oid + "RegistrationCompleted"
            );
            if (!isNil(RegistrationCompleted)) {
              setCurrentPageType("AutoLogin");
            } else {
              if (isNil(pubKey) || isNil(deviceVerified)) {
                setCurrentPageType("DeviceVerificationCheck");
              }
            }
          } else {
            auth?.logout();
          }
        }
        break;
      default:
        if (isNil(currentPageType)) {
          setCurrentPageType("BiometricCheck");
        }
        break;
    }
  };

  useEffect(() => {
    if (currentPageType !== null) {
      nextAction();
    } else {
      setCurrentPageType("BiometricCheck");
    }
  }, [currentPageType]);

  useEffect(() => {
    if (isRegistered) {
      if (currentPageType != "AutoLogin") {
        setCurrentPageType("AutoLogin");
      }
    }
  }, [isRegistered]);

  useEffect(() => {
    nextAction();
  }, [auth?.userSession]);

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  switch (currentPageType) {
    case "RegistrationCompleteForm":
      return (
        <WelcomeStack.Navigator
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
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
        </WelcomeStack.Navigator>
      );
      break;
    case "AutoLogin":
      return (
        <WelcomeStack.Navigator
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <WelcomeStack.Screen
            name="AppStack"
            component={AppBottomTabNavigator}
          />
        </WelcomeStack.Navigator>
      );
      break;
    case "DeviceVerificationCheck":
      return (
        <FullScreenLoadingSpinner
          message={"Verifying device, it could take up to 1 minute..."}
        />
      );
      break;
    case "DeviceVerificationConflict":
      return (
        <WelcomeStack.Navigator>
          {showConfirmDeviceScreens()}
        </WelcomeStack.Navigator>
      );
      break;
    case "SignIn":
      if (auth?.userSession) {
        <FullScreenLoadingSpinner message="Checking your account..." />;
      } else {
        return (
          <WelcomeStack.Navigator
            screenOptions={{ headerShown: false, gestureEnabled: false }}
          >
            <WelcomeStack.Screen name="SignIn" component={SignIn} />
          </WelcomeStack.Navigator>
        );
      }
      break;
    case "BiometricCheck":
      return (
        <FullScreenLoadingSpinner message={"Checking biometric security..."} />
      );
      break;
    case "BiometricError":
      return (
        <WelcomeStack.Navigator>
          {showGenericErrorScreen(
            "Cannot verify your biometric security. Please try again later"
          )}
        </WelcomeStack.Navigator>
      );
      break;
    case "BiometricNone":
      return (
        <FullScreenMessage
          title="Biometric check error"
          message="Please try again"
          actionButton={{
            label: "Try again",
            callback: retry.bind(null, "BiometricCheck"),
          }}
        />
      );
      break;
    case "ScreenLockCheck":
      return (
        <FullScreenLoadingSpinner
          message={"Checking screen lock mechanism..."}
        />
      );
      break;
    case "ScreenLockError":
      return (
        <WelcomeStack.Navigator>
          {showGenericErrorScreen(
            "Cannot verify if your device has a screen lock mechanism. Please try again later"
          )}
        </WelcomeStack.Navigator>
      );
      break;
    case "ScreenLockNone":
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
      break;
    case "DeviceVerificationError":
      return (
        <WelcomeStack.Navigator>
          {showGenericErrorScreen(
            "Cannot securely verify your device. Please try again later"
          )}
        </WelcomeStack.Navigator>
      );
      break;
    default:
      return <FullScreenLoadingSpinner message="Checking your account..." />;
      break;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
