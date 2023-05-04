// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

// The logic below follows recommendations from the Expo docs, be sure to have a good understanding before changing configuration
// - https://docs.expo.dev/guides/environment-variables/
// - https://docs.expo.dev/build-reference/variables/

// The `process.env.APP_ENV` is read either from:
// - .envrc file (for local development)
// - Expo Secrets (for build processes)

const isDevEnv = process.env.APP_ENV === "development";
const isPreviewEnv = process.env.APP_ENV === "preview";

const AppConfig = {
  name: isDevEnv
    ? "Quantoz Blockchain Solutions (Dev)"
    : isPreviewEnv
    ? "Quantoz Blockchain Solutions (Test)"
    : "Quantoz Blockchain Solutions",
  icon: "./assets/icon-qbs.png",
  image: "./assets/splash-qbs.png",
  ios: {
    bundleIdentifier: isDevEnv
      ? "com.quantoz.qbs.dev"
      : isPreviewEnv
      ? "com.quantoz.qbs.preview"
      : "com.quantoz.qbs",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon-qbs.png",
    },
    package: isDevEnv
      ? "com.quantoz.qbs.dev"
      : isPreviewEnv
      ? "com.quantoz.qbs.preview"
      : "com.quantoz.qbs",
  },
  // This logic sets the correct env variables to use throughout the app
  // They can be read through the `expo-constants` package (https://docs.expo.dev/guides/environment-variables/#reading-environment-variables)
  extra: {
    POSTMAN_MOCK_API_KEY: process.env.POSTMAN_MOCK_API_KEY,  
    API_URL: isDevEnv ? process.env.DEV_API_URL : process.env.PROD_API_URL,
    AUTH_AZURE_B2C_LOGIN_ISSUER: isDevEnv
      ? process.env.DEV_AUTH_AZURE_B2C_LOGIN_ISSUER
      : process.env.PROD_AUTH_AZURE_B2C_LOGIN_ISSUER,
    AUTH_AZURE_B2C_SIGNUP_ISSUER: isDevEnv
      ? process.env.DEV_AUTH_AZURE_B2C_SIGNUP_ISSUER
      : process.env.PROD_AUTH_AZURE_B2C_SIGNUP_ISSUER,
    AUTH_AZURE_B2C_CLIENT_ID: isDevEnv
      ? process.env.DEV_AUTH_AZURE_B2C_CLIENT_ID
      : process.env.PROD_AUTH_AZURE_B2C_CLIENT_ID,
    AUTH_AZURE_B2C_CLIENT_SECRET: isDevEnv
      ? process.env.DEV_AUTH_AZURE_B2C_CLIENT_SECRET
      : process.env.PROD_AUTH_AZURE_B2C_CLIENT_SECRET,
    AUTH_AZURE_B2C_SCOPE: isDevEnv
      ? process.env.DEV_AUTH_AZURE_B2C_SCOPE
      : process.env.PROD_AUTH_AZURE_B2C_SCOPE,
    AUTH_AZURE_B2C_PASSWORD_ISSUER: isDevEnv
      ? process.env.DEV_AUTH_AZURE_B2C_PASSWORD_ISSUER
      : process.env.PROD_AUTH_AZURE_B2C_PASSWORD_ISSUER,
    APP_ENV: process.env.APP_ENV || null,
  },
};

export default () => ({
  expo: {
    name: AppConfig.name,
    slug: "qbs-test-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: AppConfig.icon,
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/splash-qbs.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 1500,
      url: "https://u.expo.dev/508103fd-4d90-4213-98d1-045bdcd043b5",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: AppConfig.ios.bundleIdentifier,
      infoPlist: {
        NSCameraUsageDescription:
          "This app uses the camera to take photos of your documents, in order to upgrade to a higher tier.",
        NSFaceIDUsageDescription:
          "FaceID is used to authenticate you and to access your account",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: AppConfig.android.adaptiveIcon.foregroundImage,
        backgroundColor: "#FFFFFF",
      },
      package: AppConfig.android.package,
    },
    // change to your own organization in Expo account
    owner: "quantoz",
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "508103fd-4d90-4213-98d1-045bdcd043b5",
      },
      ...AppConfig.extra,
    },
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you upload the necessary documentation.",
        },
      ],
    ],
    // defines the package name of the app
    scheme: isDevEnv
      ? "quantoz.qbs.dev"
      : isPreviewEnv
      ? "quantoz.qbs.preview"
      : "quantoz.qbs",
    platforms: ["ios", "android"],
    runtimeVersion: {
      policy: "sdkVersion",
    },
  },
});
