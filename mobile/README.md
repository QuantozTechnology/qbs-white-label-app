# Quantoz Payments Mobile App

The Quantoz Payments app showcases the main functionality achievable through the Nexus API, including user creation, creating and receiving payments on the blockchain and many more.
The app is meant to be used as a white-label, production-ready starting point for any new products that want to achieve the goals above.

## Installation

### Install Expo and EAS clients

This app uses the Expo framework, and in order to work it needs additional tooling. Please refer to [their documentation](https://docs.expo.dev/get-started/installation/) to install the needed tools before proceeding.

Moreover, we use the `eas-cli` to easily manage new builds, create new releases and distribute OTA updates. [Check out this page](https://docs.expo.dev/build/setup/) to get started

### Install project dependencies

You need to be in `mobile` folder to execute the following command.

```bash
npm install
```

### Configure the authentication provider

The projects currently relies on Azure Directory B2C as authentication provider. If you wish to keep the same setup, configure your app on Azure and fill the `.envrc` file (located in the `src` folder). If you wish to change/add authentication providers, refer to the [documentation on the Expo website](https://docs.expo.dev/versions/latest/sdk/auth-session/)

#### Recommended tool: direnv

We use [direnv](https://direnv.net/) to automatically load the environment variables set in the `.envrc` file. If you don't want to use it, the less graceful solution is to prepend all the environment variables to the `npm start` command (e.g. `VAR_1=VALUE1 VAR2=VALUE2 ... npm start`)

If you want to change/add authentication provider, check the documentation available on the [Expo Docs website](https://docs.expo.dev/guides/authentication/).

## Usage

### Run the project

To explore all the options offered by the Expo client, [take a look at their docs](https://docs.expo.dev/workflow/expo-cli/).

To quickly launch the project:

```bash
npm start
```

This command starts a local server. You can either use a simulator on your computer or the Expo Go app installed on your phone to run the app. Refer to the Expo official docs for the most-updated information.

### Other useful commands

To run all the frontend tests:

```bash
npm run test
```

## Install new packages

In order to correctly manage packages compatibility, use `npx expo install <package-name>` to install a new package.

HINT: expo will always save it in dependencies: if you want to save the package as dev dependency, use `npx expo install <package-name> -- --save-dev`.

## Testing suite

We use the following tools to test the app:

- [Jest](https://jestjs.io/) as a test runner
- [React Native Testing Library](https://github.com/callstack/react-native-testing-library) to write unit, integration and end-to-end tests
- [Mock Service Worker](https://mswjs.io/): API mocking to abstract the fetching data layer and make it easier to handle different API responses

## Development, testing and production releases

Refer to the official Expo documentation to discover more about [how to handle development and production](https://docs.expo.dev/workflow/development-mode/).

Be aware that this project uses also [Expo Application Services (EAS)](https://docs.expo.dev/eas/), which allow to handle the building and deployment phases in a more abstract and easy way. Refer to the link above to understand better how it works, and check out the `eas.json` file in the `src` folder to see the current setup.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

// TODO which license will this project have?
[MIT](https://choosealicense.com/licenses/mit/)
