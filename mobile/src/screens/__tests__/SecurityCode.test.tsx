// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

jest.mock("totp-generator", () => jest.fn(() => "123456"));
jest.mock("expo-secure-store", () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  getItemAsync: jest.fn(() => Promise.resolve("123456")),
}));

import { render, screen } from "../../jest/test-utils";
import { SecurityCode } from "../SecurityCode";
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires
const totp: any = require("totp-generator");
import * as SecureStore from "expo-secure-store";

describe("SecurityCode screen", () => {
  beforeEach(() => {
    (SecureStore.isAvailableAsync as jest.Mock).mockClear();
    (SecureStore.getItemAsync as jest.Mock).mockClear();
  });

  it("should render the loading spinner if otpSeed is still null", () => {
    render(<SecurityCode />);

    expect(screen.getByLabelText("full screen loading")).toBeVisible();
  });

  it("should render expected UI", async () => {
    (SecureStore.isAvailableAsync as jest.Mock).mockResolvedValueOnce(true);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("123456");

    render(<SecurityCode />);

    expect(await screen.findByLabelText("instructions")).toBeVisible();
    expect(await screen.findByLabelText("otp code")).toBeVisible();
    expect(await screen.findByLabelText("progress bar")).toBeVisible();
  });

  describe("show error message", () => {
    it("if secure store is not available on the device", async () => {
      (SecureStore.isAvailableAsync as jest.Mock).mockResolvedValueOnce(false);

      render(<SecurityCode />);

      expect(
        await screen.findByLabelText("full screen message title")
      ).toHaveTextContent("Error");
      expect(
        await screen.findByLabelText("full screen message description")
      ).toHaveTextContent(
        "Could not generate a security code. Please try later or contact support."
      );
    });

    it("if otp seed is not found in device secure store", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
      render(<SecurityCode />);

      expect(
        await screen.findByLabelText("full screen message title")
      ).toHaveTextContent("Error");
      expect(
        await screen.findByLabelText("full screen message description")
      ).toHaveTextContent(
        "Could not generate a security code. Please try later or contact support."
      );
    });
    it("if SecureStore.isAvailableSync throws", async () => {
      (SecureStore.isAvailableAsync as jest.Mock).mockRejectedValueOnce(
        new Error("Exception in isAvailableAsync")
      );

      render(<SecurityCode />);

      expect(
        await screen.findByLabelText("full screen message title")
      ).toHaveTextContent("Error");
      expect(
        await screen.findByLabelText("full screen message description")
      ).toHaveTextContent(
        "Could not generate a security code. Please try later or contact support."
      );
    });
    it("if SecureStore.getItemAsync throws", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(
        new Error("Exception in getItemAsync")
      );

      render(<SecurityCode />);

      expect(
        await screen.findByLabelText("full screen message title")
      ).toHaveTextContent("Error");
      expect(
        await screen.findByLabelText("full screen message description")
      ).toHaveTextContent(
        "Could not generate a security code. Please try later or contact support."
      );
    });
  });
});
