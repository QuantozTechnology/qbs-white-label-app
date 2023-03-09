// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { LinearGradient } from "expo-linear-gradient";
import { Heading, Text, VStack } from "native-base";

function BalanceItemError() {
  return (
    <LinearGradient
      colors={["#189ad8", "#026a9c"]}
      style={{
        flex: 1,
        padding: 16,
        borderRadius: 16,
      }}
      accessibilityLabel="balance item"
    >
      <VStack p={3} justifyContent="center" alignItems="flex-start">
        <Heading
          size="2xl"
          fontWeight="bold"
          color="white"
          accessibilityLabel="balance error"
        >
          N/A
        </Heading>
        <Text
          color="white"
          letterSpacing="xl"
          accessibilityLabel="token code error"
        >
          N/A
        </Text>
      </VStack>
    </LinearGradient>
  );
}

export default BalanceItemError;
