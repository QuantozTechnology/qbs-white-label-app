import { Platform } from "react-native";

/**
 * Get the current platform where the app is run
 * Kinda hacky, but only way to allow the mocking in the tests for the Platform module
 * @returns "ios" | "android" | "windows" | "macos" | "web"
 */
export function getPlatformOS() {
  return Platform.OS;
}
