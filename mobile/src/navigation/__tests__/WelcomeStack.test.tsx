// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import * as auth from "../../auth/AuthContext";
import { render, screen } from "../../jest/test-utils";
import * as LocalAuthenticationOrig from "expo-local-authentication";
import WelcomeStack from "../WelcomeStack";
// import { server } from "../../mocks/server";
// import {
//   deviceNotKnownApiResponse,
//   devicesApiErrorResponse,
// } from "../../api/customer/devices.mocks";
import * as CustomerContext from "../../context/CustomerContext";
import {
  mockPrivateKeyPem,
  mockPublicKeyPem,
  mockRefresh,
} from "../../jest/jest.setup";
import { biometricValidation } from "../../utils/biometric";

// const LocalAuthentication = LocalAuthenticationOrig as jest.Mocked<
//   typeof LocalAuthenticationOrig
// >;

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn((key: string) => {
    if (key === "publicKey") {
      return Promise.resolve(mockPublicKeyPem);
    }
    if (key === "privateKey") {
      return Promise.resolve(mockPrivateKeyPem);
    }

    return Promise.resolve(null);
  }),
  setItemAsync: jest.fn((key: string) => {
    if (key === "publicKey") {
      return Promise.resolve();
    }
    if (key === "privateKey") {
      return Promise.resolve();
    }
    return Promise.resolve(key);
  }),
}));

describe("WelcomeStack", () => {
  describe("Azure auth checks", () => {
    beforeEach(() => {
      jest.spyOn(auth, "useAuth").mockImplementation(() => {
        return {
          error: null,
          isLoading: true,
          login: jest.fn(),
          logout: jest.fn(),
          userSession: null,
          signup: jest.fn(),
          changePassword: jest.fn(),
        };
      });
    });

    it("shows a loading screen if the auth state is loading", async () => {
      render(<WelcomeStack />);

      expect(await screen.findByLabelText("full screen loading")).toBeVisible();
    });
    it("redirects the user to the SignIn screen if they are not logged in", async () => {
      jest.spyOn(auth, "useAuth").mockImplementation(() => {
        return {
          error: null,
          isLoading: false,
          login: jest.fn(),
          logout: jest.fn(),
          userSession: null,
          signup: jest.fn(),
          changePassword: jest.fn(),
        };
      });

      render(<WelcomeStack />);

      expect(await screen.findByLabelText("sign-in message")).toBeVisible();
    });
  });

  // describe("Lock mechanism checks", () => {
  //   it("shows an error screen if the screen lock mechanism check fails", async () => {
  //     LocalAuthentication.getEnrolledLevelAsync.mockRejectedValueOnce(
  //       new Error("Cannot get enrolled level")
  //     );

  //     render(<WelcomeStack />);

  //     expect(
  //       await screen.findByLabelText("feedback description")
  //     ).toHaveTextContent(
  //       "Cannot verify if your device has a screen lock mechanism. Please try again later"
  //     );
  //   });
  //   // it("shows an error screen if the user has no security check on their phone", async () => {
  //   //   LocalAuthentication.getEnrolledLevelAsync.mockResolvedValueOnce(
  //   //     LocalAuthenticationOrig.SecurityLevel.NONE
  //   //   );

  //   //   render(<WelcomeStack />);

  //   //   expect(
  //   //     await screen.findByLabelText("feedback description")
  //   //   ).toHaveTextContent(
  //   //     "Your device has no security measures set up (pin, passcode or fingerprint/faceID). Please enable one of these to be able to use the app."
  //   //   );
  //   // });
  // });

  describe("Biometric checks", () => {
    it("shows an error screen if the biometric check throws error", async () => {
      (biometricValidation as jest.Mock).mockImplementationOnce(() =>
        Promise.reject()
      );

      render(<WelcomeStack />);

      expect(
        await screen.findByLabelText("feedback description")
      ).toHaveTextContent(
        "Cannot verify your biometric security. Please try again later"
      );
    });

    // it("shows an error screen if the user does not pass the biometric check", async () => {
    //   (biometricValidation as jest.Mock).mockImplementationOnce(() =>
    //     Promise.resolve({
    //       result: "error",
    //       message: "biometric check not passed",
    //     })
    //   );

    //   render(<WelcomeStack />);

    //   expect(
    //     await screen.findByLabelText("full screen message title")
    //   ).toHaveTextContent("Biometric check error");
    //   expect(
    //     await screen.findByLabelText("full screen message description")
    //   ).toHaveTextContent("Please try again");
    // });
  });

  // describe("Device checks", () => {
  //   beforeEach(() => {
  //     (biometricValidation as jest.Mock).mockImplementation(() =>
  //       Promise.resolve({
  //         result: "success",
  //       })
  //     );
  //   });

  //   // it("shows an error screen if the device check throws an error", async () => {
  //   //   server.use(devicesApiErrorResponse);

  //   //   render(<WelcomeStack />);

  //   //   expect(
  //   //     await screen.findByLabelText("feedback description")
  //   //   ).toHaveTextContent(
  //   //     "Cannot securely verify your device. Please try again later"
  //   //   );
  //   // });

  //   // it(" ", async () => {
  //   //   server.use(deviceNotKnownApiResponse);

  //   //   render(<WelcomeStack />);

  //   //   expect(
  //   //     await screen.findByLabelText("confirm device screen")
  //   //   ).toBeVisible();
  //   // });
  // });

  describe("Customer checks", () => {
    beforeEach(() => {
      (biometricValidation as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          result: "success",
        })
      );
    });

    let customerContextSpy: jest.SpyInstance;

    afterEach(() => {
      if (customerContextSpy) {
        customerContextSpy.mockRestore();
      }
    });

    const customerContextValues = {
      error: null,
      isLoading: false,
      isUnderReview: false,
      requiresAccount: false,
      requiresCustomer: false,
      refresh: mockRefresh,
    };

    it("shows the registration screen if the user needs to complete the registration", async () => {
      customerContextSpy = jest
        .spyOn(CustomerContext, "useCustomerState")
        .mockImplementation(() => ({
          ...customerContextValues,
          requiresCustomer: true,
        }));

      render(<WelcomeStack />);

      expect(
        await screen.findByLabelText("consumer registration screen")
      ).toBeVisible();
    });

    it("shows an informative screen is the user account is under review", async () => {
      customerContextSpy = jest
        .spyOn(CustomerContext, "useCustomerState")
        .mockImplementation(() => ({
          ...customerContextValues,
          isUnderReview: true,
        }));

      render(<WelcomeStack />);

      expect(await screen.findByLabelText("feedback title")).toHaveTextContent(
        "Account under review"
      );
      expect(
        await screen.findByLabelText("feedback description")
      ).toHaveTextContent(
        "Our operators are checking your account details. We will let you know when you can access it."
      );
    });

    it("shows an error screen if the customer context returns an error", async () => {
      customerContextSpy = jest
        .spyOn(CustomerContext, "useCustomerState")
        .mockImplementation(() => ({
          ...customerContextValues,
          error: "Error",
        }));

      render(<WelcomeStack />);

      expect(await screen.findByLabelText("feedback title")).toHaveTextContent(
        "Login error"
      );
      expect(
        await screen.findByLabelText("feedback description")
      ).toHaveTextContent(
        "Sorry for the inconvenience, please try again later"
      );
    });
  });

  it("redirects the user to the main app if all checks pass", async () => {
    (biometricValidation as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        result: "success",
      })
    );

    render(<WelcomeStack />);

    expect(await screen.findByLabelText("portfolio screen")).toBeVisible();
  });
});
