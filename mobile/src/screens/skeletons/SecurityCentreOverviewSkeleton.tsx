import { VStack } from "native-base";
import CustomerLimitsProgressSkeleton from "../../components/CustomerLimitsProgressSkeleton";
import TierOverviewSkeleton from "../../components/TierOverviewSkeleton";

function SecurityCentreOverviewSkeleton() {
  return (
    <VStack bg="primary.100">
      <CustomerLimitsProgressSkeleton />
      <CustomerLimitsProgressSkeleton />
      <TierOverviewSkeleton />
      <TierOverviewSkeleton />
      <TierOverviewSkeleton />
    </VStack>
  );
}

export default SecurityCentreOverviewSkeleton;
