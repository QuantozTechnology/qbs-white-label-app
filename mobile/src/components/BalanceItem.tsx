// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Heading, Text, View, VStack } from "native-base";
import { AccessibilityProps } from "react-native";
import { displayFiatAmount } from "../utils/currencies";

interface BalanceItemProps extends AccessibilityProps {
  balance: number;
  tokenCode: string;
  isSelected: boolean;
}

function BalanceItem({ balance, isSelected, tokenCode }: BalanceItemProps) {
  return (
    <View
      background="primary.500"
      p={2}
      flex={1}
      rounded="xl"
      accessibilityLabel={`${
        isSelected ? "selected" : "non selected"
      } balance item`}
    >
      {/* TODO does not wrap elements, needs fixed height. Not working well */}
      {/* <LinearGradient
        colors={["#189ad8", "#026a9c"]}
        style={{
          flex: 1,
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
        }}
        accessibilityLabel="balance item"
      /> */}
      <VStack p={3} justifyContent="center" alignItems="flex-start">
        <Heading
          size="2xl"
          fontWeight="bold"
          color="white"
          accessibilityLabel="balance"
        >
          {displayFiatAmount(balance, { alwaysRoundToTwoDecimals: true })}
        </Heading>
        <Text color="white" letterSpacing="xl" accessibilityLabel="token code">
          {tokenCode}
        </Text>
      </VStack>
    </View>
  );
}

export default BalanceItem;
