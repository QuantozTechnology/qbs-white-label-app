// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AvailableTokensList from "../components/AvailableTokensList";
import OwnedTokensList from "../components/OwnedTokensList";
import ScreenWrapper from "../components/ScreenWrapper";
import { OffersStackParamList } from "../navigation/OffersStack";

type TokensOverviewProps = NativeStackScreenProps<
  OffersStackParamList,
  "TokensOverview"
>;

function TokensOverview({ route }: TokensOverviewProps) {
  const { sourceScreen } = route.params;
  return (
    <ScreenWrapper flex={1}>
      <OwnedTokensList />
      {sourceScreen === "CreateBuyOffer" && <AvailableTokensList />}
    </ScreenWrapper>
  );
}

export default TokensOverview;
