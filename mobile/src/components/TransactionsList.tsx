// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AxiosError } from "axios";
import {
  Box,
  Heading,
  HStack,
  Icon,
  PresenceTransition,
  SectionList,
  Spinner,
  Stack,
  Text,
  useToast,
  View,
  VStack,
} from "native-base";
import { APIError } from "../api/generic/error.interface";
import { useTransactions } from "../api/transactions/transactions";
import TransactionsListItem from "./TransactionsListItem";
import Notification from "./Notification";
import TransactionListSkeleton from "./TransactionListSkeleton";
import { formatDate } from "../utils/dates";
import FullScreenMessage from "./FullScreenMessage";
import { Ionicons } from "@expo/vector-icons";
import AllCapsSectionHeading from "./AllCapsSectionHeading";
import { useCallback, useEffect, useState } from "react";
import { Transaction } from "../api/transactions/transactions.interface";
import { formatError } from "../utils/errors";
import { useBalances } from "../api/balances/balances";
import { RefreshControl } from "react-native";
import { customTheme } from "../theme/theme";

type TransactionsListProps = {
  selectedToken: string | undefined;
};

function TransactionsList({ selectedToken }: TransactionsListProps) {
  const toast = useToast();
  const { error: balancesError } = useBalances();

  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    error,
    status,
    refetch,
    // triggered only when pulling down to refresh the list, not on initial loading or for next page
    isRefetching,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useTransactions();

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    if (!isRefetching) {
      refetch();
    }

    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (error) {
      const axiosError = error as AxiosError<APIError>;

      if (!toast.isActive("tx-api-error"))
        toast.show({
          render: () => (
            <Notification message={formatError(axiosError)} variant="error" />
          ),
          id: "tx-api-error",
        });
    }
  }, [error]);

  if (status === "error" || balancesError) {
    return (
      <VStack p={4}>
        <AllCapsSectionHeading text="Transactions" />
        <FullScreenMessage
          title="Error"
          message="Cannot load transactions, try again later"
          noFullScreen
        />
      </VStack>
    );
  }

  if (status === "loading" || !selectedToken) {
    return (
      <VStack p={4}>
        <TransactionListSkeleton />
      </VStack>
    );
  }

  if (data.pages[0].value.length === 0) {
    return (
      <VStack mt={4} mb={2} px={4}>
        <FullScreenMessage
          title="No transactions"
          message="The more you use the app, the more you will see here :)"
          icon={
            <Icon as={Ionicons} name="information-circle-outline" size="2xl" />
          }
          noFullScreen
        />
      </VStack>
    );
  }

  const groupedTransactions: { [key: string]: Transaction[] } = {};

  data.pages.forEach((page) => {
    return page.value
      .filter(({ tokenCode }) => tokenCode === selectedToken)
      .reduce((group, record) => {
        const { created } = record;
        const createdDate = formatDate(created);

        group[createdDate] = group[createdDate] ?? [];
        group[createdDate].push(record);

        return group;
      }, groupedTransactions);
  });

  // build data structure required by RN SectionList
  const sectionsData = Object.entries(groupedTransactions).map((v) => {
    return { date: v[0], data: v[1] };
  });

  return (
    <VStack accessibilityLabel="transaction list" flex={1}>
      <SectionList
        sections={sectionsData}
        renderItem={({ item }) => <TransactionsListItem transaction={item} />}
        renderSectionHeader={({ section: { date } }) => (
          <View bg="primary.100" px={4}>
            <Text py={1}>{date}</Text>
          </View>
        )}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={
          !hasNextPage ? (
            <Stack alignItems="center" py={8}>
              <Box bg="primary.100" w="2/3" p={2} rounded="full">
                <Text textAlign="center" color="gray.400" fontWeight="bold">
                  No more transactions to show
                </Text>
              </Box>
            </Stack>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[customTheme.colors.primary[500]]}
            tintColor={customTheme.colors.primary[500]}
          />
        }
      />
      {isFetching && isFetchingNextPage && (
        <PresenceTransition
          visible={isFetching && isFetchingNextPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HStack space={2} justifyContent="center" p={4}>
            <Spinner accessibilityLabel="Loading transactions" />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        </PresenceTransition>
      )}
    </VStack>
  );
}

export default TransactionsList;
