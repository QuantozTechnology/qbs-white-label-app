// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { render } from "@testing-library/react-native";
import { AuthProvider } from "../auth/AuthContext";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import PropTypes from "prop-types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CustomerProvider } from "../context/CustomerContext";

// Configuration for rendering with NativeBase: https://docs.nativebase.io/testing
const inset = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const AllTheProviders = ({ children }) => {
  const queryClient = new QueryClient({
    logger: {
      log: console.log,
      warn: console.warn,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      error: () => {},
    },
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <AuthProvider>
      <NativeBaseProvider initialWindowMetrics={inset}>
        <NavigationContainer>
          <QueryClientProvider client={queryClient}>
            <CustomerProvider>{children}</CustomerProvider>
          </QueryClientProvider>
        </NavigationContainer>
      </NativeBaseProvider>
    </AuthProvider>
  );
};

AllTheProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react-native";
export { customRender as render };
