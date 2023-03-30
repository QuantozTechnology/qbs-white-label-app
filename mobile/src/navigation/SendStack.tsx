// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, IconButton } from "native-base";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import Feedback from "../screens/Feedback";
import ScanQrCode from "../screens/ScanQrCode";
import Send from "../screens/Send";
import SendSummary from "../screens/SendSummary";
import { FeedbackProps } from "./WelcomeStack";

export type SendStackParamList = {
  Send:
    | {
        accountCode: string;
        amount: number;
        message?: string;
      }
    | undefined;
  ScanQrCode: undefined;
  SendSummary: {
    code: string;
  };
  Feedback: FeedbackProps;
};

const SendStack = createNativeStackNavigator<SendStackParamList>();

export default function SendStackNavigator() {
  return (
    <SendStack.Navigator>
      <SendStack.Screen
        name="Send"
        component={Send}
        options={{
          title: "Send",
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
                        name="qr-code-outline"
                        size="xl"
                        color="primary.500"
                      />
                    }
                    // It wrongly parses navigate as missing prop types, while it's declared in props (NativeStackHeaderProps)
                    // eslint-disable-next-line react/prop-types
                    onPress={() => navigation.navigate("ScanQrCode")}
                  />
                }
              />
            );
          },
        }}
      />
      <SendStack.Screen
        name="ScanQrCode"
        component={ScanQrCode}
        options={{
          title: "Scan payment request",
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
      <SendStack.Screen
        name="SendSummary"
        component={SendSummary}
        options={{
          title: "Payment summary",
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
              onPressCallback={() => props.navigation.navigate("Portfolio")}
            />
          ),
        }}
      />
      <SendStack.Screen name="Feedback" component={Feedback} />
    </SendStack.Navigator>
  );
}
