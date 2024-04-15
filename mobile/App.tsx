// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

// Gesture handler needs to be imported on top here to properly work
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { AuthProvider } from "./src/auth/AuthContext";
import WelcomeStackNavigator from "./src/navigation/WelcomeStack";
import { customTheme } from "./src/theme/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { appNavigationState } from "./src/config/config";
import FullScreenLoadingSpinner from "./src/components/FullScreenLoadingSpinner";
import { CustomerProvider } from "./src/context/CustomerContext";
import { Feather } from "@expo/vector-icons";
import { ToastProvider } from "./src/context/NotificationContext";
import { AppStateProvider } from './src/context/AppStateContext';
import { removeStoredData } from "./src/utils/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QPA_TOKEN_KEY } from "./src/auth/authStorageService";

const prefix = Linking.createURL("/");
const queryClient = new QueryClient();

const APP_INSTALLED_KEY = 'APP_INSTALLED';

async function checkAppInstalled() {
  const appInstalled = await AsyncStorage.getItem(APP_INSTALLED_KEY);
  if (!appInstalled) {
    await AsyncStorage.setItem(APP_INSTALLED_KEY, 'true');
    // remove oid
    await removeStoredData(["oid", QPA_TOKEN_KEY.QPA_ACCESS_TOKEN, QPA_TOKEN_KEY.QPA_ID_TOKEN, QPA_TOKEN_KEY.QPA_REFRESH_TOKEN]);
  }

  return true;
}
export default function App() {
  const [appReady, setAppReady] = useState(false);

  const linking = {
    prefixes: [prefix],
    config: appNavigationState,
  };

  const loadFontsAsync = async() => {
    await Font.loadAsync({
      "Lato-Light": require("./assets/fonts/Lato-Light.ttf"),
      "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
      "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
    });
    await Font.loadAsync(FontAwesome5.font);
    await Font.loadAsync(Ionicons.font);
    await Font.loadAsync(Feather.font);
    await checkAppInstalled();
    setAppReady(true);
  }
  useEffect(() => {
    loadFontsAsync();
  }, []);


  if (!appReady) {
    return null;
  }

  return (
    <>
      <AuthProvider>
        <NativeBaseProvider theme={customTheme}>
          <NavigationContainer
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            linking={linking as any}
            fallback={<FullScreenLoadingSpinner />}
          >
            <QueryClientProvider client={queryClient}>
              <CustomerProvider>
                  <ToastProvider>
                    <ErrorBoundary>
                      <AppStateProvider>
                        <WelcomeStackNavigator />
                      </AppStateProvider>
                    </ErrorBoundary>
                  </ToastProvider>
              </CustomerProvider>
            </QueryClientProvider>
          </NavigationContainer>
        </NativeBaseProvider>
      </AuthProvider>
      <StatusBar style="dark" translucent />
    </>
  );
}
