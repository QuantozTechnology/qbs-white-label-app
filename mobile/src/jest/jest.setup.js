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

// sample keys for tests, in the correct format. Not a security issue, as these are not used in production

export const mockPublicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyIxoOuPDJoJ7Q1mn67Eo
5vkIiM0y9ddGa+ehASOX20j22J934Sf7xbRn71z44Ue8a6T8hJW9tKvxriVkbPfX
ggd28wVS5rJ8Gqqjl8LUDFXm4+HEIEv4nTy+BFnF/VWMEpTs2YUyXWtFdwvHEJ5d
COl+sj5/yEdT/AM2HaAiSG+268zIuTXZgxZQlVy9JCLLY6w5+BxVwBNhwJBw4kVT
wYeNsXRXUYh8a449HaxGeO52y/q61mXIwCh7T9/vo0757W2eygpDAGOuy3CYGqg3
u+4ZeIQqnP/qv6bMnbWYlNP+gWuhPbp2CD27NTQSShZ3hngqANjRZiUipMtZjwRR
DwIDAQAB
-----END PUBLIC KEY-----`;

export const mockPrivateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAyIxoOuPDJoJ7Q1mn67Eo5vkIiM0y9ddGa+ehASOX20j22J93
4Sf7xbRn71z44Ue8a6T8hJW9tKvxriVkbPfXggd28wVS5rJ8Gqqjl8LUDFXm4+HE
IEv4nTy+BFnF/VWMEpTs2YUyXWtFdwvHEJ5dCOl+sj5/yEdT/AM2HaAiSG+268zI
uTXZgxZQlVy9JCLLY6w5+BxVwBNhwJBw4kVTwYeNsXRXUYh8a449HaxGeO52y/q6
1mXIwCh7T9/vo0757W2eygpDAGOuy3CYGqg3u+4ZeIQqnP/qv6bMnbWYlNP+gWuh
Pbp2CD27NTQSShZ3hngqANjRZiUipMtZjwRRDwIDAQABAoIBAQCyLFQ55bqujwRW
HORcOMQ/GIdlivE4iy7slRhs+6Nh1hxA7sTBzBUaXCJu/am79FDJTgZvAN5PEugg
MOZdDYBw7JLYbCVwAqjRxEKdhSGBaBw+34iwrO5PO/URxnRpk0RkCd23j2fkqXZI
wrTz5c6AKXo/f9llJUHPR0cf4PI0aUFuIgADSIh7qQPpeqy2tezgGD9QGb21Jv3s
mbuDHEtk/8d0A2AX83LDvR6d+hi/av8VA+UHv3UrHvuNZ3R8UhLbvi+wVH3oheoS
rSDecnB3Nho1xGbdGCgj9fu2F+ulnY+tLdxuGPbinJJRodeyHLwEpQOQDWnCuYwO
PKWClvFRAoGBAOZfpIA24Ib4GKNxn7xS+0nAwvZDx5YhvaNQ8ZoQkFn7g4D3E07q
T4uJoh2b33etkFQmUDLQEBGOy+RlunLJpcyy9hhKBN/VC99b4YupTVXjjOKn4ijF
8VkHN2i3BJnGA71H3pcjjDWBcaR8RCWEFv382tn8JmaFnSFAYgTSZpO5AoGBAN7b
btrIbHWG5BbVwVQnzEoDXuN51QzvgkGQ6yBdM/tj5KDvJSB3Ef3TX8KU4hSWAFHp
eQPdY+icDn8A5AZxVSZcipnWzHP2+6kue1cMadKcsQj3ZEvUoBvlbAc2k8sZkf7m
s2uYf0eTjfaSlFFD9CpwR8Xs44MkXf7elJrUGf8HAoGBAIM+CaFhohhCTwcOPEo1
nCMwReG2S4YkQr0/5+Q1e4dH2msmV0GmCxsbldf4bR7pKkhGa3oHPqBCEbZUnhu2
9VXgvoKn6I77+H+PALdoBD7iG+kka5t+6Tgm/FITsfNI8+hpgU3pWn9A91UV1lzp
G5Am9Scql1Xg2NuQqkbE9ttBAoGAFQ8lVZVU8nIxwZqnbz1nh6Lz54kOwe8sHugD
4AYOsHXLGA4hMwUtdQ/xX6DUEF/wXc0zO1NDaqq8j/HUmmtBQaPDETCEF31CYMVc
sGgi490cuZ0vJB9OlfRDFhdpNesPqcfBMqyxcmEWLDPDwj4qp4v+rExrX2wjWb9M
yai7YCcCgYAYL4Bz2ix5vmUDDktV+45HwWKi/nuf/a+hhIi5AyoguWX+tW9EIxpC
1JEx0sf40kkMVU12JuSdLOhpTnjaTlrtcd9UBUbsU3qMNPRTqwKYIpdczFtJE0c7
OGQyqiVvCzTFp5lTev2SiHq2GWzOE4HLFBrCRLycReCymDj1FXKHyQ==
-----END RSA PRIVATE KEY-----`;

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
