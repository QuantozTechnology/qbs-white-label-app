// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsHome from "../screens/Settings";
import { SecurityCode } from "../screens/SecurityCode";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import { Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { RemoveAccount } from "../screens/RemoveAccount";

export type SettingsStackParamList = {
  SettingsHome: undefined;
  SecurityCode: undefined;
  RemoveAccount: undefined;
};

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsHome"
        component={SettingsHome}
        options={{
          title: "Settings",
          header: (props) => (
            <CustomNavigationHeader
              {...props}
              customIcon={
                <Icon
                  as={Ionicons}
                  name="close"
                  size="xl"
                  color="primary.500"
                />
              }
            />
          ),
        }}
      />
      <SettingsStack.Screen
        name="SecurityCode"
        component={SecurityCode}
        options={{
          title: "Security code",
          header: (props) => (
            <CustomNavigationHeader
              {...props}
              customIcon={
                <Icon
                  as={Ionicons}
                  name="close"
                  size="xl"
                  color="primary.500"
                />
              }
            />
          ),
        }}
      />
      <SettingsStack.Screen
        name="RemoveAccount"
        component={RemoveAccount}
        options={{
          title: "Remove Account",
          header: (props) => (
            <CustomNavigationHeader
              {...props}
              customIcon={
                <Icon
                  as={Ionicons}
                  name="close"
                  size="xl"
                  color="primary.500"
                />
              }
            />
          ),
        }}
      />
    </SettingsStack.Navigator>
  );
}
