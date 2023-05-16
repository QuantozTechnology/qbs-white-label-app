// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Tokens } from "../api/tokens/tokens.interface";
import CreateBuyOffer from "../screens/CreateBuyOffer";
import CreateSellOffer from "../screens/CreateSellOffer";
import { customTheme } from "../theme/theme";

export type CreateOfferTabsParamList = {
  CreateBuyOffer: {
    token?: Tokens;
    sourceScreen: "CreateBuyOffer";
  };
  CreateSellOffer: {
    token?: Tokens;
    sourceScreen: "CreateSellOffer";
  };
};

const CreateOfferTopTabs =
  createMaterialTopTabNavigator<CreateOfferTabsParamList>();

export default function CreateOfferTopTabsStack() {
  const { colors } = customTheme;
  return (
    <CreateOfferTopTabs.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontWeight: "bold" },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text[400],
        tabBarIndicatorStyle: { backgroundColor: colors.primary[500] },
        title: "Create offer",
      }}
    >
      <CreateOfferTopTabs.Screen
        name="CreateBuyOffer"
        component={CreateBuyOffer}
        options={{ title: "Buy" }}
      />
      <CreateOfferTopTabs.Screen
        name="CreateSellOffer"
        component={CreateSellOffer}
        options={{ title: "Sell" }}
      />
    </CreateOfferTopTabs.Navigator>
  );
}
