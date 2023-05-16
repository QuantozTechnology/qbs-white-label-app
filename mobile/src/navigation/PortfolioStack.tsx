// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "native-base";
import { Tokens } from "../api/tokens/tokens.interface";
import { Transaction } from "../api/transactions/transactions.interface";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import AssetDetails from "../screens/AssetDetails";
import AssetsOverview from "../screens/AssetsOverview";
import CreatePaymentRequest from "../screens/CreatePaymentRequest";
import Funding from "../screens/Funding";
import PortfolioOverview from "../screens/PortfolioOverview";
import ReviewOffer from "../screens/ReviewOffer";
import SummaryPaymentRequest from "../screens/SummaryPaymentRequest";
import TokenDetails from "../screens/TokenDetails";
import TransactionDetails from "../screens/TransactionDetails";
import Withdraw from "../screens/Withdraw";
import CreateOfferTopTabsStack from "./CreateOfferTabsStack";
import SendStackNavigator from "./SendStack";

export type PortfolioStackParamList = {
  Portfolio: undefined;
  TransactionDetails: {
    transaction: Transaction;
  };
  CreatePaymentRequest: undefined;
  SummaryPaymentRequest: {
    code: string;
  };
  SendStack:
    | {
        screen: "Send";
        params: {
          accountCode: string;
          amount: number;
          message?: string;
        };
      }
    | undefined;
  Funding: undefined;
  Withdraw: undefined;
  TokenDetails: {
    tokenCode: string;
  };
  CreateOfferTabStack:
    | { screen: "CreateBuyOffer"; params: { token?: Tokens } }
    | {
        screen: "CreateSellOffer";
        params: { token?: Tokens };
      }
    | undefined;
  ReviewOffer: undefined;
  AssetsOverview: { sourceScreen: "CreateBuyOffer" | "CreateSellOffer" };
  AssetDetails: {
    tokenCode: string;
  };
};

const PortfolioStack = createNativeStackNavigator<PortfolioStackParamList>();

export default function PortfolioStackNavigator() {
  return (
    <PortfolioStack.Navigator>
      <PortfolioStack.Screen
        name="Portfolio"
        component={PortfolioOverview}
        options={{ headerShown: false }}
      />
      <PortfolioStack.Screen
        name="TransactionDetails"
        component={TransactionDetails}
        options={{
          presentation: "modal",
          title: "Transaction details",
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
      <PortfolioStack.Screen
        name="CreatePaymentRequest"
        component={CreatePaymentRequest}
        options={{
          title: "Create request",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <PortfolioStack.Screen
        name="SummaryPaymentRequest"
        component={SummaryPaymentRequest}
        options={{
          title: "Request summary",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <PortfolioStack.Screen
        name="SendStack"
        component={SendStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <PortfolioStack.Screen
        name="Funding"
        component={Funding}
        options={{
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <PortfolioStack.Screen
        name="Withdraw"
        component={Withdraw}
        options={{
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <PortfolioStack.Screen
        name="TokenDetails"
        component={TokenDetails}
        options={({ route }) => ({
          title: route.params.tokenCode,
          header: (props) => <CustomNavigationHeader {...props} />,
        })}
      />
      <PortfolioStack.Screen
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
      <PortfolioStack.Screen
        name="ReviewOffer"
        component={ReviewOffer}
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
      <PortfolioStack.Screen
        name="AssetsOverview"
        component={AssetsOverview}
        options={{
          title: "Assets",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <PortfolioStack.Screen
        name="AssetDetails"
        component={AssetDetails}
        options={{
          title: "Asset details",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
    </PortfolioStack.Navigator>
  );
}
