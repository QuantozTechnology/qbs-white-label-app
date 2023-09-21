// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { Icon, IconButton } from "native-base";
import { useCustomer } from "../api/customer/customer";
import DataDisplayField from "../components/DataDisplayField";
import ScreenWrapper from "../components/ScreenWrapper";
import { defaultConfig } from "../config/config";
import { composeEmail } from "../utils/email";
import * as Linking from "expo-linking";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../navigation/Settings";

type Props = NativeStackScreenProps<SettingsStackParamList, "SettingsHome">;

function SettingsHome({ navigation }: Props) {
  const { data } = useCustomer();

  return (
    <ScreenWrapper flex={1} px={-4}>
      <DataDisplayField
        accessibilityLabel="support"
        label="Contact support"
        value={defaultConfig.supportEmail}
        action={
          <IconButton
            icon={
              <Icon
                as={Ionicons}
                name="ios-chatbox-ellipses-outline"
                size="lg"
              />
            }
            mr={2}
            onPress={handleSupportPress}
          />
        }
      />
      <DataDisplayField
        accessibilityLabel="security code"
        label="Security code"
        value="Confirm login, or add a new device"
        action={
          <IconButton
            icon={<Icon as={Ionicons} name="arrow-forward-outline" size="lg" />}
            mr={2}
            onPress={handleSecurityCodePress}
          />
        }
      />
      <DataDisplayField
        accessibilityLabel="terms"
        label="How it works"
        value="Terms and conditions"
        action={
          <IconButton
            icon={
              <Icon as={Ionicons} name="information-circle-outline" size="lg" />
            }
            mr={2}
            onPress={handleTermsPress}
          />
        }
      />
    </ScreenWrapper>
  );

  async function handleSupportPress() {
    const emailRecipient = defaultConfig.supportEmail;
    const emailSubject = "Support request - Quantoz Blockchain Solutions";
    const emailBody = `Please provide a detailed description of the issue you are experiencing. Be sure to leave the information below as it is.
    
    ---------------------
    My account email: ${data?.data.value.email ?? "not available"}`;

    await composeEmail({
      recipients: [emailRecipient],
      subject: emailSubject,
      body: emailBody,
    });
  }

  function handleTermsPress() {
    Linking.openURL(defaultConfig.termsUrl);
  }

  function handleSecurityCodePress() {
    navigation.navigate("SecurityCode");
  }
}
export default SettingsHome;
