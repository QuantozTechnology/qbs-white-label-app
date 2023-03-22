// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { Box, Button, Heading, Icon, Image, Text, VStack } from "native-base";
import { ReactNode } from "react";
import { ImageIdentifier, imagesCollection } from "../utils/images";

type IFullScreenMessage = {
  message: string;
  title?: string;
  icon?: ReactNode;
  noFullScreen?: boolean;
  actionButton?: {
    label: string;
    callback: () => void;
  };
  illustration?: ImageIdentifier;
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
  illustration,
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
        {illustration && (
          <Image
            // any needed to cast from string of enum to type requested from source
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            source={imagesCollection[illustration] as any}
            resizeMode="contain"
            marginX="auto"
            width={200}
            height={200}
            alt="illustration"
          />
        )}
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
