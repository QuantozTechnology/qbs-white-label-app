// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Heading, Skeleton, Text, View, VStack } from "native-base";

function BalanceItemSkeleton() {
  return (
    <View
      background="primary.500"
      p={4}
      flex={1}
      rounded="xl"
      accessibilityLabel="balance item loading"
    >
      {/* <LinearGradient
        colors={["#189ad8", "#026a9c"]}
        style={{
          flex: 1,
          padding: 16,
          borderRadius: 16,
        }}
        accessibilityLabel="balance item loading"
      /> */}
      <VStack p={3} space={2}>
        <Skeleton w={150} h={9} rounded="md">
          <Heading size="2xl" fontWeight="bold" color="white" />
        </Skeleton>
        <Skeleton w={30} h={4} rounded="md">
          <Text color="white" letterSpacing="xl" />
        </Skeleton>
      </VStack>
    </View>
  );
}

export default BalanceItemSkeleton;
