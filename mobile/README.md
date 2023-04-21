# Mobile App

The mobile app showcases the main functionality achievable through the Nexus API, including user creation, creating and receiving payments on the blockchain and many more.
The app is meant to be used as a white-label, production-ready starting point for any new products that want to achieve the goals above.

## Technologies

**Important**: refer to the `package.json` files to know which version is currently used, and therefore which version of the documentation that needs to be referenced.

### Build and deploy

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Expo Application Services (EAS)](https://docs.expo.dev/eas/)
- [React Navigation](https://reactnavigation.org/)

### Data fetching & state management

- [Axios](https://axios-http.com/docs/intro)
- [TanStack Query](https://tanstack.com/query/latest)

### UI Framework

- [NativeBase](https://nativebase.io/)

### Test

- [Jest](https://jestjs.io/) as a test runner
- [React Native Testing Library](https://github.com/callstack/react-native-testing-library) to write unit, integration and end-to-end tests
- [Mock Service Worker](https://mswjs.io/): API mocking to abstract the fetching data layer and make it easier to handle different API responses (success, errors, specific responses...)

### Dev experience tools

- [Husky](https://github.com/typicode/husky): used to customize the Git pre-commit action, so that it checks if there are any issues with the staged code changes before committing. Can be removed, not essential. Used in combination with [lint-staged](https://github.com/okonet/lint-staged)

---

## Installation

### Expo and EAS clients

This app uses the Expo framework, and in order to work it needs additional tooling. Please refer to [their documentation](https://docs.expo.dev/get-started/installation/) to install the needed tools before proceeding.
Moreover, we use the `eas-cli` to easily manage new builds, create new releases and distribute OTA updates. [Check out this page](https://docs.expo.dev/build/setup/) to get started

### Install project dependencies

You need to be in `mobile` folder to execute the following command.

```bash
npm install
```

### Add configuration for auth provider

The projects currently relies on Microsoft Azure Directory B2C as authentication provider. If you wish to keep the same setup:

1. create your own environments on Azure AD B2C
2. Fill the necessary env variables in the `.envrc` file in the `mobile` folder.

> We use [direnv](https://direnv.net/) to automatically load the environment variables set in the `.envrc` file. If you don't want to use it, the less graceful solution is to prepend all the environment variables to the `npm start` command (e.g. `VAR_1=VALUE1 VAR2=VALUE2 ... npm start`)
>
> **VERY IMPORTANT**: every time tou change the `.envrc` file, you **MUST** allow the changes to the env variables by executing the `direnv allow` command in the terminal.

If you wish to change/add authentication providers, refer to the [documentation on the Expo website](https://docs.expo.dev/versions/latest/sdk/auth-session/).

---

## Usage

### Run the project

First of all, check the following settings are correct:

- `APP_ENV` in the `.envrc` file is correct (e.g. you are running it locally, it should be `development`)
- execute the `direnv allow` in the terminal to make sure the correct env variables are loaded
- Set the right value for the `defaultStablecoin` property in `mobile/src/config/config.ts`. For example, we have two different tokens for development and production purposes, and this needs to be changed depending on which build you want to run/deploy.

After this initial checks, create an Expo development build using the following command:

```bash
eas build --profile development
```

When the build is ready, you will be able to run the app using the following command (select the development build you just created when prompted)

```bash
npm start -- --dev-client
```

This command starts a local server. You can either use a simulator on your computer or the Expo Go app installed on your phone to run the app. Refer to the Expo official docs for the most-updated information.

> Sometimes the app might retain old cached data from previous builds, leading to unexpected behaviors.
> Use `npm start -- --dev-client -c` to clean the cache.

### Different builds for different purposes

Refer to the official Expo documentation to discover more about [how to handle development, test and production versions](https://docs.expo.dev/workflow/development-mode/).

In the `app.config.ts` file you will find the Expo configuration for this project. Depending on the value of the `APP_ENV` env variable defined in the `.envrc` file, it will create a different version of the app (different package name, app icon and Azure environment configurations).

Be aware that this project uses also [Expo Application Services (EAS)](https://docs.expo.dev/eas/), which allow to handle the building and deployment phases in a more abstract and easy way. Refer to the link above to understand better how it works, and check out the `eas.json` file in the `src` folder to see the current setup.

#### Secrets stored in Expo accounts

When you will create builds using Expo Application Services (EAS), the env variables used will be the ones stores in the Secrets sections in your Expo account. Our recommendation is the following:

- Use the `.envrc` file locally as explained above
- Run `eas secret:push` to upload these variables to Expo, so that they can be used for the builds.

> Note: the `APP_ENV` variable should be set to `production` on Expo Secrets, so that it would build the app for production by default.

### Release the app

**Prerequisites**

- Apple Developer account (if releasing on the App Store)
- Google Play Developer account (if releasing on the Play Store)

Follow the instructions on the [Expo Build](https://docs.expo.dev/build/introduction/) docs website.

To ease the process, a custom command called `create-stores-build` has been added to the project's `package.json` scripts section. Check it out to see what we use to create a new build for the stores.

### Update the app

[EAS Update](https://docs.expo.dev/eas-update/introduction/) can be used to send JS changes (not native ones) to the app, without the need to create a new build on the stores. Useful for quick fixes, the updates get downloaded when the user opens the app after they have been delivered.

As for the creation of the build, the `update-stores-build` has been added to the project's `package.json` scripts section to show how it is currently handled.

### Automated testing

To run all the frontend tests:

```bash
npm run test
```

> You can use the following command to simulate a CI enviroment for your tests. Sometimes you could see tests failing with this command, while they pass locally.
>
> `npm run ci-test`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.
