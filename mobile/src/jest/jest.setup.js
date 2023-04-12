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
import { Linking } from "react-native";

export const mockRefresh = jest.fn();
export let mockClipboardCopy: jest.SpyInstance;
export let authMock: jest.SpyInstance;
export let customerContextMock: jest.SpyInstance;

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
    }),
  };
});

export const linkingOpenUrlMock = jest.fn();
Linking.openURL = linkingOpenUrlMock;

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
