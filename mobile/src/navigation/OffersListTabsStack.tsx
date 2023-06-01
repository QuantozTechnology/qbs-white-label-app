// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import OffersList from "../screens/OffersList";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { customTheme } from "../theme/theme";

export type OffersListStackParamList = {
  OpenOffers: { offerStatus: "Open" };
  ClosedOffers: { offerStatus: "Closed" };
  // TODO add details screen
};

const OffersTabsStack =
  createMaterialTopTabNavigator<OffersListStackParamList>();

export default function OffersTabsStackNavigator() {
  const { colors } = customTheme;

  return (
    <OffersTabsStack.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontWeight: "bold" },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text[400],
        tabBarIndicatorStyle: { backgroundColor: colors.primary[500] },
        title: "Create offer",
      }}
    >
      <OffersTabsStack.Screen
        name="OpenOffers"
        component={OffersList}
        initialParams={{ offerStatus: "Open" }}
        options={{
          title: "Open",
        }}
      />
      <OffersTabsStack.Screen
        name="ClosedOffers"
        component={OffersList}
        initialParams={{ offerStatus: "Closed" }}
        options={{
          title: "Closed",
        }}
      />
    </OffersTabsStack.Navigator>
  );
}
