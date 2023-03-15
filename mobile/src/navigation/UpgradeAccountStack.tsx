// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CameraType } from "expo-camera";
import { Icon } from "native-base";
import { ReactElement } from "react";
import CustomNavigationHeader from "../components/CustomNavigationHeader";
import DocumentUploadScreen from "../screens/DocumentUploadScreen";
import Feedback from "../screens/Feedback";
import ReviewPhoto from "../screens/ReviewPhoto";
import SecurityCentreOverview from "../screens/SecurityCentreOverview";
import TakePhoto from "../screens/TakePhoto";
import { UserProfileStackParamList } from "./UserProfileStack";
import { AppBottomTabParamList } from "./AppBottomTab";
import { FeedbackProps } from "./WelcomeStack";

type DocumentType = {
  type: "id" | "passport" | "selfie";
  side?: "front" | "back";
};

export type TakePhotoRouteParams = {
  screenTitle: string;
  instructions: ReactElement;
  document: DocumentType;
  options?: {
    initialCamera: CameraType;
  };
};

export type ReviewPhotoRouteParams = {
  imageUri: string;
  document: DocumentType;
};

export type UpgradeAccountStackParamList = {
  TiersOverview: undefined;
  TierTwo: undefined;
  TierThree: undefined;
  DocumentUploadOptions: {
    screenTitle: string;
    description?: string;
  };
  TakePhoto: TakePhotoRouteParams;
  ReviewPhoto: ReviewPhotoRouteParams;
  Feedback: FeedbackProps;
};

const UpgradeAccountStack =
  createNativeStackNavigator<UpgradeAccountStackParamList>();

export default function UpgradeAccountStackNavigator() {
  return (
    <UpgradeAccountStack.Navigator>
      <UpgradeAccountStack.Screen
        name="TiersOverview"
        component={SecurityCentreOverview}
        options={{
          title: "Upgrade account",
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
                props.navigation
                  // eslint-disable-next-line react/prop-types
                  .getParent<NavigationProp<UserProfileStackParamList>>()
                  .getParent<NavigationProp<AppBottomTabParamList>>()
                  .reset({ index: 0, routes: [{ name: "PortfolioOverview" }] })
              }
            />
          ),
        }}
      />
      <UpgradeAccountStack.Screen
        name="DocumentUploadOptions"
        component={DocumentUploadScreen}
        options={{ header: (props) => <CustomNavigationHeader {...props} /> }}
      />
      <UpgradeAccountStack.Screen
        name="TakePhoto"
        component={TakePhoto}
        options={{
          title: "Take photo",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <UpgradeAccountStack.Screen
        name="ReviewPhoto"
        component={ReviewPhoto}
        options={{
          title: "Review photo",
          header: (props) => <CustomNavigationHeader {...props} />,
        }}
      />
      <UpgradeAccountStack.Screen
        name="Feedback"
        component={Feedback}
        options={{ title: "Feedback" }}
      />
    </UpgradeAccountStack.Navigator>
  );
}
