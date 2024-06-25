// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useState, useRef, useEffect } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  KeyboardAvoidingView,
  Link,
  Text,
  theme,
} from "native-base";
import { Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "../context/NotificationContext";
import { verifyDevice, sendOtpCodeToMail } from "../utils/functions";
import * as SecureStore from "expo-secure-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WelcomeStackParamList } from "../navigation/WelcomeStack";
import { ImageIdentifier } from "../utils/images";
import { useAuth } from "../auth/AuthContext";
import { isNil } from "lodash";
import { SECURE_STORE_KEYS } from "../auth/types";

type ConfirmDeviceProps = NativeStackScreenProps<
  WelcomeStackParamList,
  "ConfirmDevice"
>;

export default function ConfirmDevice({ navigation }: ConfirmDeviceProps) {
  const auth = useAuth();
  const [codes, setCodes] = useState<string[]>(["", "", "", "", "", ""]);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputsRef = useRef<(any | null)[]>([]);

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const handleMailPress = async () => {
    const response = await sendOtpCodeToMail();
    if (response === "error") {
      showErrorNotification("Could not send email. Please try again.", {
        position: "top",
      });
    } else {
      showSuccessNotification("Email sent successfully.", {
        position: "top",
      });
    }
  };

  function handleChangeText(index: number, value: string) {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      if (value && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1].focus();
      }
    }
  }

  function handleKeyPress(
    index: number,
    event: { nativeEvent: { key: string } }
  ) {
    if (event.nativeEvent.key === "Backspace" && inputsRef.current[index - 1]) {
      const newCodes = [...codes];
      if (!codes[index]) {
        newCodes[index - 1] = "";
        setCodes(newCodes);
      }
      inputsRef.current[index - 1].focus();
    }
  }

  async function handleComplete() {
    if (codes.every((code) => code.length === 1)) {
      const otp = codes.join("");
      setIsCheckingCode(true);

      Keyboard.dismiss();

      const isCodeCorrectResponse = await isCodeCorrect(otp);
      if (!isCodeCorrectResponse) {
        showErrorNotification("The code you entered is incorrect", {
          position: "top",
        });
        setCodes(["", "", "", "", "", ""]);

        // Add delay before refocusing, otherwise it does not autofocus correctly
        setTimeout(() => {
          if (inputsRef.current[0]) {
            inputsRef.current[0].focus();
          }
        }, 200);
      } else {
        const oid = await SecureStore.getItemAsync(SECURE_STORE_KEYS.OID);
        await SecureStore.setItemAsync(
          oid + SECURE_STORE_KEYS.REGISTRATION_COMPLETED,
          "true"
        );
        navigation.navigate("Feedback", {
          title: "Device verified!",
          description: "You can now use this device to access your account.",
          illustration: ImageIdentifier.Ready,
          variant: "success",
          button: {
            caption: "Continue",
            callback: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "AppStack" }],
              });
            },
          },
        });
      }
      setIsCheckingCode(false);
    }
  }

  async function isCodeCorrect(otp: string) {
    try {
      const oid = await SecureStore.getItemAsync(SECURE_STORE_KEYS.OID);
      const pubKeyFromStore = await SecureStore.getItemAsync(
        oid + SECURE_STORE_KEYS.PUBLIC_KEY
      );

      if (isNil(pubKeyFromStore) || isNil(oid) || isNil(otp)) {
        showErrorNotification("Could not verify device, please try again.", {
          position: "top",
        });
        return;
      }

      const verifyDeviceResult = await verifyDevice(pubKeyFromStore, oid, otp);
      if (!isNil(verifyDeviceResult)) {
        if (!isNil(verifyDeviceResult?.data?.error)) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // check if codes are not empty
    if (codes.every((code) => code === "")) {
      return;
    } else {
      (async () => await handleComplete())();
    }
  }, [codes]);

  const handleLogout = async () => {
    auth?.logout();
  };

  return (
    <ScreenWrapper flex={1} accessibilityLabel="confirm device screen">
      <Text fontSize="md">
        This device is not associated with your account yet.
      </Text>
      <Text fontSize="md" mt={4}>
        Please enter the 6 digit code you can find in your existing device under
        Settings -&gt; Security code.
      </Text>
      <HStack mt={4} alignItems="center" space={1}>
        <Icon
          as={Ionicons}
          name="information-circle-outline"
          size="sm"
          color="primary.500"
        />
        <Link
          onPress={handleMailPress}
          _text={{
            color: "primary.500",
            fontSize: "md",
            fontWeight: "bold",
          }}
          isUnderlined={false}
        >
          I don&apos;t have access to my existing device. Send the code via
          email.
        </Link>
      </HStack>
      <HStack mt={4} alignItems="center" space={1}>
        <Icon
          as={Ionicons}
          name="log-out-outline"
          size="sm"
          color="primary.500"
        />
        <Link
          onPress={handleLogout}
          _text={{
            color: "primary.500",
            fontSize: "md",
            fontWeight: "bold",
          }}
          isUnderlined={false}
        >
          Logout
        </Link>
      </HStack>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <Box flex={1} justifyContent="center" alignItems="center">
          <HStack justifyContent="space-between" width="100%">
            {codes.map((code, index) => (
              <Input
                key={index}
                ref={(ref) => (inputsRef.current[index] = ref)}
                flex={1}
                mx="1"
                keyboardType="numeric"
                maxLength={1}
                value={code}
                onChangeText={(value) => handleChangeText(index, value)}
                onKeyPress={(event) => handleKeyPress(index, event)}
                fontSize="3xl"
                textAlign="center"
                caretHidden
                isDisabled={isCheckingCode}
              />
            ))}
          </HStack>
          {isCheckingCode && (
            <Button
              isLoading={isCheckingCode}
              isLoadingText="Checking code..."
              variant="ghost"
              size="md"
              m={4}
              _text={{ color: theme.colors.text[500] }}
            />
          )}
        </Box>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
