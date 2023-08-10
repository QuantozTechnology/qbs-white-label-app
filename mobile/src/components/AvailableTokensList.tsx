// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Heading, PresenceTransition, View, VStack } from "native-base";
import { useTokens } from "../api/tokens/tokens";
import TokensListSkeleton from "../screens/skeletons/TokensListSkeleton";
import { ImageIdentifier } from "../utils/images";
import TokenListItem from "./TokenListItem";
import FullScreenMessage from "./FullScreenMessage";
import ScreenWrapper from "./ScreenWrapper";
import { FlatList } from "react-native-gesture-handler";
import NoMoreButton from "./NoMoreButton";
import LoadingMessage from "./LoadingMessage";

function AvailableTokensList() {
  const {
    data,
    status,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTokens({ type: "available" });

  if (status === "error") {
    return (
      <FullScreenMessage
        message="Error loading available assets"
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
      <ScreenWrapper flex={1}>
        <FullScreenMessage
          message="No available assets to show"
          icon={null}
          illustration={ImageIdentifier.Loading}
        />
      </ScreenWrapper>
    );
  }

  const items = data.pages.map((page) => page.value).flat();

  return (
    <VStack space={2} flex={1} accessibilityLabel="available tokens section">
      <Heading
        size="xs"
        textTransform="uppercase"
        accessibilityLabel="available tokens heading"
      >
        Available assets
      </Heading>
      <FlatList
        data={items}
        renderItem={({ item }) => <TokenListItem token={item} />}
        ItemSeparatorComponent={() => <View my={1} />}
        ListFooterComponent={
          !hasNextPage ? <NoMoreButton entityName="assets" /> : null
        }
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
      />
      {isFetching && isFetchingNextPage && (
        <PresenceTransition
          visible={isFetching && isFetchingNextPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LoadingMessage />
        </PresenceTransition>
      )}
    </VStack>
  );
}

export default AvailableTokensList;
