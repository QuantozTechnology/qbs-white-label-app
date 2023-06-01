// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AxiosError } from "axios";
import {
  Heading,
  HStack,
  PresenceTransition,
  SectionList,
  Spinner,
  Text,
  Toast,
  View,
  VStack,
} from "native-base";
import { useCallback, useEffect, useState } from "react";
import { APIError } from "../api/generic/error.interface";
import { useOffers } from "../api/offers/offers";
import TokensListSkeleton from "../screens/skeletons/TokensListSkeleton";
import { ImageIdentifier } from "../utils/images";
import FullScreenMessage from "./FullScreenMessage";
import OfferListItem from "./OfferListItem";
import Notification from "./Notification";
import { formatError } from "../utils/errors";
import { Offer } from "../api/offers/offers.interface";
import { formatDate } from "../utils/dates";
import NoMoreButton from "./NoMoreButton";
import { RefreshControl } from "react-native";
import { customTheme } from "../theme/theme";
type OpenOffersListProps = {
  type: "Open" | "Closed";
};

function OffersList({ type }: OpenOffersListProps) {
  const [refreshing, setRefreshing] = useState(false);
  const {
    data,
    error,
    status,
    refetch,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useOffers({ type });

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

      if (!Toast.isActive("tx-api-error")) {
        Toast.show({
          render: () => (
            <Notification message={formatError(axiosError)} variant="error" />
          ),
          id: "tx-api-error",
        });
      }
    }
  }, [error]);

  if (status === "error") {
    return (
      <FullScreenMessage
        message="Cannot load offers, try again later."
        icon={null}
        illustration={ImageIdentifier.Find}
      />
    );
  }

  if (status === "loading") {
    return <TokensListSkeleton />;
  }

  if (data.pages[0].value.length === 0) {
    return (
      <FullScreenMessage
        message="No offers to show"
        icon={null}
        illustration={ImageIdentifier.Loading}
      />
    );
  }

  const groupedOffers: { [key: string]: Offer[] } = {};

  data.pages.forEach((page) => {
    return page.value.reduce((group, record) => {
      const { createdOn } = record;
      const createdDate = formatDate(createdOn);

      group[createdDate] = group[createdDate] ?? [];
      group[createdDate].push(record);

      return group;
    }, groupedOffers);
  });

  // build data structure required by RN SectionList
  const sectionsData = Object.entries(groupedOffers).map((v) => {
    return { date: v[0], data: v[1] };
  });

  return (
    <VStack space={2}>
      <SectionList
        sections={sectionsData}
        renderItem={({ item }) => <OfferListItem offer={item} />}
        ItemSeparatorComponent={() => <View h={2} />}
        renderSectionHeader={({ section: { date } }) => (
          <View bg="primary.100" px={4} pt={2}>
            <Text py={1}>{date}</Text>
          </View>
        )}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={
          !hasNextPage ? <NoMoreButton entityName="offers" /> : null
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
            <Spinner accessibilityLabel="Loading offers" />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        </PresenceTransition>
      )}
    </VStack>
  );
}

export default OffersList;
