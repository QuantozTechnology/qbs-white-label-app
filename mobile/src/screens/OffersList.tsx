// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import OffersListComponent from "../components/OffersList";
import ScreenWrapper from "../components/ScreenWrapper";
import { OfferOverviewStackParamList } from "../navigation/OfferOverviewStack";
import { OffersListStackParamList } from "../navigation/OffersListTabsStack";

type OffersListProps = NativeStackScreenProps<
  OfferOverviewStackParamList,
  "OffersList"
>;

type OffersTabsProps = MaterialTopTabScreenProps<OffersListStackParamList>;
function OffersList({ route }: OffersListProps | OffersTabsProps) {
  const { offerStatus } = route.params;
  return (
    <ScreenWrapper flex={1}>
      <OffersListComponent type={offerStatus} />
    </ScreenWrapper>
  );
}

export default OffersList;
