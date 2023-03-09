// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Heading, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { UpgradeAccountStackParamList } from "../navigation/UpgradeAccountStack";
import ScreenWrapper from "../components/ScreenWrapper";
import DocumentTypeOption from "../components/DocumentTypeOption";

type IDocumentsUploadOptions = NativeStackScreenProps<
  UpgradeAccountStackParamList,
  "DocumentUploadOptions"
>;

function DocumentUploadScreen({ navigation, route }: IDocumentsUploadOptions) {
  const { screenTitle, description } = route.params;

  const [selectedDocumentType, setSelectedDocumentType] = useState<
    "id" | "passport"
  >("id");

  useEffect(() => {
    navigation.setOptions({
      title: screenTitle === "" ? "Upload" : screenTitle,
    });
  }, [navigation]);

  return (
    <ScreenWrapper space={6} flex={1}>
      {description && (
        <Text accessibilityLabel="screen description">{description}</Text>
      )}
      <VStack space={4} flex={1}>
        <DocumentTypeOption
          id="id"
          label="Identity card"
          selected={selectedDocumentType}
          setSelected={setSelectedDocumentType}
        />
        <DocumentTypeOption
          id="passport"
          label="Passport"
          selected={selectedDocumentType}
          setSelected={setSelectedDocumentType}
        />
      </VStack>
      <Button onPress={handleTakePhoto} accessibilityLabel="continue">
        Continue
      </Button>
    </ScreenWrapper>
  );

  function handleTakePhoto() {
    navigation.navigate("TakePhoto", {
      screenTitle: `Front of ${
        selectedDocumentType === "id" ? "ID card" : "passport"
      }`,
      instructions:
        selectedDocumentType === "id" ? (
          <VStack space={4} alignItems="center">
            <Heading size="xl" color="white" fontWeight="bold">
              Front of ID card
            </Heading>
            <Text fontSize="md" color="white">
              Make sure your card is physically present, all details are clear
              to read with no blur or glare
            </Text>
          </VStack>
        ) : (
          <VStack space={2}>
            <Heading size="xl" color="white">
              Front page of passport
            </Heading>
            <Text fontSize="md" color="white">
              Make sure both the page with your photo and details and the page
              next to it are clearly readable.
            </Text>
          </VStack>
        ),
      document: {
        type: selectedDocumentType,
        side: selectedDocumentType === "id" ? "front" : undefined,
      },
    });
  }
}

export default DocumentUploadScreen;
