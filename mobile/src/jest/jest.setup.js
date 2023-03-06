import * as auth from "../auth/AuthContext";
import { server } from "../mocks/server";
import "@testing-library/jest-native/extend-expect";
import { cleanup } from "@testing-library/react-native";
import { paymentsApi } from "../utils/axios";
import * as CustomerContext from "../context/CustomerContext";
import * as Clipboard from "expo-clipboard";
import { biometricValidation } from "../utils/biometric";

export const mockRefresh = jest.fn();
export let mockClipboardCopy;

jest.mock("../utils/biometric", () => ({
  biometricValidation: jest.fn().mockResolvedValue({ result: "success" }),
}));

export const mockUseNavigationNavigate = jest.fn();
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      getParent: jest.fn(() => ({
        navigate: mockUseNavigationNavigate,
      })),
    }),
  };
});

beforeEach(() => {
  jest.spyOn(auth, "useAuth").mockImplementation(() => {
    return {
      error: null,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      userSession: {
        objectId: "test",
        email: "john@doe.com",
        phone: "+3123456789",
        isNew: false,
      },
    };
  });

  // mocking the customer context
  const contextValues = {
    error: null,
    isLoading: false,
    isUnderReview: false,
    requiresAccount: false,
    requiresCustomer: false,
    refresh: mockRefresh,
  };
  jest
    .spyOn(CustomerContext, "useCustomerState")
    .mockImplementation(() => contextValues);
});

// mocking copying to clipboard
mockClipboardCopy = jest
  .spyOn(Clipboard, "setStringAsync")
  .mockResolvedValue(true);

// mock biometric check
biometricValidation.mockResolvedValue({ result: "success" });

// Establish API mocking before all tests.
beforeAll(() => {
  const axiosMock = paymentsApi;
  axiosMock.create = jest.fn().mockReturnValue(axiosMock);
  axiosMock.defaults.headers.common["Authorization"] = "test-token";

  server.listen();
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
// Clean up after the tests are finished.
afterAll(() => server.close());
