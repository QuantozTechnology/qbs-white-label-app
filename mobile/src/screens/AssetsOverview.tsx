// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AvailableAssetsList from "../components/AvailableAssetsList";
import OwnedAssetsList from "../components/OwnedAssetsList";
import ScreenWrapper from "../components/ScreenWrapper";
import { OffersStackParamList } from "../navigation/OffersStack";

type AssetsOverviewProps = NativeStackScreenProps<
  OffersStackParamList,
  "AssetsOverview"
>;

function AssetsOverview({ route }: AssetsOverviewProps) {
  const { sourceScreen } = route.params;
  return (
    <ScreenWrapper flex={1}>
      <OwnedAssetsList />
      {sourceScreen === "CreateBuyOffer" && <AvailableAssetsList />}
    </ScreenWrapper>
  );
}

export default AssetsOverview;
