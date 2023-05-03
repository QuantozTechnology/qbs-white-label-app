// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "native-base";
import { Transaction } from "../api/transactions/transactions.interface";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import CreatePaymentRequest from "../screens/CreatePaymentRequest";
import Funding from "../screens/Funding";
import PortfolioOverview from "../screens/PortfolioOverview";
import SummaryPaymentRequest from "../screens/SummaryPaymentRequest";
import TokenDetails from "../screens/TokenDetails";
import TransactionDetails from "../screens/TransactionDetails";
import Withdraw from "../screens/Withdraw";
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
        options={({route}) => ({
          title: route.params.tokenCode,
          header: (props) => <CustomNavigationHeader {...props} />,
        })}
      />
    </PortfolioStack.Navigator>
  );
}
