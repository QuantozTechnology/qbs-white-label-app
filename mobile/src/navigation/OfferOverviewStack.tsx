// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, IconButton } from "native-base";
import { Tokens } from "../api/tokens/tokens.interface";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import TokenDetails from "../screens/TokenDetails";
import TokensOverview from "../screens/TokensOverview";
import OfferDetails from "../screens/OfferDetails";
import OffersList from "../screens/OffersList";
import CreateOfferTopTabsStack from "./CreateOfferTabsStack";
import { Offer } from "../api/offers/offers.interface";

export type OfferOverviewStackParamList = {
  OffersList: {
    offerStatus: "Open" | "Closed";
  };
  OfferDetails: {
    offer: Offer;
    offerStatus: "Open" | "Closed";
  };
  CreateOfferTabStack:
    | { screen: "CreateBuyOffer"; params: { token?: Tokens } }
    | { screen: "CreateSellOffer"; params: { token?: Tokens } }
    | undefined;
  TokensOverview: { sourceScreen: "CreateBuyOffer" | "CreateSellOffer" };
  TokenDetails: { tokenCode: string };
};

const OfferStack = createNativeStackNavigator<OfferOverviewStackParamList>();

export default function OfferStackNavigator() {
  return (
    <OfferStack.Navigator>
      <OfferStack.Screen
        name="OffersList"
        component={OffersList}
        options={{
          title: "Offers",
          header: (props) => {
            // It wrongly parses navigation as missing props types, while it's declared in props (NativeStackHeaderProps)
            // eslint-disable-next-line react/prop-types
            const { navigation } = props;
            return (
              <CustomNavigationHeader
                {...props}
                rightHeaderIcons={
                  <IconButton
                    icon={
                      <Icon
                        as={Ionicons}
                        name="add"
                        size="xl"
                        color="primary.500"
                      />
                    }
                    // It wrongly parses navigate as missing prop types, while it's declared in props (NativeStackHeaderProps)
                    // eslint-disable-next-line react/prop-types
                    onPress={() => navigation.navigate("CreateOfferTabStack")}
                  />
                }
              />
            );
          },
        }}
      />
      <OfferStack.Screen
        name="OfferDetails"
        component={OfferDetails}
        options={{
          title: "Offer details",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <OfferStack.Screen
        name="CreateOfferTabStack"
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
      <OfferStack.Screen
        name="TokensOverview"
        component={TokensOverview}
        options={{
          title: "Assets",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <OfferStack.Screen
        name="TokenDetails"
        component={TokenDetails}
        options={{
          title: "Asset details",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
    </OfferStack.Navigator>
  );
}
