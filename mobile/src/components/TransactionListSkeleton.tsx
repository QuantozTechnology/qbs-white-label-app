// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { VStack } from "native-base";
import TransactionListItemSkeleton from "./TransactionListItemSkeleton";

function TransactionListSkeleton() {
  return (
    <VStack space={4} mt={4} accessibilityLabel="loading transactions">
      <TransactionListItemSkeleton />
      <TransactionListItemSkeleton />
      <TransactionListItemSkeleton />
    </VStack>
  );
}

export default TransactionListSkeleton;
