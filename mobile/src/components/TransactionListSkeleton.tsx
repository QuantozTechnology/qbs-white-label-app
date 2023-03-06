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
