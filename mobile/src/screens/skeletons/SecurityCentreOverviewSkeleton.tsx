// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
