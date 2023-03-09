// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Toast } from "native-base";
import { useEffect, useState } from "react";
import { Balances } from "../api/balances/balances.interface";
import TransactionsList from "../components/TransactionsList";
import BalancePanel from "../components/BalancePanel";
import ScreenWrapper from "../components/ScreenWrapper";
import { useBalances } from "../api/balances/balances";
import { AxiosError } from "axios";
import { APIError } from "../api/generic/error.interface";
import Notification from "../components/Notification";
import { formatError } from "../utils/errors";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";
import ErrorBoundary from "../components/ErrorBoundary";

function PortfolioOverview() {
  const isFocused = useIsFocused();
  const [selectedToken, setSelectedToken] = useState<Balances | undefined>();

  const { data, error } = useBalances();

  useEffect(() => {
    if (data) {
      setSelectedToken(data.value[0]);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const axiosError = error as AxiosError<APIError>;
      if (Toast.isActive("balances-api-error")) {
        Toast.show({
          render: () => (
            <Notification
              message={formatError(axiosError)}
              title="Cannot load balances"
              variant="error"
            />
          ),
          id: "balances-api-error",
        });
      }
    }
  }, [error]);

  return (
    <ScreenWrapper p={-4} bg="white" flex={1}>
      <BalancePanel
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
      />
      <ErrorBoundary>
        <TransactionsList selectedToken={selectedToken?.tokenCode} />
      </ErrorBoundary>
      {isFocused ? <StatusBar style="light" /> : null}
    </ScreenWrapper>
  );
}

export default PortfolioOverview;
