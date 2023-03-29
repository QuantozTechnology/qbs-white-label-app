// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AxiosError } from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  Box,
  Button,
  VStack,
  Heading,
  Toast,
  Image,
  HStack,
} from "native-base";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { useAuth } from "../auth/AuthContext";
import FullScreenLoadingSpinner from "../components/FullScreenLoadingSpinner";
import Notification from "../components/Notification";
import ScreenWrapper from "../components/ScreenWrapper";
import { formatError } from "../utils/errors";

function SignIn() {
  const auth = useAuth();
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (auth?.error) {
      Toast.show({
        render: () =>
          auth.error !== null && (
            <Notification
              message={auth.error}
              variant="error"
              isToastNotification
            />
          ),
      });
    }
  }, [auth?.error]);

  if (auth?.isLoading) {
    return <FullScreenLoadingSpinner />;
  }

  return (
    <ScreenWrapper flex={1}>
      <LinearGradient
        colors={["#324658", "#030C0C"]}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          height: height * 1.5,
        }}
      />
      <Box accessibilityLabel="sign-in message" flex={1} p={4}>
        <VStack flex={1} space={4} justifyContent="center" alignItems="center">
          <Image
            source={require("../../assets/adaptive-icon-qbs.png")}
            alt="qbs logo"
            style={{
              resizeMode: "center",
              width: width,
              height: 200,
            }}
          />
          <Heading size="lg" color="warmGray.100">
            The future of digital cash
          </Heading>
        </VStack>
        <HStack space={8}>
          <Button
            onPress={async () => {
              await azureSignin();
            }}
            variant="solid"
            flex={1}
          >
            Login
          </Button>
          <Button
            onPress={async () => {
              await azureSignup();
            }}
            flex={1}
          >
            Signup
          </Button>
        </HStack>
      </Box>
      <StatusBar style="light" />
    </ScreenWrapper>
  );

  async function azureSignin() {
    try {
      await auth?.login();
    } catch (error) {
      Toast.show({
        render: () => (
          <Notification
            message={formatError(error as Error | AxiosError)}
            variant="error"
          />
        ),
      });
    }
  }

  async function azureSignup() {
    try {
      await auth?.signup();
    } catch (error) {
      Toast.show({
        render: () => (
          <Notification
            message={formatError(error as Error | AxiosError)}
            variant="error"
          />
        ),
      });
    }
  }
}

export default SignIn;
