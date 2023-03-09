// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Camera, CameraType, FlashMode } from "expo-camera";
import {
  Button,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Stack,
  Text,
  VStack,
} from "native-base";
import { useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { UpgradeAccountStackParamList } from "../navigation/UpgradeAccountStack";

type ITakePhoto = NativeStackScreenProps<
  UpgradeAccountStackParamList,
  "TakePhoto"
>;

function TakePhoto({ navigation, route }: ITakePhoto) {
  const { document, screenTitle, instructions, options } = route.params;
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();

  const [type, setType] = useState(options?.initialCamera ?? CameraType.back);
  const [phoneFlash, setPhoneFlash] = useState(FlashMode.off);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    navigation.setOptions({
      title: screenTitle,
      headerRight: () => (
        <>
          <IconButton
            icon={
              <Icon
                as={Ionicons}
                name="camera-reverse-outline"
                size="lg"
                accessibilityLabel="toggle camera"
              />
            }
            onPress={toggleCameraType}
          />
          <IconButton
            icon={
              <Icon
                as={Ionicons}
                name={
                  phoneFlash === FlashMode.on
                    ? "flash-outline"
                    : "flash-off-outline"
                }
                size="lg"
                accessibilityLabel="toggle flash"
              />
            }
            onPress={toggleFlash}
            disabled={type === CameraType.front}
            isDisabled={type === CameraType.front}
          />
        </>
      ),
    });
  }, [navigation, phoneFlash, type]);

  if (!permission) {
    return (
      <VStack
        p={4}
        h="full"
        justifyContent="center"
        alignItems="center"
        space={4}
        accessibilityLabel="request camera permissions"
      >
        <Spinner size="lg" />
        <Text>Requesting for camera permission</Text>
      </VStack>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <Stack
        p={4}
        space={4}
        h="full"
        justifyContent="center"
        alignItems="center"
      >
        <Text textAlign="center">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>Give permission</Button>
      </Stack>
    );
  }

  function toggleFlash() {
    setPhoneFlash((current) =>
      current === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  }

  function toggleCameraType() {
    setType((current: CameraType) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const takePicture = async () => {
    if (cameraRef.current != null) {
      setIsTakingPhoto(true);
      try {
        await cameraRef.current._onCameraReady();
        const data = await cameraRef.current.takePictureAsync();

        navigation.navigate("ReviewPhoto", {
          imageUri: data.uri,
          document: {
            ...document,
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsTakingPhoto(false);
      }
    }
  };

  return (
    <ScreenWrapper flex={1} justifyContent="center" bg="#101c21">
      {isFocused && (
        <Camera
          ref={cameraRef}
          type={type}
          style={{
            width: width - 32,
            height: width - 32,
          }}
          ratio="4:3"
          flashMode={phoneFlash}
          accessibilityLabel="camera"
        ></Camera>
      )}

      <VStack
        flex={1}
        justifyContent="center"
        accessibilityLabel="instructions"
      >
        {instructions}
      </VStack>
      <HStack p={4} justifyContent="center">
        <IconButton
          size="lg"
          variant="solid"
          icon={<Icon as={Ionicons} name="camera-outline" size="5xl" />}
          borderRadius="full"
          onPress={takePicture}
          isDisabled={isTakingPhoto}
          accessibilityLabel="take photo"
        />
      </HStack>
    </ScreenWrapper>
  );
}

export default TakePhoto;
