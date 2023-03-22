// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PaymentRequestsList from "../screens/PaymentRequestsList";
import { customTheme } from "../theme/theme";

export type PaymentRequestsTabParamList = {
  Active: undefined;
  Expired: undefined;
};

const PaymentRequestsTopTabs =
  createMaterialTopTabNavigator<PaymentRequestsTabParamList>();

export default function PaymentRequestsTopTabsStack() {
  const { colors } = customTheme;
  return (
    <PaymentRequestsTopTabs.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontWeight: "bold" },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text[400],
        tabBarIndicatorStyle: { backgroundColor: colors.primary[500] },
      }}
    >
      <PaymentRequestsTopTabs.Screen
        name="Active"
        component={PaymentRequestsList}
      />
      <PaymentRequestsTopTabs.Screen
        name="Expired"
        component={PaymentRequestsList}
      />
    </PaymentRequestsTopTabs.Navigator>
  );
}
