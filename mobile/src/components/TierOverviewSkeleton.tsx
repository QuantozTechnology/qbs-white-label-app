// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HStack, Skeleton, VStack } from "native-base";

function TierOverviewSkeleton() {
  return (
    <HStack bg="primary.100" p={4} space={3}>
      <Skeleton size="10" rounded="full" />
      <VStack space={1} flex={1}>
        <Skeleton w={44} h={6} my={2} rounded="md" />
        <Skeleton w={150} h={4} rounded="full" />
        <Skeleton w={150} h={4} rounded="full" />
        <VStack space={2} pt={4}>
          <Skeleton w={100} h={3} rounded="full" />
          <Skeleton w={100} h={3} rounded="full" />
          <Skeleton w={100} h={3} rounded="full" />
        </VStack>
      </VStack>
    </HStack>
  );
}

export default TierOverviewSkeleton;
