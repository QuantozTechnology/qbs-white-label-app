// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Heading, Image, Text, VStack } from "native-base";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  render?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.render ?? (
          <VStack
            flex={1}
            alignContent="center"
            justifyContent="center"
            p={4}
            space={2}
            bg="white"
          >
            <Heading textAlign="center" fontWeight="bold" size="2xl">
              Ooops
            </Heading>
            <Text textAlign="center" fontSize="lg">
              Sorry for the inconvenience, we are on it!
            </Text>
            <Image
              alt="app error"
              source={require("../../assets/find.webp")}
              mx="auto"
              bg="green.200"
            />
          </VStack>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
