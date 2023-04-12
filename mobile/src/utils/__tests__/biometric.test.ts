// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import * as LocalAuthentication from "expo-local-authentication";
import {
  biometricValidation,
  isBiometricCheckSupportedByDevice,
} from "../biometric";

jest.mock("expo-local-authentication");

const hasHardwareAsyncMock = LocalAuthentication.hasHardwareAsync as jest.Mock;
const isEnrolledAsyncMock = LocalAuthentication.isEnrolledAsync as jest.Mock;
const authenticateAsyncMock =
  LocalAuthentication.authenticateAsync as jest.Mock;

// Unmock the module and re-import it to make the functions available again
jest.unmock("../biometric");
jest.doMock("../biometric", () => ({
  ...jest.requireActual("../biometric"),
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe("isBiometricCheckSupportedByDevice", () => {
  it("returns true when both hardware and enrollment are supported", async () => {
    hasHardwareAsyncMock.mockResolvedValue(true);
    isEnrolledAsyncMock.mockResolvedValue(true);

    const result = await isBiometricCheckSupportedByDevice();

    expect(result).toBe(true);
  });

  it("returns false when hardware support is missing", async () => {
    hasHardwareAsyncMock.mockResolvedValueOnce(false);
    isEnrolledAsyncMock.mockResolvedValue(true);

    const result = await isBiometricCheckSupportedByDevice();

    expect(result).toBe(false);
  });

  it("returns false when enrollment is missing", async () => {
    hasHardwareAsyncMock.mockResolvedValue(true);
    isEnrolledAsyncMock.mockResolvedValueOnce(false);

    const result = await isBiometricCheckSupportedByDevice();

    expect(result).toBe(false);
  });
});

describe("biometricValidation", () => {
  it("returns success result when authentication is successful", async () => {
    hasHardwareAsyncMock.mockResolvedValue(true);
    isEnrolledAsyncMock.mockResolvedValue(true);
    authenticateAsyncMock.mockResolvedValueOnce({
      success: true,
    });

    const result = await biometricValidation();

    expect(result.result).toBe("success");
  });

  it("returns error result with message when authentication fails", async () => {
    hasHardwareAsyncMock.mockResolvedValue(true);
    isEnrolledAsyncMock.mockResolvedValue(true);
    authenticateAsyncMock.mockResolvedValueOnce({
      success: false,
      error: "Authentication failed",
    });

    const result = await biometricValidation();

    expect(result.result).toBe("error");
    expect(result.message).toBe("Authentication failed");
  });

  it("returns success result when biometric check is not supported by the device", async () => {
    hasHardwareAsyncMock.mockResolvedValue(true);
    isEnrolledAsyncMock.mockResolvedValue(true);
    hasHardwareAsyncMock.mockResolvedValueOnce(false);

    const result = await biometricValidation();

    expect(result.result).toBe("success");
  });
});
