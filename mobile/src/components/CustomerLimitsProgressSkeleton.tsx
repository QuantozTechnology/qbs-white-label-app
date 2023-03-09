// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Skeleton, VStack } from "native-base";

type ICustomerLimitsProgressSkeleton = {
  hideDescriptionLines?: boolean;
};

function CustomerLimitsProgressSkeleton({
  hideDescriptionLines = false,
}: ICustomerLimitsProgressSkeleton) {
  return (
    <VStack space={3} p={4} bg="white">
      {!hideDescriptionLines && <Skeleton.Text lines={1} w="32" h="2" />}
      <Skeleton h="3" rounded="md" />
      <Skeleton.Text lines={1} w="40" h="4" />
    </VStack>
  );
}

export default CustomerLimitsProgressSkeleton;
