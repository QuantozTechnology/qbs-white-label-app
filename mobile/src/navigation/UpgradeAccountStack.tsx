import { Ionicons } from "@expo/vector-icons";
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
