// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Skeleton, VStack } from "native-base";

function TransactionListItemSkeleton() {
  return (
    <VStack space={1}>
      <Skeleton w={100} h={3} rounded="md" />
      <Skeleton h={16} rounded="md" />
      <Skeleton h={16} rounded="md" />
    </VStack>
  );
}

export default TransactionListItemSkeleton;
