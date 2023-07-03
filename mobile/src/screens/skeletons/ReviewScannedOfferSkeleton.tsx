// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import ScreenWrapper from "../../components/ScreenWrapper";
import GenericListItemSkeleton from "../../components/skeletons/GenericListItemSkeleton";
import ReviewOfferAmountSkeleton from "../../components/skeletons/ReviewOfferAmountSkeleton";

function ReviewScannedOfferSkeleton() {
  return (
    <ScreenWrapper flex={1} space={2}>
      <ReviewOfferAmountSkeleton showThirdLineSkeleton />
      <GenericListItemSkeleton />
      <GenericListItemSkeleton />
      <GenericListItemSkeleton />
      <GenericListItemSkeleton />
    </ScreenWrapper>
  );
}

export default ReviewScannedOfferSkeleton;
