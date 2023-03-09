// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Icon, Pressable, Text, VStack } from "native-base";
import {
  Transaction,
  TransactionType,
} from "../api/transactions/transactions.interface";
import { displayFiatAmount } from "../utils/currencies";

type ITransactionListItem = {
  transaction: Transaction;
  // loggedInUserPublicAddress: string | undefined;
};

function TransactionsListItem({ transaction }: ITransactionListItem) {
  const {
    amount,
    type,
    direction,
    fromAccountCode,
    toAccountCode,
    senderName,
    receiverName,
  } = transaction;
  const navigation = useNavigation();

  const isOutgoingTransaction = direction === "Outgoing";

  const transactionDescription = determineTransactionDescription();

  return (
    <Pressable
      onPress={() =>
        // @ts-ignore useNavigation hook improper typing, it works
        navigation.navigate("TransactionDetails", {
          transaction: transaction,
        })
      }
      accessibilityLabel="transaction"
    >
      <HStack
        p={4}
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        rounded="md"
        borderBottomWidth={1}
        borderBottomColor="gray.200"
        minH="68px"
      >
        <HStack space={1} alignItems="center">
          <Box background="primary.200" borderRadius="full" p={3}>
            <Icon
              as={FontAwesome5}
              name={determineTransactionIconName()}
              color="primary.900"
              textAlign="center"
              size="xs"
              accessibilityLabel={`${
                isOutgoingTransaction ? "outgoing" : "incoming"
              } icon`}
            />
          </Box>

          <VStack pl={1}>
            <Text accessibilityLabel="description" fontWeight="medium">
              {transactionDescription}
            </Text>
          </VStack>
        </HStack>
        <Text
          accessibilityLabel="amount"
          bg={isOutgoingTransaction ? "transparent" : "green.200:alpha.60"}
          rounded="md"
          py={0.5}
          px={2}
          fontWeight="bold"
        >{`${isOutgoingTransaction ? "-" : "+"}${displayFiatAmount(
          amount
        )}`}</Text>
      </HStack>
    </Pressable>
  );

  function determineTransactionIconName() {
    switch (type) {
      case TransactionType.Funding:
        return "plus";
      case TransactionType.Payout:
        return "minus";
      default:
        break;
    }

    if (isOutgoingTransaction) {
      return "upload";
    } else if (!isOutgoingTransaction) {
      return "download";
    }
  }

  function determineTransactionDescription() {
    if (type !== TransactionType.Payment) {
      return type;
    }

    if (isOutgoingTransaction) {
      return receiverName ?? toAccountCode;
    }

    return senderName ?? fromAccountCode;
  }
}

export default TransactionsListItem;
