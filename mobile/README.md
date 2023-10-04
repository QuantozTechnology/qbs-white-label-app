# Mobile App

## Introduction

This mobile app serves as a white-label, production-ready starting point for building new products that leverage the Nexus API. It supports features like user creation, blockchain payments, and much more.

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#automated-testing)
- [Contribution](#contributing)

---

## Technologies

### Core Tech Stack

- [React Native](https://reactnative.dev/): Used for building the mobile app interface.
- [Expo](https://docs.expo.dev/): Provides a framework to build React Native apps.

### Additional Libraries and Services

- [Axios](https://axios-http.com/): For HTTP requests.
- [TanStack Query](https://react-query.tanstack.com/): For data fetching.
- [NativeBase](https://nativebase.io/): For UI components.
- [Jest](https://jestjs.io/): For testing.
- [React Native Testing Library](https://testing-library.com/docs/native-testing-library/intro): For more testing.
- [Mock Service Worker (MSW)](https://mswjs.io/): For mocking services.

> **Note**: Always refer to the `package.json` file for specific version information.

---

## Installation

### Prerequisites

- Install Expo and EAS CLI as mentioned in their [official documentation](https://docs.expo.dev/get-started/installation/).

### Setup Project

1. Navigate to `mobile` folder.
2. Run `npm install`.

### Configuration

#### Environment Variables

The project uses environment variable files to manage various configurations and secrets. These files are divided into two main types:

1. **General Configuration Files**: `.env.development` and `.env.production` contain settings like the app's name, slug, and other environment-specific configurations. These are committed to the repository.

2. **Local Configuration Files**: Manually create `.env.local`, `.env.development.local`, and `.env.production.local` for local development. These should never be committed to the repository.
   - `.env.local` contains generic secrets shared between environments that should stay local.
   - `.env.development.local` and `.env.production.local` are used for storing secrets needed to run the app locally and must also never be committed to the repository.

The specific variables to manually add to these local files are listed below:

- In `.env.development.local` and `.env.production.local`:

  - `APP_ENV`
  - `DEFAULT_STABLECOIN`
  - `AUTH_AZURE_B2C_LOGIN_ISSUER`
  - `AUTH_AZURE_B2C_SIGNUP_ISSUER`
  - `AUTH_AZURE_B2C_SCOPE`
  - `API_URL`
  - `AUTH_AZURE_B2C_PASSWORD_ISSUER`
  - `AUTH_AZURE_B2C_CLIENT_ID`
  - `AUTH_AZURE_B2C_CLIENT_SECRET`

- In `.env.local`:
  - `POSTMAN_MOCK_API_KEY`
  - `POSTMAN_MOCK_API_URL`
  - `SENTRY_ORG`
  - `SENTRY_PROJECT`
  - `SENTRY_DSN`
  - `SENTRY_AUTH_TOKEN`

For more details on managing environment variables with Expo, consult the [Expo documentation](https://docs.expo.dev/guides/environment-variables/) and [EAS Build-specific guide](https://docs.expo.dev/build-reference/variables/).

---

## Usage

### Running the Project

1. Create an Expo development build: `eas build --profile development`.
2. Start the project: `npm start`.

### Builds and Releases

- For creating different builds and releases, modify `app.config.ts` and refer to the `eas.json` for configurations.
- Use `create-stores-build` script for simplifying the build creation for app stores.

---

## Automated Testing

We conduct unit, integration, and a few e2e tests. To run the tests, use:

```bash
npm run test
```

To simulate CI test runs locally, use:

```bash
npm run ci-test
```

### CI scripts

Check the .github folder for the CI scripts (Github Actions) to see how some parts are automated.
