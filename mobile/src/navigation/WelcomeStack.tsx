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
//import FullScreenMessage from "../components/FullScreenMessage";
import { useCustomer } from "../api/customer/customer";
import { Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useBiometricValidation } from "../utils/hooks/useBiometricValidation";
import { useDeviceHasScreenLock } from "../utils/hooks/useDeviceHasScreenLock";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import ConfirmDevice from "../screens/ConfirmDevice";

import { isNil } from "lodash";
import { getStoredKeys, getOid, handlePageType } from "../utils/functions";
import { AppState } from "react-native";
import { useAppState } from "../context/AppStateContext";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const customerContext = useCustomerState();
  const { isRegistered } = useAppState();
  // We must perform verification in order to display related loading screens.
  // First, biometrics, then screenlock.
  const [currentOperation, setCurrentOperation] =
    useState("checkingBiometrics");
  // By using shouldVerify, we can run useDeviceVerification and useDeviceHasScreenLock manually and have more control over them.
  const [shouldCheckScreenLockMechanism, setShouldCheckScreenLockMechanism] =
    useState(false);
  const [currentPageType, setCurrentPageType] = useState<string | null>(null);

  const {
    isBiometricCheckPassed,
    error: biometricCheckError,
    isLoading: isCheckingBiometric,
  } = useBiometricValidation();

  const {
    hasScreenLockMechanism,
    error: screenLockMechanismError,
    isLoading: isCheckingScreenLockMechanism,
  } = useDeviceHasScreenLock(shouldCheckScreenLockMechanism);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: customer } = useCustomer({
    enabled: auth?.userSession !== null && currentPageType === "AutoLogin",
  });

  useEffect(() => {
    const handleAppStateChange = () => {
      handlePageType(setCurrentPageType);
    };

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      appStateSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (auth?.userSession) {
      handlePageType(setCurrentPageType);
    }
  }, [auth?.userSession]);

  useEffect(() => {
    if (currentPageType !== null) {
      nextAction();
    }
  }, [currentPageType]);

  const verifyCurrentDevice = async () => {
    const oid = await getOid();
    if (oid) {
      await getStoredKeys(oid);
    }
    setCurrentOperation("done");
  };

  useEffect(() => {
    if (isRegistered) {
      if (currentPageType != "AutoLogin") {
        setCurrentPageType("AutoLogin");
      }
    }
  }, [isRegistered]);

  const nextAction = async () => {
    switch (currentPageType) {
      case "SignIn":
        setCurrentOperation("checkingBiometrics");
        break;
      case "AutoLogin":
        setCurrentOperation("done");
        break;
      case "RegistrationCompleteForm":
        setCurrentOperation("done");
        break;
      case "DeviceVerification":
        setCurrentOperation("verifyingDevice");
        await verifyCurrentDevice();
        setCurrentOperation("checkingScreenLock");
        break;
      default:
        setCurrentPageType("SignIn");
        setCurrentOperation("checkingBiometrics");
        break;
    }
  };
  useEffect(() => {
    if (currentPageType !== null) {
      nextAction();
    }
  }, [currentPageType]);

  useEffect(() => {
    if (!isCheckingBiometric) {
      if (biometricCheckError) {
        setCurrentOperation("done");
      } else if (
        isBiometricCheckPassed &&
        currentOperation === "checkingBiometrics"
      ) {
        setCurrentOperation("checkingScreenLock");
        setShouldCheckScreenLockMechanism(true);
      }
    }
  }, [
    isCheckingBiometric,
    isBiometricCheckPassed,
    biometricCheckError,
    currentOperation,
  ]);

  useEffect(() => {
    if (
      currentOperation === "checkingScreenLock" &&
      !isCheckingScreenLockMechanism
    ) {
      if (hasScreenLockMechanism || screenLockMechanismError) {
        setCurrentOperation("done");
      }
    }
  }, [
    currentOperation,
    isCheckingScreenLockMechanism,
    hasScreenLockMechanism,
    screenLockMechanismError,
  ]);

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

    // if (biometricCheckError) {
    //   return (
    //     <FullScreenMessage
    //       title="Biometric check error"
    //       message="Please try again"
    //       actionButton={{
    //         label: "Try again",
    //         callback: triggerRetry,
    //       }}
    //     />
    //   );
    // }

    // if (deviceVerificationError) {
    //   return (
    //     <WelcomeStack.Navigator>
    //       {showGenericErrorScreen(
    //         "Cannot securely verify your device. Please try again later"
    //       )}
    //     </WelcomeStack.Navigator>
    //   );
    // }

    // if (deviceConflict) {
    //   return (
    //     <WelcomeStack.Navigator>
    //       {showConfirmDeviceScreens()}
    //     </WelcomeStack.Navigator>
    //   );
    // }

    if (screenLockMechanismError) {
      return (
        <WelcomeStack.Navigator>
          {showGenericErrorScreen(
            "Cannot verify if your device has a screen lock mechanism. Please try again later"
          )}
        </WelcomeStack.Navigator>
      );
    }

    if (screenLockMechanismError) {
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

  if (isNil(currentPageType)) {
    return <FullScreenLoadingSpinner message="Checking your account..." />;
  }

  return (
    <WelcomeStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      {renderCorrectStack()}
    </WelcomeStack.Navigator>
  );

  function VerifyingDeviceScreen() {
    return <FullScreenLoadingSpinner message="Verifying device..." />;
  }

  function CheckingAccountScreen() {
    return <FullScreenLoadingSpinner message="Checking your account2..." />;
  }

  function renderCorrectStack() {
    switch (currentPageType) {
      case "RegistrationCompleteForm":
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
      case "AutoLogin":
        return (
          <WelcomeStack.Screen
            name="AppStack"
            component={AppBottomTabNavigator}
          />
        );
      case "DeviceVerification":
        return (
          <WelcomeStack.Screen
            name="Home"
            component={VerifyingDeviceScreen}
            options={{ headerShown: false }}
          />
        );
      default:
        return (
          <WelcomeStack.Screen
            name="Home"
            component={CheckingAccountScreen}
            options={{ headerShown: false }}
          />
        );
    }
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
