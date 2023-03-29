// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Skeleton, Text, VStack } from "native-base";
import { useBalances } from "../api/balances/balances";
import { useCustomerLimits } from "../api/limits/limits";
import { useSimulateWithdraw } from "../api/withdraw/withdraw";
import { defaultConfig } from "../config/config";
import { displayFiatAmount } from "../utils/currencies";
import { formatAmount } from "../utils/string";
import DataDisplayField from "./DataDisplayField";
import DataDisplayFieldSkeleton from "./DataDisplayFieldSkeleton";
import FullScreenMessage from "./FullScreenMessage";

type Props = {
  tokenCode: string;
  amount: string;
};

function WithdrawFees({ tokenCode, amount }: Props) {
  const { data: balances, status: balancesStatus } = useBalances();
  const { data: limits, status: limitsStatus } = useCustomerLimits();

  const { data, status } = useSimulateWithdraw(
    tokenCode,
    formatAmount(amount),
    {
      enabled: isValidAmountForFeesCalculation(),
    }
  );

  if (amount === "") {
    return (
      <DataDisplayField
        label="You will receive"
        value={
          <VStack>
            <Text fontSize="lg" accessibilityLabel="total amount">
              {displayFiatAmount(0, {
                currency: defaultConfig.defaultFiatCurrency,
              })}
            </Text>
            <Text fontSize="xs" accessibilityLabel="fees">
              Fees:{" "}
              {displayFiatAmount(0, {
                currency: defaultConfig.defaultFiatCurrency,
              })}
            </Text>
          </VStack>
        }
        accessibilityLabel="empty amount withdraw fees"
      />
    );
  }

  if (balancesStatus === "error" || limitsStatus === "error") {
    return (
      <FullScreenMessage message="Try again later" title="Withdraw error" />
    );
  }

  if (balancesStatus === "loading" || limitsStatus === "loading") {
    return <DataDisplayFieldSkeleton />;
  }

  if (!isValidAmountForFeesCalculation() || status === "error") {
    return (
      <DataDisplayField
        accessibilityLabel="withdraw fees error"
        label="You will receive"
        value={
          <VStack>
            <Text
              fontSize="lg"
              accessibilityLabel="total amount"
              color="error.500"
            >
              {parseFloat(formatAmount(amount)) <
              defaultConfig.feeSettings.minimumFee
                ? "Amount too low"
                : "Select a valid amount"}
            </Text>
            <Text fontSize="xs" accessibilityLabel="fees">
              {parseFloat(formatAmount(amount)) <
              defaultConfig.feeSettings.minimumFee
                ? `Min: ${displayFiatAmount(
                    defaultConfig.feeSettings.minimumFee,
                    { currency: defaultConfig.defaultStableCoin.code }
                  )}`
                : "Fees: N/A"}
            </Text>
          </VStack>
        }
        bg="error.100"
      />
    );
  }

  return (
    <DataDisplayField
      accessibilityLabel="withdraw fees"
      label="You will receive"
      value={
        status === "loading" ? (
          <VStack space={2}>
            <Skeleton startColor="muted.400" h={6} rounded="md" />
            <Skeleton startColor="muted.400" h={3} rounded="md" />
          </VStack>
        ) : (
          <VStack>
            <Text fontSize="lg" accessibilityLabel="total amount">
              {displayFiatAmount(data?.value.executedFiat, {
                currency: defaultConfig.defaultFiatCurrency,
              })}
            </Text>
            <Text fontSize="xs" accessibilityLabel="fees">
              Fees:{" "}
              {displayFiatAmount(
                data?.value.fees.bankFeeFiat && data?.value.fees.serviceFeeFiat
                  ? data?.value.fees.bankFeeFiat +
                      data?.value.fees.serviceFeeFiat
                  : undefined,
                { currency: defaultConfig.defaultFiatCurrency }
              )}
            </Text>
          </VStack>
        )
      }
    />
  );

  function isValidAmountForFeesCalculation() {
    const amountFloat = parseFloat(formatAmount(amount));

    return (
      balances != null &&
      limits != null &&
      amountFloat <= parseFloat(limits.value[0].withdraw.limit.monthly) &&
      amountFloat <= balances.value[0].balance &&
      amountFloat >= defaultConfig.feeSettings.minimumFee
    );
  }
}

export default WithdrawFees;
