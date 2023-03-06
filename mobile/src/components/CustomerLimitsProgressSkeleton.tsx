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
