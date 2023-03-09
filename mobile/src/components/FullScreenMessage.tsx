// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { Box, Button, Heading, Icon, Text, VStack } from "native-base";
import { ReactNode } from "react";

type IFullScreenMessage = {
  title: string;
  message: string;
  icon?: ReactNode;
  noFullScreen?: boolean;
  actionButton?: {
    label: string;
    callback: () => void;
  };
};

function FullScreenMessage({
  title,
  message,
  icon = (
    <Icon
      as={Ionicons}
      name="warning"
      size={"6xl"}
      accessibilityLabel="warning icon"
      color="error.600"
    />
  ),
  noFullScreen = false,
  actionButton,
}: IFullScreenMessage) {
  return (
    <VStack
      p={4}
      justifyContent="center"
      alignItems="center"
      height={noFullScreen ? "2/3" : "full"}
      accessibilityLabel="full screen message"
      space={3}
    >
      {icon}
      <Box>
        <Heading
          size="xl"
          accessibilityLabel="full screen message title"
          textAlign="center"
        >
          {title}
        </Heading>
        <Text
          textAlign="center"
          fontSize="lg"
          accessibilityLabel="full screen message description"
        >
          {message}
        </Text>
      </Box>
      {actionButton && (
        <Button onPress={() => actionButton.callback()}>
          {actionButton.label}
        </Button>
      )}
    </VStack>
  );
}

export default FullScreenMessage;
