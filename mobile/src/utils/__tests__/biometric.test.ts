// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import * as LocalAuthenticationOrig from "expo-local-authentication";
import {
  biometricValidation,
  isBiometricCheckSupportedByDevice,
} from "../biometric";

const LocalAuthentication = LocalAuthenticationOrig as jest.Mocked<
  typeof LocalAuthenticationOrig
>;

// Unmock the module and re-import it to make the functions available again. It does not work without this!
jest.unmock("../biometric");
jest.doMock("../biometric", () => ({
  ...jest.requireActual("../biometric"),
}));

// Note: check the jest.setup.js file for default mock values of LocalAuhtentication

describe("isBiometricCheckSupportedByDevice", () => {
  it("returns true when both hardware and enrollment are supported", async () => {
    const result = await isBiometricCheckSupportedByDevice();

    expect(result).toBe(true);
  });

  it("returns false when hardware support is missing", async () => {
    LocalAuthentication.hasHardwareAsync.mockResolvedValueOnce(false);

    const result = await isBiometricCheckSupportedByDevice();

    expect(result).toBe(false);
  });
});

describe("biometricValidation", () => {
  it("returns success result when authentication is successful", async () => {
    const result = await biometricValidation();

    expect(result.result).toBe("success");
  });

  it("returns error result with message when authentication fails", async () => {
    LocalAuthentication.hasHardwareAsync.mockResolvedValueOnce(true);
    LocalAuthentication.isEnrolledAsync.mockResolvedValueOnce(true);
    LocalAuthentication.authenticateAsync.mockResolvedValueOnce({
      success: false,
      error: "Authentication failed",
    });

    const result = await biometricValidation();

    expect(result.result).toBe("error");
    expect(result.message).toBe("Authentication failed");
  });
});
