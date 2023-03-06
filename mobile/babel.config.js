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
