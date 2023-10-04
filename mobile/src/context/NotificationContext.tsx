// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import React, { createContext, useCallback, useContext } from "react";
import { Toast } from "native-base";
import Notification from "../components/Notification";

type ToastProviderProps = {
  children: React.ReactNode;
};

type NotificationConfig = {
  position?:
    | "bottom-right"
    | "bottom"
    | "top"
    | "top-right"
    | "top-left"
    | "bottom-left";
};

type CustomToastProps = {
  message: string;
  variant: "info" | "warning" | "success" | "error";
};

interface NotificationFunctions {
  showSuccessNotification: (
    message: string,
    config?: NotificationConfig
  ) => void;
  showErrorNotification: (message: string, config?: NotificationConfig) => void;
  showCustomNotification: (
    message: string,
    variant: CustomToastProps["variant"],
    config?: NotificationConfig
  ) => void;
}

const ToastContext = createContext<NotificationFunctions | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useNotification must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const showSuccessNotification = useCallback(
    (message: string, config?: NotificationConfig) => {
      const position = config?.position ?? "bottom";

      Toast.show({
        render: () => <Notification message={message} variant="success" />,
        placement: position,
      });
    },
    []
  );

  const showErrorNotification = useCallback(
    (message: string, config?: NotificationConfig) => {
      const position = config?.position ?? "bottom";

      Toast.show({
        render: () => <Notification message={message} variant="error" />,
        placement: position,
      });
    },
    []
  );

  const showCustomNotification = useCallback(
    (
      message: string,
      variant: CustomToastProps["variant"],
      config?: NotificationConfig
    ) => {
      const position = config?.position ?? "bottom";

      Toast.show({
        render: () => <Notification message={message} variant={variant} />,
        placement: position,
      });
    },
    []
  );

  return (
    <ToastContext.Provider
      value={{
        showSuccessNotification,
        showErrorNotification,
        showCustomNotification,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
