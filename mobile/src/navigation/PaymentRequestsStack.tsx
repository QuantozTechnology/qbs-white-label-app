// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "native-base";
import { PaymentRequestDetails as PaymentRequestDetailsType } from "../api/paymentrequest/paymentRequest.interface";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import PaymentRequestDetails from "../screens/PaymentRequestDetails";
import SummaryPaymentRequest from "../screens/SummaryPaymentRequest";
import PaymentRequestsTopTabsStack from "./PaymentRequestsTab";

export type PaymentRequestsStackParamList = {
  PaymentRequestTabs: undefined;
  PaymentRequestDetails: {
    details: PaymentRequestDetailsType;
  };
  SummaryPaymentRequest: {
    code: string;
  };
};

const PaymentRequestsNativeStack =
  createNativeStackNavigator<PaymentRequestsStackParamList>();

export default function PaymentRequestsNativeStackNavigator() {
  return (
    <PaymentRequestsNativeStack.Navigator>
      <PaymentRequestsNativeStack.Screen
        name="PaymentRequestTabs"
        component={PaymentRequestsTopTabsStack}
        options={{
          title: "Payment requests",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <PaymentRequestsNativeStack.Screen
        name="PaymentRequestDetails"
        component={PaymentRequestDetails}
        options={{
          title: "Payment request",
        }}
      />
      <PaymentRequestsNativeStack.Screen
        name="SummaryPaymentRequest"
        component={SummaryPaymentRequest}
        options={{
          title: "Request summary",
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
              // eslint-disable-next-line react/prop-types
              // onPressCallback={() => props.navigation.navigate("Portfolio")}
            />
          ),
        }}
      />
    </PaymentRequestsNativeStack.Navigator>
  );
}
