// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text } from "native-base";
import ScreenWrapper from "../components/ScreenWrapper";
import { OfferOverviewStackParamList } from "../navigation/OfferOverviewStack";

type AssetDetailsProps = NativeStackScreenProps<
  OfferOverviewStackParamList,
  "AssetDetails"
>;

function AssetDetails({ route }: AssetDetailsProps) {
  const { tokenCode } = route.params;

  return (
    <ScreenWrapper flex={1}>
      <Text>{tokenCode}</Text>
    </ScreenWrapper>
  );
}

export default AssetDetails;
