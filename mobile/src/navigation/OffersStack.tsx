import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, IconButton } from "native-base";
import { CreateOfferPayload, Offer } from "../api/offers/offers.interface";
import { Tokens } from "../api/tokens/tokens.interface";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import TokenDetails from "../screens/TokenDetails";
import TokensOverview from "../screens/TokensOverview";
import OfferDetails from "../screens/OfferDetails";
import ReviewCreatedOffer from "../screens/ReviewCreatedOffer";
import ReviewScannedOffer from "../screens/ReviewScannedOffer";
import ShareOffer from "../screens/ShareOffer";
import CreateOfferTopTabsStack from "./CreateOfferTabsStack";
import OffersTabsStackNavigator from "./OffersListTabsStack";

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
  TokensOverview: { sourceScreen: "CreateBuyOffer" | "CreateSellOffer" };
  TokenDetails: { tokenCode: string };
  OffersList: undefined;
  OfferDetails: {
    offer: Offer;
    offerStatus: "Open" | "Closed";
  };
  ReviewScannedOffer: {
    code: string;
  };
};

const OffersStack = createNativeStackNavigator<OffersStackParamList>();

export default function OffersStackNavigator() {
  return (
    <OffersStack.Navigator>
      <OffersStack.Screen
        name="OffersList"
        component={OffersTabsStackNavigator}
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
        options={({ route }) => {
          return {
            title: `${route.params.offer.action} order details`,
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
                rightHeaderIcons={
                  <Icon
                    as={Ionicons}
                    color="primary.500"
                    size="lg"
                    name="trash-outline"
                  />
                }
              />
            ),
          };
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
        name="TokensOverview"
        component={TokensOverview}
        options={{
          title: "Assets",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <OffersStack.Screen
        name="TokenDetails"
        component={TokenDetails}
        options={({ route }) => ({
          title: route.params.tokenCode,
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
        })}
      />
      <OffersStack.Screen
        name="ReviewScannedOffer"
        component={ReviewScannedOffer}
        options={{
          title: "Review offer",
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
    </OffersStack.Navigator>
  );
}
