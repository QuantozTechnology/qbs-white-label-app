// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import UserProfile from "../screens/UserProfile";
import UpgradeAccountStackNavigator from "./UpgradeAccountStack";

export type UserProfileStackParamList = {
  UserProfile: undefined;
  UpgradeAccountStack: undefined;
};

const UserProfileStackNav =
  createNativeStackNavigator<UserProfileStackParamList>();

export default function UserProfileStack() {
  return (
    <UserProfileStackNav.Navigator>
      <UserProfileStackNav.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          title: "My account",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <UserProfileStackNav.Screen
        name="UpgradeAccountStack"
        component={UpgradeAccountStackNavigator}
        options={{
          title: "Upgrade account",
          headerShown: false,
        }}
      />
    </UserProfileStackNav.Navigator>
  );
}
