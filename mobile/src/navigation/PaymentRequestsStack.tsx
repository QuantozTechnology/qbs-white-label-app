// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, IconButton } from "native-base";
import { PaymentRequestDetails as PaymentRequestDetailsType } from "../api/paymentrequest/paymentRequest.interface";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import CreatePaymentRequest from "../screens/CreatePaymentRequest";
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
  CreatePaymentRequest: undefined;
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
                    onPress={() => navigation.navigate("CreatePaymentRequest")}
                  />
                }
              />
            );
          },
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
              onPressCallback={() =>
                // eslint-disable-next-line react/prop-types
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: "PaymentRequestTabs" }],
                })
              }
            />
          ),
        }}
      />
      <PaymentRequestsNativeStack.Screen
        name="CreatePaymentRequest"
        component={CreatePaymentRequest}
        options={{
          title: "Create request",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
    </PaymentRequestsNativeStack.Navigator>
  );
}
