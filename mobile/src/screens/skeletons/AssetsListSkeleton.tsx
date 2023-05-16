import { Skeleton } from "native-base";
import ScreenWrapper from "../../components/ScreenWrapper";

function AssetsListSkeleton() {
  return (
    <ScreenWrapper space={2} px={-4}>
      <Skeleton w={32} h={4} />
      <Skeleton h={20} rounded="md" />
      <Skeleton h={20} rounded="md" />
      <Skeleton h={20} rounded="md" />
      <Skeleton h={20} rounded="md" />
    </ScreenWrapper>
  );
}

export default AssetsListSkeleton;
