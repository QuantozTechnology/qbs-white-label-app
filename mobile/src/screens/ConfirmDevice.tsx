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
import { defaultConfig } from "../config/config";
import { useCustomer } from "../api/customer/customer";
import { composeEmail } from "../utils/email";
import { useNotification } from "../context/NotificationContext";
import { verifyDevice } from "../api/customer/devices";
import * as SecureStore from "expo-secure-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WelcomeStackParamList } from "../navigation/WelcomeStack";
import { ImageIdentifier } from "../utils/images";

type ConfirmDeviceProps = NativeStackScreenProps<
  WelcomeStackParamList,
  "ConfirmDevice"
>;

export default function ConfirmDevice({ navigation }: ConfirmDeviceProps) {
  const [codes, setCodes] = useState<string[]>(["", "", "", "", "", ""]);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputsRef = useRef<(any | null)[]>([]);

  const { data: customer } = useCustomer();
  const { showErrorNotification } = useNotification();

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  useEffect(() => {
    (async () => await handleComplete())();
  }, [codes]);

  return (
    <ScreenWrapper flex={1}>
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
          onPress={handleSupportPress}
          _text={{
            color: "primary.500",
            fontSize: "md",
            fontWeight: "bold",
          }}
          isUnderlined={false}
        >
          I don&apos;t have access to my existing device
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
        showErrorNotification("The code you entered is incorrect");
        setCodes(["", "", "", "", "", ""]);
        if (inputsRef.current[0]) {
          inputsRef.current[0].focus();
        }
      } else {
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
      const pubKeyFromStore = await SecureStore.getItemAsync("publicKey");

      if (pubKeyFromStore === null) {
        showErrorNotification("Could not verify device, please try again.");
        return;
      }

      await verifyDevice({
        publicKey: pubKeyFromStore,
        otpCode: otp,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async function handleSupportPress() {
    const emailRecipient = defaultConfig.supportEmail;
    const emailSubject = "Support request - Quantoz Blockchain Solutions";
    const emailBody = `Please provide a detailed description of the issue you are experiencing. Be sure to leave the information below as it is.
    
    ---------------------
    My account email: ${customer?.data.value.email ?? "please provide it"}`;

    await composeEmail({
      recipients: [emailRecipient],
      subject: emailSubject,
      body: emailBody,
    });
  }
}
