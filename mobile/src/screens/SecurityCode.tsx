import { useEffect, useState, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Box, Text, theme } from "native-base";
import ScreenWrapper from "../components/ScreenWrapper";
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any
const totp: any = require("totp-generator");
import * as SecureStore from "expo-secure-store";
import FullScreenMessage from "../components/FullScreenMessage";
import * as Sentry from "sentry-expo";

export function SecurityCode() {
  const [otp, setOtp] = useState<string>("");
  const [otpSeed, setOtpSeed] = useState("JBSWY3DPEHPK3PXP");
  const [otpGenerationError, setOtpGenerationError] = useState(false);
  const period = 30;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    retrieveOTPKeyFromSecureStore();
    updateOtpAndProgressBar();

    // Periodic updates
    const interval = setInterval(() => {
      updateOtpAndProgressBar();
    }, 1000); // Check every second for more accurate synchronization

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (otpGenerationError) {
    return (
      <ScreenWrapper flex={1}>
        <FullScreenMessage
          title="Error"
          message="Could not generate a security code. Please try later or contact support."
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper flex={1}>
      <Text flex={1}>
        Input the following code when requested, to confirm your identity
      </Text>
      <Text fontSize="6xl" letterSpacing="2xl" textAlign="center" my={3}>
        {otp}
      </Text>
      <Box width="90%" flex={1}>
        <Animated.View
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
      const otpSeed = await SecureStore.getItemAsync("otpSeed");

      if (isSecureStoreAvailable && otpSeed !== null) {
        setOtpSeed(otpSeed);
      } else {
        setOtpGenerationError(true);

        Sentry.Native.captureMessage(
          "SecureStore is not available, or otpSeed is null",
          {
            level: "warning",
            tags: { key: "SecureStoreNotAvailableOrOtpSeedNull" },
            extra: { isSecureStoreAvailable, otpSeed },
          }
        );
      }
    } catch (error) {
      setOtpGenerationError(true);
      Sentry.Native.captureException(error);
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