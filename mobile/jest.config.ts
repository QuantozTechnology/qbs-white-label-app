/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],

  // Use this configuration option to add custom reporters to Jest
  reporters: ["default"],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  preset: "jest-expo",
  setupFiles: ["./src/jest/jest.mockSetup.js", "dotenv/config"],

  // The test environment that will be used for testing
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "./src/jest/jest.setup.js",
  ],

  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|axios)",
  ],
};
