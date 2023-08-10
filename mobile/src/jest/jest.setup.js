// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import * as auth from "../auth/AuthContext";
import { server } from "../mocks/server";
import "@testing-library/jest-native/extend-expect";
import { cleanup } from "@testing-library/react-native";
import { paymentsApi } from "../utils/axios";
import * as CustomerContext from "../context/CustomerContext";
import * as Clipboard from "expo-clipboard";
import { biometricValidation } from "../utils/biometric";

// Needed because it accesses the value of code in the Expo Constants, but mocking Constants breaks sentry-expo library, and mocking that one breaks other stuff
jest.mock("../config/config", () => ({
  ...jest.requireActual("../config/config"),
  defaultConfig: {
    ...jest.requireActual("../config/config").defaultConfig,
    defaultStableCoin: {
      ...jest.requireActual("../config/config").defaultConfig.defaultStableCoin,
      code: "SCEUR",
    },
  },
}));

jest.mock("expo-local-authentication", () => ({
  hasHardwareAsync: jest.fn().mockResolvedValue(true),
  isEnrolledAsync: jest.fn().mockResolvedValue(true),
  authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
  SecurityLevel: {
    NONE: 0,
    SECRET: 1,
    BIOMETRIC: 2,
  },
  getEnrolledLevelAsync: jest.fn().mockResolvedValue(2),
}));

export const mockRefresh = jest.fn();
export let mockClipboardCopy;
export let authMock;
export let customerContextMock;

// Needed after update to Jest 29
global.setImmediate =
  global.setImmediate ||
  function (fn) {
    return setTimeout(fn, 0);
  };
// Needed after update to Jest 29
global.clearImmediate =
  global.clearImmediate ||
  function (id) {
    clearTimeout(id);
  };

jest.mock("expo-font");
jest.mock("expo-asset");
jest.mock("../utils/biometric", () => ({
  biometricValidation: jest.fn().mockResolvedValue({ result: "success" }),
}));
jest.mock("expo-linking", () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve()),
}));

// create a mock for the whole react navigation prop object
export const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  setParams: jest.fn(),
  getParam: jest.fn(),
};

export const mockUseNavigationNavigate = jest.fn();
export const mockUseNavigationDispatch = jest.fn();
export const mockUseNavigationGoBack = jest.fn();
export const mockUseRoute = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      getParent: jest.fn(() => ({
        navigate: mockUseNavigationNavigate,
      })),
      dispatch: mockUseNavigationDispatch,
      navigate: mockUseNavigationNavigate,
      goBack: mockUseNavigationGoBack,
    }),
    useRoute: mockUseRoute,
  };
});

beforeEach(() => {
  // mocking NOTICE to clipboard
  mockClipboardCopy = jest
    .spyOn(Clipboard, "setStringAsync")
    .mockResolvedValue(true);

  authMock = jest.spyOn(auth, "useAuth").mockImplementation(() => {
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

  customerContextMock = jest
    .spyOn(CustomerContext, "useCustomerState")
    .mockImplementation(() => contextValues);
});

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
  jest.restoreAllMocks();
  jest.clearAllMocks();
});
// Clean up after the tests are finished.
afterAll(() => server.close());
