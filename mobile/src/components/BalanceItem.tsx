// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import {
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  View,
  VStack,
} from "native-base";
import { AccessibilityProps } from "react-native";
import { displayFiatAmount } from "../utils/currencies";
import { Ionicons } from "@expo/vector-icons";

interface BalanceItemProps extends AccessibilityProps {
  balance: number;
  tokenCode: string;
  isSelected: boolean;
  onOpenTokenList: () => void;
  theme?: "dark" | "light";
}

function BalanceItem({
  balance,
  isSelected,
  tokenCode,
  onOpenTokenList,
  theme = "dark",
}: BalanceItemProps) {
  return (
    <View
      p={2}
      rounded="xl"
      accessibilityLabel={`${
        isSelected ? "selected" : "non selected"
      } balance item`}
    >
      <HStack alignItems="center">
        <VStack p={3} justifyContent="center" alignItems="flex-start">
          <Heading
            size="3xl"
            letterSpacing="md"
            fontWeight="bold"
            color={theme === "dark" ? "white" : "primary.900"}
            accessibilityLabel="balance"
          >
            {displayFiatAmount(balance, { decimals: 2 })}
          </Heading>
          <Text
            color={theme === "dark" ? "white" : "primary.900"}
            letterSpacing="xl"
            accessibilityLabel="token code"
          >
            {tokenCode}
          </Text>
        </VStack>
        <IconButton
          bg={theme === "dark" ? "primary.900" : "primary.500"}
          icon={<Icon as={Ionicons} name="chevron-down" color="white" />}
          rounded="full"
          size="xs"
          onPress={onOpenTokenList}
        ></IconButton>
      </HStack>
    </View>
  );
}

export default BalanceItem;
