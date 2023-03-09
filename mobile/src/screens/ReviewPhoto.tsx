// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button, VStack, Icon, Image, Toast, Heading, Text } from "native-base";
import { useState } from "react";
import { uploadCustomerPhoto, UploadDocumentType } from "../api/customer/files";
import { APIError } from "../api/generic/error.interface";
import Notification from "../components/Notification";
import ScreenWrapper from "../components/ScreenWrapper";
import { UpgradeAccountStackParamList } from "../navigation/UpgradeAccountStack";
import { formatError } from "../utils/errors";
import { delay } from "../utils/generic/delay";
import { ImageIdentifier } from "../utils/images";

type Props = NativeStackScreenProps<
  UpgradeAccountStackParamList,
  "ReviewPhoto"
>;

function ReviewPhoto({ navigation, route }: Props) {
  const queryClient = useQueryClient();

  const { document, imageUri } = route.params;
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  return (
    <ScreenWrapper flex={1}>
      <Image
        alt="passport"
        source={{ uri: imageUri }}
        w="full"
        flex={1}
        accessibilityLabel="photo taken"
        my={4}
        bg="amber.100"
      />
      <Text fontSize="lg">
        Is the photo clearly readable? If not, please take another one.
      </Text>
      <VStack flex={1} justifyContent="flex-end" space={4}>
        <Button
          isLoading={isSavingPhoto}
          isLoadingText="Saving..."
          onPress={savePhoto}
          accessibilityLabel="save photo"
        >
          Submit document photo
        </Button>
        <Button
          variant="outline"
          onPress={handlePhotoReset}
          startIcon={<Icon as={Ionicons} name="repeat" />}
          accessibilityLabel="take another photo"
        >
          Take another photo
        </Button>
      </VStack>
    </ScreenWrapper>
  );

  function handlePhotoReset() {
    navigation.goBack();
  }

  async function savePhoto() {
    if (imageUri != null) {
      try {
        setIsSavingPhoto(true);

        let urlAppendix: UploadDocumentType;

        switch (document.type) {
          case "passport":
            urlAppendix = UploadDocumentType.Passport;
            break;
          case "selfie":
            urlAppendix = UploadDocumentType.Selfie;
            break;
          case "id":
            urlAppendix =
              document.side === "front"
                ? UploadDocumentType.IdFront
                : UploadDocumentType.IdBack;
            break;
        }

        await uploadCustomerPhoto(
          { file: imageUri },
          {
            type: urlAppendix,
          }
        );

        navigation.navigate("Feedback", {
          title: "Uploading photo",
          variant: "loading",
          illustration: ImageIdentifier.Loading,
        });

        await delay(3000);

        queryClient.invalidateQueries({ queryKey: ["customer"] });

        if (document.type === "selfie" || document.type === "passport") {
          Toast.show({
            render: () => (
              <Notification
                // eslint-disable-next-line react/prop-types
                message={`${document.type} uploaded`}
                variant="success"
              />
            ),
          });
          navigation.navigate("TiersOverview");
          return;
        }

        if (document.type === "id" && document.side === "front") {
          navigation.navigate("TakePhoto", {
            document: { type: "id", side: "back" },
            screenTitle: "Back of ID card",
            instructions: (
              <VStack space={4} alignItems="center">
                <Heading size="xl" color="white" fontWeight="bold">
                  Back of ID card
                </Heading>
                <Text fontSize="lg" color="white">
                  Make sure your card is physically present, all details are
                  clear to read with no blur or glare
                </Text>
              </VStack>
            ),
          });
        } else {
          Toast.show({
            render: () => (
              <Notification
                message="ID card photos uploaded"
                variant="success"
              />
            ),
          });

          navigation.navigate("TiersOverview");
        }
      } catch (error) {
        const axiosError = error as AxiosError<APIError>;

        Toast.show({
          render: () => (
            <Notification message={formatError(axiosError)} variant="error" />
          ),
        });
      } finally {
        setIsSavingPhoto(false);
      }
    }
  }
}

export default ReviewPhoto;
