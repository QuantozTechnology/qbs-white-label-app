import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, IconButton } from "native-base";
import { CreateOfferPayload } from "../api/offers/offers.interface";
import { Tokens } from "../api/tokens/tokens.interface";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import AssetDetails from "../screens/AssetDetails";
import AssetsOverview from "../screens/AssetsOverview";
import OfferDetails from "../screens/OfferDetails";
import OffersList from "../screens/OffersList";
import ReviewCreatedOffer from "../screens/ReviewCreatedOffer";
import ReviewScannedOffer from "../screens/ReviewScannedOffer";
import ShareOffer from "../screens/ShareOffer";
import CreateOfferTopTabsStack from "./CreateOfferTabsStack";

export type OffersStackParamList = {
  CreateOfferTabStack:
  | {
    screen: "CreateBuyOfferStack";
    params: {
      screen: "CreateBuyOffer";
      params: { token?: Tokens };
    };
  }
  | {
    screen: "CreateSellOfferStack";
    params: {
      screen: "CreateSellOffer";
      params: {
        token?: Tokens;
      };
    };
  }
  | undefined;
  ReviewCreatedOffer: {
    offer: CreateOfferPayload;
  };
  ShareOffer: undefined;
  AssetsOverview: { sourceScreen: "CreateBuyOffer" | "CreateSellOffer" };
  AssetDetails: { tokenCode: string };
  OffersList: undefined;
  OfferDetails: undefined;
  ReviewScannedOffer: undefined;
};

const OffersStack = createNativeStackNavigator<OffersStackParamList>();

export default function OffersStackNavigator() {
  return (
    <OffersStack.Navigator>
      <OffersStack.Screen
        name="OffersList"
        component={OffersList}
        options={({ navigation }) => ({
          title: "Offers",
          header: (props) => (
            <CustomNavigationHeader
              {...props}
              rightHeaderIcons={
                <IconButton
                  icon={<Icon as={Ionicons} name="add" size="xl" />}
                  onPress={() => navigation.navigate("CreateOfferTabStack")}
                />
              }
            />
          ),
        })}
      />
      <OffersStack.Screen
        name="OfferDetails"
        component={OfferDetails}
        options={{
          title: "Details",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <OffersStack.Screen
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
      <OffersStack.Screen
        name="ReviewCreatedOffer"
        component={ReviewCreatedOffer}
        options={{
          title: "Review offer",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <OffersStack.Screen name="ShareOffer" component={ShareOffer} />
      <OffersStack.Screen
        name="AssetsOverview"
        component={AssetsOverview}
        options={{
          title: "Assets",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <OffersStack.Screen name="AssetDetails" component={AssetDetails} />
      <OffersStack.Screen
        name="ReviewScannedOffer"
        component={ReviewScannedOffer}
      />
    </OffersStack.Navigator>
  );
}
