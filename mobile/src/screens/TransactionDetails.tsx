import { NativeStackScreenProps } from "@react-navigation/native-stack";
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
