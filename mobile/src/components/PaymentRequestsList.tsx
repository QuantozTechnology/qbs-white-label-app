// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import {
  Box,
  Heading,
  HStack,
  PresenceTransition,
  SectionList,
  Skeleton,
  Spinner,
  Stack,
  Text,
  View,
  VStack,
} from "native-base";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { usePaymentRequests } from "../api/paymentrequest/paymentRequest";
import { PaymentRequestDetails } from "../api/paymentrequest/paymentRequest.interface";
import FullScreenMessage from "./FullScreenMessage";
import PaymentRequestItem from "./PaymentRequestItem";
import ScreenWrapper from "./ScreenWrapper";
import { customTheme } from "../theme/theme";
import { formatDate } from "../utils/dates";
import { ImageIdentifier } from "../utils/images";
import { PaymentRequestsTabParamList } from "../navigation/PaymentRequestsTab";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

type Props = MaterialTopTabScreenProps<PaymentRequestsTabParamList> & {
  type: "open" | "expired";
};

function PaymentRequestsList({ type }: Props) {
  const {
    data,
    status,
    refetch,
    // triggered only when pulling down to refresh the list, not on initial loading or for next page
    isRefetching,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = usePaymentRequests({ type });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    if (!isRefetching) {
      refetch();
    }

    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);

  if (status === "error") {
    return (
      <FullScreenMessage
        message="Error loading payment request details"
        icon={null}
        illustration={ImageIdentifier.Find}
      />
    );
  }

  if (status === "loading") {
    return (
      <VStack space={2}>
        <Skeleton h={20} mb={1} rounded="md" />
        <Skeleton h={20} mb={1} rounded="md" />
        <Skeleton h={20} mb={1} rounded="md" />
        <Skeleton h={20} mb={1} rounded="md" />
      </VStack>
    );
  }

  if (data.pages[0].value.length === 0) {
    return (
      <ScreenWrapper flex={1}>
        <FullScreenMessage
          message="No payment requests to show"
          icon={null}
          illustration={ImageIdentifier.Loading}
        />
      </ScreenWrapper>
    );
  }

  const groupedPayments: { [key: string]: PaymentRequestDetails[] } = {};

  data.pages.forEach((page) => {
    return page.value
      .filter(({ status }) => status !== "Cancelled")
      .reduce((group, record) => {
        const { createdOn } = record;

        const createdDate = formatDate(createdOn);

        group[createdDate] = group[createdDate] ?? [];
        group[createdDate].push(record);

        return group;
      }, groupedPayments);
  });

  // build data structure required by RN SectionList
  const sectionsData = Object.entries(groupedPayments).map((v) => {
    return { date: v[0], data: v[1] };
  });

  return (
    <ScreenWrapper flex={1} p={-4}>
      <SectionList
        sections={sectionsData}
        renderItem={({ item }) => <PaymentRequestItem details={item} />}
        renderSectionHeader={({ section: { date } }) => (
          <View bg="primary.100" px={4}>
            <Text py={1} mt={1}>
              {date}
            </Text>
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
                  No more requests to show
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
    </ScreenWrapper>
  );
}

export default PaymentRequestsList;
