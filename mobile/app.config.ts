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
    ? "Quantoz Payments (Dev)"
    : isPreviewEnv
    ? "Quantoz Payments (Test)"
    : "Quantoz Payments",
  icon: isDevEnv
    ? "./assets/dev-icon.png"
    : isPreviewEnv
    ? "./assets/test-icon.png"
    : "./assets/icon.png",
  image: isDevEnv
    ? "./assets/dev-splash.png"
    : isPreviewEnv
    ? "./assets/test-splash.png"
    : "./assets/splash.png",
  ios: {
    bundleIdentifier: isDevEnv
      ? "com.quantoz.payments.dev"
      : isPreviewEnv
      ? "com.quantoz.payments.preview"
      : "com.quantoz.payments",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: isDevEnv
        ? "./assets/dev-adaptive-icon.png"
        : isPreviewEnv
        ? "./assets/test-adaptive-icon.png"
        : "./assets/adaptive-icon.png",
    },
    package: isDevEnv
      ? "com.quantoz.payments.dev"
      : isPreviewEnv
      ? "com.quantoz.payments.preview"
      : "com.quantoz.payments",
  },
  // This logic sets the correct env variables to use throughout the app
  // They can be read through the `expo-constants` package (https://docs.expo.dev/guides/environment-variables/#reading-environment-variables)
  extra: {
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
    slug: "quantoz-payments",
    version: "1.0.2",
    orientation: "portrait",
    icon: AppConfig.icon,
    userInterfaceStyle: "light",

    splash: {
      image: isDevEnv
        ? "./assets/dev-splash.png"
        : isPreviewEnv
        ? "./assets/test-splash.png"
        : "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 1500,
      url: "https://u.expo.dev/4a15d834-f9d3-4247-ab71-fabe26335f7a",
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
        projectId: "4a15d834-f9d3-4247-ab71-fabe26335f7a",
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
      ? "quantoz.payments.app.dev"
      : isPreviewEnv
      ? "quantoz.payments.app.preview"
      : "quantoz.payments.app",
    platforms: ["ios", "android"],
    runtimeVersion: {
      policy: "sdkVersion",
    },
  },
});
