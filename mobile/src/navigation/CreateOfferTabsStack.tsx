// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { customTheme } from "../theme/theme";
import CreateBuyOfferStack from "./CreateBuyOfferStack";
import CreateSellOfferStack from "./CreateSellOfferStack";

export type CreateOfferTabsParamList = {
  CreateBuyOfferStack: undefined;
  CreateSellOfferStack: undefined;
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
        name="CreateBuyOfferStack"
        component={CreateBuyOfferStack}
        options={{ title: "Buy" }}
      />
      <CreateOfferTopTabs.Screen
        name="CreateSellOfferStack"
        component={CreateSellOfferStack}
        options={{ title: "Sell" }}
      />
    </CreateOfferTopTabs.Navigator>
  );
}
