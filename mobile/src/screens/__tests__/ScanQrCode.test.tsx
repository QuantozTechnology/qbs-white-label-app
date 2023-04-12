// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { render, screen, within } from "../../jest/test-utils";
import ScanQrCode from "../ScanQrCode";
import { BarCodeScanner, PermissionStatus } from "expo-barcode-scanner";

describe("Scan QR code", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: jest.fn(),
    },
    ...props,
  });

  beforeEach(() => {
    props = createTestProps({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should show the loading message while checking permissions", () => {
    jest.spyOn(BarCodeScanner, "requestPermissionsAsync").mockResolvedValue({
      status: PermissionStatus.GRANTED,
      granted: true,
      expires: "never",
      canAskAgain: true,
    });

    render(<ScanQrCode {...props} />);

    const loadingState = screen.getByLabelText("request camera permissions");

    expect(
      within(loadingState).getByText("Requesting for camera permission")
    ).toBeTruthy();
  });

  it("should show error message if no permission given by user", async () => {
    jest.spyOn(BarCodeScanner, "requestPermissionsAsync").mockResolvedValue({
      status: PermissionStatus.DENIED,
      granted: false,
      expires: "never",
      canAskAgain: true,
    });

    render(<ScanQrCode {...props} />);

    const noPermissions = await screen.findByLabelText("no permissions");

    expect(noPermissions).toBeTruthy();
  });

  it("should show camera if permission was given by user", async () => {
    jest.spyOn(BarCodeScanner, "requestPermissionsAsync").mockResolvedValue({
      status: PermissionStatus.GRANTED,
      granted: true,
      expires: "never",
      canAskAgain: true,
    });

    render(<ScanQrCode {...props} />);

    const okPermissions = await screen.findByLabelText("ok camera permissions");

    expect(okPermissions).toBeTruthy();
  });
});
