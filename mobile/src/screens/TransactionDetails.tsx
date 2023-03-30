// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Icon } from "native-base";
import { Button, ScrollView } from "native-base";
import { TransactionType } from "../api/transactions/transactions.interface";
import DataDisplayField from "../components/DataDisplayField";
import ScreenWrapper from "../components/ScreenWrapper";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import { displayFiatAmount } from "../utils/currencies";
import { formatDateTime } from "../utils/dates";

type TransactionDetailsProps = NativeStackScreenProps<
  PortfolioStackParamList,
  "TransactionDetails"
>;

function TransactionDetails({ navigation, route }: TransactionDetailsProps) {
  const { transaction } = route.params;
  const {
    amount,
    created,
    status,
    type,
    memo,
    fromAccountCode,
    toAccountCode,
    senderName,
    receiverName,
    tokenCode,
    transactionCode,
    direction,
  } = transaction;

  const isOutgoingTransaction = direction === "Outgoing";
  const fromFieldValue = senderName ?? fromAccountCode;
  const toFieldValue = receiverName ?? toAccountCode;

  return (
    <ScreenWrapper px={-4} flex={1}>
      <ScrollView>
        {isOutgoingTransaction ? (
          <DataDisplayField
            label="To"
            value={
              type === TransactionType.Payout ? "My bank account" : toFieldValue
            }
            accessibilityLabel="to"
          />
        ) : (
          <DataDisplayField
            label="From"
            value={type === TransactionType.Funding ? "Issuer" : fromFieldValue}
            accessibilityLabel="from"
          />
        )}
        <DataDisplayField
          label="Amount"
          value={displayFiatAmount(amount, { currency: tokenCode })}
          accessibilityLabel="amount"
          action={
            !isOutgoingTransaction ? (
              <Button
                accessibilityLabel="refund"
                startIcon={
                  <Icon
                    as={Ionicons}
                    name="arrow-redo"
                    color="white"
                    size="sm"
                  />
                }
                size="sm"
                mr={4}
                alignSelf="center"
                onPress={() => {
                  navigation.replace("SendStack", {
                    screen: "Send",
                    params: {
                      accountCode: fromAccountCode,
                      amount: amount,
                      message: memo,
                    },
                  });
                }}
              >
                Refund
              </Button>
            ) : null
          }
        />
        <DataDisplayField
          label="Message"
          value={memo ?? "N/A"}
          accessibilityLabel="message"
        />
        <DataDisplayField
          label="Date"
          value={formatDateTime(created)}
          accessibilityLabel="created date"
        />
        <DataDisplayField
          label="Status"
          value={status}
          accessibilityLabel="status"
        />
        <DataDisplayField
          label="Transaction code"
          value={transactionCode}
          accessibilityLabel="transaction code"
        />
        <DataDisplayField label="Type" value={type} accessibilityLabel="type" />
      </ScrollView>
      <Button onPress={() => navigation.goBack()} p={4} m={4} mb={0}>
        Close
      </Button>
    </ScreenWrapper>
  );
}

export default TransactionDetails;
