// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Pressable, useDisclose, VStack } from "native-base";
import { Dispatch, SetStateAction } from "react";
import { useBalances } from "../api/balances/balances";
import { Balances } from "../api/balances/balances.interface";
import ActionButtonsBar from "./ActionButtonsBar";
import { LinearGradient } from "expo-linear-gradient";
import BalancesList from "./BalancesList";
import TokensSelection from "./TokensSelection";

type IBalancesPanel = {
  selectedToken: Balances | undefined;
  setSelectedToken: Dispatch<SetStateAction<Balances | undefined>>;
};

function BalancePanel({ selectedToken, setSelectedToken }: IBalancesPanel) {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { data: balances } = useBalances();

  return (
    <VStack space={1} minH={290} accessibilityLabel="balance panel">
      <LinearGradient
        colors={["#324658", "#030c0c"]}
        style={{
          flex: 1,
          padding: 16,
          paddingTop: 48,
          borderBottomRightRadius: 16,
          borderBottomLeftRadius: 16,
        }}
      >
        <Pressable
          onPress={onOpen}
          accessibilityLabel="open tokens list"
          py={3}
        >
          <BalancesList
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
          />
        </Pressable>
        <ActionButtonsBar />
      </LinearGradient>
      {balances && (
        <TokensSelection
          isOpen={isOpen}
          onClose={onClose}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          tokens={balances.value}
        />
      )}
    </VStack>
  );
}

export default BalancePanel;
