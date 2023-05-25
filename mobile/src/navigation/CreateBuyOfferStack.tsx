// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Tokens } from "../api/tokens/tokens.interface";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import AssetDetails from "../screens/AssetDetails";
import AssetsOverview from "../screens/AssetsOverview";
import CreateBuyOffer from "../screens/CreateBuyOffer";

export type CreateBuyOfferStackParamList = {
  CreateBuyOffer: {
    token?: Tokens;
    sourceScreen: "CreateBuyOffer";
  };
  AssetsOverview: { sourceScreen: "CreateBuyOffer" };
  AssetDetails: { tokenCode: string };
};

const CreateBuyOfferStack =
  createNativeStackNavigator<CreateBuyOfferStackParamList>();

export default function CreateBuyOfferStackNavigator() {
  return (
    <CreateBuyOfferStack.Navigator>
      <CreateBuyOfferStack.Screen
        name="CreateBuyOffer"
        component={CreateBuyOffer}
        options={{
          headerShown: false,
        }}
      />
      <CreateBuyOfferStack.Screen
        name="AssetsOverview"
        component={AssetsOverview}
        options={{
          title: "Assets",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <CreateBuyOfferStack.Screen
        name="AssetDetails"
        component={AssetDetails}
        options={{
          title: "Details",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
    </CreateBuyOfferStack.Navigator>
  );
}
