// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Skeleton, VStack } from "native-base";

type ReviewOfferAmountSkeletonProps = {
  showThirdLineSkeleton?: boolean;
};

function ReviewOfferAmountSkeleton({
  showThirdLineSkeleton = false,
}: ReviewOfferAmountSkeletonProps) {
  return (
    <VStack
      bg="white"
      justifyContent="center"
      alignItems="center"
      py={6}
      borderRadius="md"
      space={2}
    >
      <Skeleton w={130} />
      <Skeleton w={200} />
      {showThirdLineSkeleton && <Skeleton w={100} h={4} />}
    </VStack>
  );
}

export default ReviewOfferAmountSkeleton;
