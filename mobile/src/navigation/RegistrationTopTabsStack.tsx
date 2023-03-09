// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BusinessRegistration from "../screens/BusinessRegistration";
import ConsumerRegistration from "../screens/ConsumerRegistration";
import { customTheme } from "../theme/theme";
import { FeedbackProps } from "./WelcomeStack";

export type RegistrationStackParamList = {
  Consumer: undefined;
  Business: undefined;
  Feedback: FeedbackProps;
};

const RegistrationTopTabs =
  createMaterialTopTabNavigator<RegistrationStackParamList>();

export default function RegistrationTopTabsStack() {
  const { colors } = customTheme;
  return (
    <RegistrationTopTabs.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontWeight: "bold" },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text[400],
        tabBarIndicatorStyle: { backgroundColor: colors.primary[500] },
      }}
    >
      <RegistrationTopTabs.Screen
        name="Consumer"
        component={ConsumerRegistration}
      />
      <RegistrationTopTabs.Screen
        name="Business"
        component={BusinessRegistration}
      />
    </RegistrationTopTabs.Navigator>
  );
}
