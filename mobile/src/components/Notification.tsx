// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Alert, Box, HStack, Text } from "native-base";
import { InterfaceAlertProps } from "native-base/lib/typescript/components/composites/Alert/types";
import { ReactElement } from "react";

type ErrorAlertProps = {
  message: string;
  variant: InterfaceAlertProps["status"];
  title?: string;
  actionButton?: ReactElement;
  isToastNotification?: boolean;
};

function Notification({
  actionButton,
  message,
  variant,
  title,
  isToastNotification = false,
}: ErrorAlertProps) {
  return (
    <Alert
      variant={"subtle"}
      status={variant}
      accessibilityLabel="notification message"
      m={4}
      mb={isToastNotification ? 12 : 0}
      rounded="md"
      justifyContent="center"
      alignItems="flex-start"
    >
      {title != null && (
        <HStack space={4} alignItems="center">
          <Alert.Icon />
          <Text
            fontWeight={"medium"}
            fontSize={"md"}
            accessibilityLabel="notification message title"
          >
            {title}
          </Text>
        </HStack>
      )}
      <HStack alignItems="center" space={title == null ? 2 : 0}>
        {title == null && <Alert.Icon />}
        <Text accessibilityLabel="notification message description">
          {message}
        </Text>
      </HStack>
      <Box mt={2} w="full">
        {actionButton}
      </Box>
    </Alert>
  );
}

export default Notification;
