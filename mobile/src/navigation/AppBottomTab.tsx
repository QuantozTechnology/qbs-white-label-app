// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute, Route } from "@react-navigation/native";
import { useCustomer } from "../api/customer/customer";
import { defaultConfig } from "../config/config";
import Support from "../screens/Support";
import { composeEmail } from "../utils/email";
import PortfolioStackNavigator from "./PortfolioStack";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import CustomTabBarLabel from "../components/CustomTabBarLabel";
import CustomTabBarIcon from "../components/CustomTabBarIcon";
import UserProfileStack from "./UserProfileStack";
import { TouchableOpacity } from "react-native";
import PaymentRequestsNativeStackNavigator from "./PaymentRequestsStack";

export type AppBottomTabParamList = {
  PortfolioOverview: undefined;
  PaymentRequests: undefined;
  UserProfileStack: undefined;
  Support: undefined;
};

const AppBottomTab = createBottomTabNavigator<AppBottomTabParamList>();

export default function AppBottomTabNavigator() {
  const { data } = useCustomer();

  const getTabBarVisibility = (route: Partial<Route<string>>) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    // list of screens on which we do not show the bottom tab
    const hideOnScreens = [
      "TransactionDetails",
      "CreatePaymentRequest",
      "SummaryPaymentRequest",
      "SendStack",
      "Funding",
      "Withdraw",
      "TierTwo",
      "TierThree",
      "DocumentUploadOptions",
      "TakePhoto",
      "Feedback",
      "ReviewPhoto",
      "UpgradeAccountStack",
      "PaymentRequestDetails",
      "TokenDetails",
    ];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return hideOnScreens.indexOf(routeName!) <= -1;
  };

  async function handleSupportPress() {
    const emailRecipient = defaultConfig.supportEmail;
    const emailSubject = "Support request - Quantoz Blockchain Solutions";
    const emailBody = `Please provide a detailed description of the issue you are experiencing. Be sure to leave the information below as it is.
    
    ---------------------
    My account email: ${data?.data.value.email ?? "not available"}`;

    await composeEmail({
      recipients: [emailRecipient],
      subject: emailSubject,
      body: emailBody,
    });
  }

  return (
    <AppBottomTab.Navigator
      screenOptions={{
        tabBarItemStyle: { padding: 4 },
        headerShown: false,
      }}
    >
      <AppBottomTab.Screen
        name="PortfolioOverview"
        component={PortfolioStackNavigator}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route) ? "flex" : "none",
          },
          title: "Home",
          tabBarLabel({ focused }) {
            return <CustomTabBarLabel focused={focused} label="Home" />;
          },
          tabBarIcon: ({ focused }) => {
            return <CustomTabBarIcon focused={focused} iconName="home" />;
          },
        })}
      />
      <AppBottomTab.Screen
        name="PaymentRequests"
        component={PaymentRequestsNativeStackNavigator}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route) ? "flex" : "none",
          },
          title: "Payment requests",
          tabBarLabel({ focused }) {
            return <CustomTabBarLabel focused={focused} label="Requests" />;
          },
          tabBarIcon: ({ focused }) => {
            return (
              <CustomTabBarIcon focused={focused} iconName="calendar-alt" />
            );
          },
          headerShown: false,
        })}
      />
      <AppBottomTab.Screen
        name="UserProfileStack"
        component={UserProfileStack}
        options={({ route }) => ({
          title: "My account",
          tabBarLabel({ focused }) {
            return <CustomTabBarLabel focused={focused} label="My account" />;
          },
          tabBarStyle: {
            display: getTabBarVisibility(route) ? "flex" : "none",
          },
          tabBarIcon: ({ focused }) => {
            return <CustomTabBarIcon focused={focused} iconName="user" />;
          },
          header: (props) => <CustomNavigationHeader {...props} />,
        })}
      />
      <AppBottomTab.Screen
        name="Support"
        component={Support}
        options={{
          title: "Support",
          headerShown: true,
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={handleSupportPress} />
          ),
          tabBarLabel({ focused }) {
            return <CustomTabBarLabel focused={focused} label="Support" />;
          },
          tabBarIcon: ({ focused }) => {
            return (
              <CustomTabBarIcon focused={focused} iconName="question-circle" />
            );
          },
        }}
      ></AppBottomTab.Screen>
    </AppBottomTab.Navigator>
  );
}
