// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // the Reanimated plugin has always to be loaded last!
    plugins: [
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env"
      }],
      "react-native-reanimated/plugin"],
  };
};
