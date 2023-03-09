// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

/* eslint-disable no-undef */
import Constants from "expo-constants";
import "react-native-gesture-handler/jestSetup";
jest.mock("react-native-reanimated", () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const Reanimated = require("react-native-reanimated/mock");

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// mock url called by tests
Constants.expoConfig.extra = { API_URL: "http://test.com" };
