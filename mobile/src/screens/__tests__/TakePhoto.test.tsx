// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { Icon, IconButton, Text } from "native-base";
import { render, screen, within } from "../../jest/test-utils";
import TakePhoto from "../TakePhoto";
import { Camera, PermissionResponse, PermissionStatus } from "expo-camera";
import { TakePhotoRouteParams } from "../../navigation/UpgradeAccountStack";

describe("Take photo screen", () => {
  const cameraPermissionResponse: PermissionResponse = {
    status: PermissionStatus.GRANTED,
    expires: "never",
    granted: true,
    canAskAgain: true,
  };

  jest.spyOn(Camera, "useCameraPermissions").mockImplementation(() => {
    return [
      cameraPermissionResponse,
      () => Promise.resolve(cameraPermissionResponse),
      () => Promise.resolve(cameraPermissionResponse),
    ];
  });
  jest.spyOn(Camera.prototype, "takePictureAsync").mockImplementation(() => {
    return Promise.resolve({
      uri: "file://some-file.jpg",
      width: 4000,
      height: 3000,
    });
  });

  const routeParams: TakePhotoRouteParams = {
    screenTitle: "Test screen title",
    instructions: <Text>Test instruction</Text>,
    document: {
      type: "id",
      side: "front",
    },
  };

  const mockedNavigation = jest.fn();

  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: mockedNavigation,
      setOptions: jest.fn(() => {
        return {
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
                onPress={jest.fn()}
              />
              <IconButton
                icon={
                  <Icon
                    as={Ionicons}
                    name={"flash-outline"}
                    size="lg"
                    accessibilityLabel="toggle flash"
                  />
                }
                onPress={jest.fn()}
              />
            </>
          ),
        };
      }),
    },
    route: {
      params: routeParams,
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("renders the expected UI", async () => {
    props = createTestProps({});
    render(<TakePhoto {...props} />);

    const cameraView = await screen.findByLabelText("camera");
    const takePhoto = screen.getByLabelText("take photo");
    const instructions = screen.getByLabelText("instructions");

    expect(cameraView).toBeTruthy();
    expect(takePhoto).toBeTruthy();
    expect(within(instructions).getByText(/^Test instruction$/)).toBeTruthy();
  });
});
