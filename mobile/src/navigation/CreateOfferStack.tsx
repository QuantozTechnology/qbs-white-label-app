// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "native-base";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import AssetDetails from "../screens/AssetDetails";
import AssetsOverview from "../screens/AssetsOverview";
import CreateOfferSummary from "../screens/CreateOfferSummary";
import ShareOffer from "../screens/ShareOffer";
import CreateOfferTopTabsStack from "./CreateOfferTabsStack";

export type CreateOfferStackParamList = {
  AssetsOverview: { sourceScreen: "CreateBuyOffer" | "CreateSellOffer" };
  AssetDetails: { tokenCode: string };
  CreateOfferSummary: undefined;
  ShareOffer: undefined;
  CreateOfferTabsStack: undefined;
};

const CreateOfferStack =
  createNativeStackNavigator<CreateOfferStackParamList>();

export default function CreateOfferStackNavigator() {
  return (
    <CreateOfferStack.Navigator>
      <CreateOfferStack.Screen
        name="CreateOfferSummary"
        component={CreateOfferSummary}
        options={{
          title: "Summary",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <CreateOfferStack.Screen
        name="AssetsOverview"
        component={AssetsOverview}
        options={{
          title: "Assets",
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
      <CreateOfferStack.Screen
        name="AssetDetails"
        component={AssetDetails}
        options={{
          title: "Details",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <CreateOfferStack.Screen
        name="ShareOffer"
        component={ShareOffer}
        options={{
          title: "Share",
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
      <CreateOfferStack.Screen
        name="CreateOfferTabsStack"
        component={CreateOfferTopTabsStack}
        options={{
          title: "Create offer",
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
    </CreateOfferStack.Navigator>
  );
}
