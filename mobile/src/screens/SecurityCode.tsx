// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useEffect, useState, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Box, Text, theme } from "native-base";
import ScreenWrapper from "../components/ScreenWrapper";
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any
const totp: any = require("totp-generator");
import * as SecureStore from "expo-secure-store";
import FullScreenMessage from "../components/FullScreenMessage";
import FullScreenLoadingSpinner from "../components/FullScreenLoadingSpinner";

export function SecurityCode() {
  const [otp, setOtp] = useState<string>("");
  const [otpSeed, setOtpSeed] = useState<string | null>(null);
  const [otpGenerationError, setOtpGenerationError] = useState(false);
  const period = 30;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    retrieveOTPKeyFromSecureStore();
  }, []);

  useEffect(() => {
    if (otpSeed !== null) {
      updateOtpAndProgressBar();

      const interval = setInterval(() => {
        updateOtpAndProgressBar();
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [otpSeed]);

  if (otpGenerationError) {
    return (
      <ScreenWrapper flex={1}>
        <FullScreenMessage
          title="Error"
          message={`Could not generate a security code.
Please try later or contact support.`}
        />
      </ScreenWrapper>
    );
  }

  if (otpSeed === null) {
    return <FullScreenLoadingSpinner />;
  }

  return (
    <ScreenWrapper flex={1} accessibilityLabel="security code screen">
      <Text flex={1} fontSize="md" accessibilityLabel="instructions">
        Input the following code when requested, to confirm your identity.
      </Text>
      <Text
        fontSize="6xl"
        letterSpacing="2xl"
        textAlign="center"
        my={3}
        accessibilityLabel="otp code"
      >
        {otp}
      </Text>
      <Box width="100%" flex={1} alignItems="center">
        <Box width="65%">
          <Animated.View
            accessibilityLabel="progress bar"
            style={{
              height: 8,
              backgroundColor: theme.colors.primary[500],
              borderRadius: 4,
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </Box>
      </Box>
    </ScreenWrapper>
  );

  function animateProgressBar(duration: number) {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  async function retrieveOTPKeyFromSecureStore() {
    try {
      const isSecureStoreAvailable = await SecureStore.isAvailableAsync();
      const otpSeedFromSecureStore = await SecureStore.getItemAsync("otpSeed");

      if (isSecureStoreAvailable && otpSeedFromSecureStore !== null) {
        setOtpSeed(otpSeedFromSecureStore);
      } else {
        setOtpGenerationError(true);
      }
    } catch (error) {
      setOtpGenerationError(true);
    }
  }
  function updateOtpAndProgressBar() {
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = period - (currentTime % period);

    setOtp(totp(otpSeed, { period }));
    const initialProgress = (remainingTime / period) * 100;
    progressAnim.setValue(initialProgress);
    animateProgressBar(remainingTime * 1000);
  }
}
