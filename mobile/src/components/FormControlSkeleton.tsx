import { Skeleton, VStack } from "native-base";

function FormControlSkeleton() {
  return (
    <VStack space={1} mb={1}>
      <Skeleton height={3} w={16} borderRadius="md" />
      <Skeleton height={12} borderRadius="md" />
    </VStack>
  );
}

export default FormControlSkeleton;
