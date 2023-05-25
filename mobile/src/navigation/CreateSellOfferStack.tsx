// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Tokens } from "../api/tokens/tokens.interface";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import AssetDetails from "../screens/AssetDetails";
import AssetsOverview from "../screens/AssetsOverview";
import CreateSellOffer from "../screens/CreateSellOffer";

export type CreateSellOfferStackParamList = {
  CreateSellOffer: {
    token?: Tokens;
    sourceScreen: "CreateSellOffer";
  };
  AssetsOverview: { sourceScreen: "CreateSellOffer" };
  AssetDetails: { tokenCode: string };
};

const CreateSellOfferStack =
  createNativeStackNavigator<CreateSellOfferStackParamList>();

export default function CreateSellOfferStackNavigator() {
  return (
    <CreateSellOfferStack.Navigator>
      <CreateSellOfferStack.Screen
        name="CreateSellOffer"
        component={CreateSellOffer}
        options={{
          headerShown: false,
        }}
      />
      <CreateSellOfferStack.Screen
        name="AssetsOverview"
        component={AssetsOverview}
        options={{
          title: "Assets",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <CreateSellOfferStack.Screen
        name="AssetDetails"
        component={AssetDetails}
        options={{
          title: "Details",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
    </CreateSellOfferStack.Navigator>
  );
}
