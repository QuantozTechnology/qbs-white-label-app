// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { HStack, Icon, IconButton, Progress, Text, VStack } from "native-base";

function CustomerLimitsProgressError() {
  return (
    <VStack
      background="white"
      p={4}
      space={1}
      accessibilityLabel="limits error"
    >
      <Progress size="md" value={100} colorScheme={"error"} />
      <HStack alignItems="center">
        <IconButton
          icon={
            <Icon
              as={Ionicons}
              name="information-circle-outline"
              size="md"
              color="primary.500"
              mr={2}
            />
          }
          p={1}
        />

        <Text
          fontSize="sm"
          color="error.500"
          fontWeight={"black"}
          accessibilityLabel="limits error message"
        >
          Could not load limits. Try again later
        </Text>
      </HStack>
    </VStack>
  );
}

export default CustomerLimitsProgressError;
