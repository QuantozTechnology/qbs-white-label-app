import { waitFor } from "@testing-library/react-native";
import WelcomeStackNavigator from "../WelcomeStack";
import * as functions from "../../utils/functions";
import * as SecureStore from "expo-secure-store";
import { render } from "../../jest/test-utils";

jest.mock("expo-local-authentication");
jest.mock("../../utils/biometric");
jest.mock("expo-secure-store");
jest.mock("../../auth/AuthContext");
jest.mock("../../context/AppStateContext");

function renderWelcomeStackNavigator() {
  return render(<WelcomeStackNavigator />);
}

beforeEach(() => {
  jest.clearAllMocks();
});
describe("WelcomeStackNavigator", () => {
  it("performs biometric validation successfully", async () => {
    const mockPerformBiometricValidation = jest
      .spyOn(functions, "performBiometricValidation")
      .mockImplementation((callback) => {
        callback(true, null);
      });

    renderWelcomeStackNavigator();
    waitFor(() => expect(mockPerformBiometricValidation).toHaveBeenCalled());
  });

  // biometric validation failed
  it("renders error message when biometric validation fails", async () => {
    jest
      .spyOn(functions, "performBiometricValidation")
      .mockImplementation((callback) => {
        callback(false, { message: "Biometric validation failed" });
      });

    const { getByText } = renderWelcomeStackNavigator();
    waitFor(() =>
      expect(
        getByText(
          "Cannot verify your biometric security. Please try again later"
        )
      ).toBeDefined()
    );
  });

  it("renders error message when biometric validation is none", async () => {
    jest
      .spyOn(functions, "performBiometricValidation")
      .mockImplementation((callback) => {
        callback(false, null);
      });

    const { getByText } = renderWelcomeStackNavigator();
    waitFor(() => expect(getByText("Biometric check error")).toBeDefined());
  });

  it("performs screen lock check successfully", async () => {
    const mockCheckDeviceHasScreenLock = jest
      .spyOn(functions, "checkDeviceHasScreenLock")
      .mockImplementation((callback) => {
        callback(true, null);
      });

    renderWelcomeStackNavigator();

    waitFor(() => expect(mockCheckDeviceHasScreenLock).toHaveBeenCalled());
  });

  it("renders loading spinner during screen lock check", async () => {
    jest
      .spyOn(functions, "performBiometricValidation")
      .mockImplementation(
        (
          callback: (
            isBiometricCheckPassed: boolean,
            error: { message: string } | null
          ) => void
        ) => {
          callback(true, null);
        }
      );

    const { getByText } = renderWelcomeStackNavigator();

    waitFor(async () => {
      expect(getByText("Checking screen lock mechanism..."));
    });
  });

  it("renders error message when screen lock is none", async () => {
    jest
      .spyOn(functions, "performBiometricValidation")
      .mockImplementation(
        (
          callback: (
            isBiometricCheckPassed: boolean,
            error: { message: string } | null
          ) => void
        ) => {
          callback(true, null);
        }
      );

    jest
      .spyOn(functions, "checkDeviceHasScreenLock")
      .mockImplementation(
        (
          callback: (
            result: boolean | null,
            error: { message: string } | null
          ) => void
        ) => {
          callback(false, null);
        }
      );

    const { getByText } = renderWelcomeStackNavigator();

    waitFor(async () => {
      expect(
        getByText(
          "Your device has no security measures set up (pin, passcode or fingerprint/faceID)"
        )
      );
    });
  });

  it("screen lock check with success response", async () => {
    jest
      .spyOn(functions, "performBiometricValidation")
      .mockImplementation(
        (
          callback: (
            isBiometricCheckPassed: boolean,
            error: { message: string } | null
          ) => void
        ) => {
          callback(true, null);
        }
      );

    jest
      .spyOn(functions, "checkDeviceHasScreenLock")
      .mockImplementation(
        (
          callback: (
            result: boolean | null,
            error: { message: string } | null
          ) => void
        ) => {
          callback(true, null);
        }
      );

    const { getByText } = renderWelcomeStackNavigator();

    waitFor(async () => {
      expect(getByText("SignIn").toBeDefined());
    });
  });

  it("renders error message when screen lock check fails", async () => {
    jest
      .spyOn(functions, "performBiometricValidation")
      .mockImplementation(
        (
          callback: (
            isBiometricCheckPassed: boolean,
            error: { message: string } | null
          ) => void
        ) => {
          callback(true, null);
        }
      );
    jest
      .spyOn(functions, "checkDeviceHasScreenLock")
      .mockImplementation(
        (
          callback: (
            result: boolean | null,
            error: { message: string } | null
          ) => void
        ) => {
          callback(null, {
            message: "Error checking device screen lock mechanism",
          });
        }
      );

    const { getByText } = renderWelcomeStackNavigator();
    waitFor(() => {
      expect(
        getByText(
          "Cannot verify if your device has a screen lock mechanism. Please try again later"
        )
      ).toBeDefined();
    });
  });

  it("renders error message when device verification check fails", async () => {
    jest
      .spyOn(functions, "performBiometricValidation")
      .mockImplementation(
        (
          callback: (
            isBiometricCheckPassed: boolean,
            error: { message: string } | null
          ) => void
        ) => {
          callback(true, null);
        }
      );
    jest
      .spyOn(functions, "checkDeviceHasScreenLock")
      .mockImplementation(
        (
          callback: (
            result: boolean | null,
            error: { message: string } | null
          ) => void
        ) => {
          callback(true, null);
        }
      );

    jest.spyOn(functions, "getOid").mockImplementation(async () => {
      return "oid";
    });

    jest
      .spyOn(SecureStore, "getItemAsync")
      .mockImplementation(async (key: string): Promise<string | null> => {
        if (key === "oid_publicKey") {
          return "publicKey";
        } else if (key === "oiddeviceVerified") {
          return null;
        } else if (key === "oidRegistrationCompleted") {
          return null;
        }
        return null;
      });

    const { getByText } = renderWelcomeStackNavigator();
    waitFor(() => {
      expect(
        getByText("Cannot verify your device. Please try again later")
      ).toBeDefined();
    });
  });
});
