import { useEffect, useState, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Box, Text, theme } from "native-base";
import ScreenWrapper from "../components/ScreenWrapper";
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any
const totp: any = require("totp-generator");

export function SecurityCode() {
  const [otp, setOtp] = useState<string>("");
  const seed = "JBSWY3DPEHPK3PXP";
  const period = 30;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const updateOtpAndProgressBar = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const remainingTime = period - (currentTime % period);

      setOtp(totp(seed, { period }));
      const initialProgress = (remainingTime / period) * 100;
      progressAnim.setValue(initialProgress);
      animateProgressBar(remainingTime * 1000);
    };

    // Initialize at first load
    updateOtpAndProgressBar();

    // Periodic updates
    const interval = setInterval(() => {
      updateOtpAndProgressBar();
    }, 1000); // Check every second for more accurate synchronization

    return () => {
      clearInterval(interval);
    };
  }, []);

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
}
