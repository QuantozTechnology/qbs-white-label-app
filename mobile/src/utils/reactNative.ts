// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Platform } from "react-native";

/**
 * Get the current platform where the app is run
 * Kinda hacky, but only way to allow the mocking in the tests for the Platform module
 * @returns "ios" | "android" | "windows" | "macos" | "web"
 */
export function getPlatformOS() {
  return Platform.OS;
}
