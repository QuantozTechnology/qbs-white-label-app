// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Skeleton } from "native-base";
import ScreenWrapper from "../../components/ScreenWrapper";

function TokensListSkeleton() {
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

export default TokensListSkeleton;
