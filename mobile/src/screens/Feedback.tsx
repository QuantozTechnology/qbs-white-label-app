// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Box,
  Button,
  Heading,
  Image,
  Spinner,
  Text,
  VStack,
} from "native-base";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect } from "react";
import { WelcomeStackParamList } from "../navigation/WelcomeStack";
import { imagesCollection } from "../utils/images";

type FeedbackProps = NativeStackScreenProps<WelcomeStackParamList, "Feedback">;

function Feedback({ navigation, route }: FeedbackProps) {
  const {
    title,
    variant,
    button,
    description,
    illustration,
    showFeedbackIcon = false,
  } = route.params || {};

  useEffect(() => {
    // always remove the header in this screen
    navigation.setOptions({ headerShown: false });
  }, []);

  function getFeedbackIcon() {
    if (variant === "loading") {
      return <Spinner accessibilityLabel="Loading posts" size={"lg"} />;
    }

    if (showFeedbackIcon) {
      return variant === "success" ? (
        <Feather name="check-circle" size={64} />
      ) : (
        <Ionicons name="warning-outline" size={64} />
      );
    }
  }

  return (
    <VStack
      space={2}
      p={4}
      justifyContent={"space-between"}
      alignItems={"center"}
      h={"full"}
      accessibilityLabel="feedback screen"
      bg="white"
    >
      <Box justifyContent={"center"} alignItems={"center"} flex={1}>
        <Box mb={2}>{getFeedbackIcon()}</Box>
        <Heading
          fontWeight="bold"
          size="2xl"
          letterSpacing="md"
          pb={2}
          textAlign="center"
        >
          {title}
        </Heading>
        {description && (
          <Text maxW="90%" lineHeight="md" fontSize="lg" textAlign="center">
            {description}
          </Text>
        )}
        {illustration && (
          <Image
            // any needed to cast from string of enum to type requested from source
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            source={imagesCollection[illustration] as any}
            alt="illustration"
          />
        )}
      </Box>
      {button && (
        <Button
          width={"full"}
          position="absolute"
          bottom={4}
          // TODO figure out type for navigator param here
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          accessibilityLabel="action button"
          onPress={handleButtonPress}
        >
          {button.caption}
        </Button>
      )}
    </VStack>
  );

  function handleButtonPress() {
    if (button?.callback) {
      button.callback();
    }
    if (button?.destinationScreen) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation.navigate(button.destinationScreen as any);
    }
  }
}

export default Feedback;
