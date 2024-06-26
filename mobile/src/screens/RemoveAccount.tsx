// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Text,
  VStack,
  theme,
} from "native-base";
import ScreenWrapper from "../components/ScreenWrapper";
import { paymentsApi } from "../utils/axios";
import { useAuth } from "../auth/AuthContext";
import { useNotification } from "../context/NotificationContext";

export function RemoveAccount() {
  const auth = useAuth();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const removeAccount = async () => {
    setIsLoading(true);

    try {
      const response = await paymentsApi.delete("/api/customers");
      if (response.status === 201) {
        showSuccessNotification("Account removed successfully");
      } else {
        showErrorNotification(
          "Account removal failed. Please contact support."
        );
      }
    } catch (error) {
      showErrorNotification("Account removal failed. Please contact support.");
    }

    auth?.logout();
    setIsLoading(false);
  };

  return (
    <ScreenWrapper flex={1} accessibilityLabel="remove account screen">
      <Text fontSize="md" accessibilityLabel="instructions">
        Type your email again to confirm the removal of your account.
      </Text>
      <Box height={theme.space[3]} />
      <FormControl isRequired>
        <VStack>
          <FormControl.Label>Email Address</FormControl.Label>
          <Input
            value={email}
            accessibilityLabel="email"
            aria-label="Email"
            // only lowercase letters and numbers are allowed in email
            onChangeText={(value) => {
              setEmail(value.toLowerCase());
            }}
            keyboardType="email-address"
            blurOnSubmit={true}
          />
        </VStack>
      </FormControl>
      <Box height={theme.space[2]} />
      <Button
        isLoading={isLoading}
        isLoadingText="Removing account..."
        onPress={removeAccount}
        accessibilityLabel="remove account"
        aria-label="Remove account"
        _disabled={{
          bg: "gray.400",
          _text: { color: "gray.700" },
        }}
      >
        Remove Account
      </Button>
    </ScreenWrapper>
  );
}
