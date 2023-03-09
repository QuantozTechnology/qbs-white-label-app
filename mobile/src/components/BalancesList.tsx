// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Heading, HStack, Text, VStack } from "native-base";
import { Dispatch, SetStateAction } from "react";
import { useBalances } from "../api/balances/balances";
import BalanceItem from "./BalanceItem";
import BalanceItemError from "./BalanceItemError";
import BalanceItemSkeleton from "./BalanceItemSkeleton";
import { Balances } from "../api/balances/balances.interface";
import ErrorBoundary from "./ErrorBoundary";

type Props = {
  selectedToken: Balances | undefined;
  setSelectedToken: Dispatch<SetStateAction<Balances | undefined>>;
};

// TODO remove eslint comment and implement token selection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BalancesList({ selectedToken, setSelectedToken }: Props) {
  const { data: balances, status } = useBalances();

  return (
    <ErrorBoundary
      render={
        <VStack
          minH={270}
          bg="#030c0c"
          borderBottomRadius={10}
          justifyContent="center"
          space={4}
        >
          <Heading textAlign="center" color="white">
            Ooops
          </Heading>
          <Text color="white" textAlign="center">
            Something went wrong, we are working on it
          </Text>
        </VStack>
      }
    >
      <HStack py={1} accessibilityLabel="balances list">
        {status === "error" ? (
          <BalanceItemError />
        ) : status === "loading" ? (
          <BalanceItemSkeleton />
        ) : (
          balances.value.map(({ balance, tokenCode }) => (
            <BalanceItem
              key={tokenCode}
              balance={balance}
              tokenCode={tokenCode}
              isSelected={tokenCode === selectedToken?.tokenCode}
            />
          ))
        )}
      </HStack>
    </ErrorBoundary>
  );
}

export default BalancesList;
