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
