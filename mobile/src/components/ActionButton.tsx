// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { FontAwesome5 } from "@expo/vector-icons";
import { Box, Icon, Pressable, Text, VStack } from "native-base";

type ActionButtonProps = {
  iconName: string;
  label: string;
  onPressCallback: () => void;
  variant?: "solid" | "outline";
};

function ActionButton({
  iconName,
  label,
  onPressCallback,
  variant = "solid",
}: ActionButtonProps) {
  return (
    <Pressable onPress={onPressCallback} accessibilityLabel="action button">
      <VStack alignItems="center">
        <Box
          background={variant === "solid" ? "primary.500" : "transparent"}
          borderWidth={2}
          borderColor={"primary.500"}
          borderRadius="full"
          mb={1}
          p={3}
        >
          <Icon
            as={FontAwesome5}
            name={iconName}
            color="white"
            textAlign="center"
            size="sm"
            accessibilityLabel="action button icon"
          />
        </Box>
        <Text color="white" accessibilityLabel="action button label">
          {label}
        </Text>
      </VStack>
    </Pressable>
  );
}

export default ActionButton;
