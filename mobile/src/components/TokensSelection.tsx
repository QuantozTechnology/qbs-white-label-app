// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Actionsheet, Box, HStack, Icon, Pressable, Text } from "native-base";
import { Dispatch, SetStateAction } from "react";
import { Balances } from "../api/balances/balances.interface";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import { displayFiatAmount } from "../utils/currencies";

type TokensSelectionProps = {
  tokens: Balances[];
  selectedToken: Balances | undefined;
  setSelectedToken: Dispatch<SetStateAction<Balances | undefined>>;
  isOpen: boolean;
  onClose: () => void;
};

function TokensSelection({
  isOpen,
  onClose,
  selectedToken,
  setSelectedToken,
  tokens,
}: TokensSelectionProps) {
  const navigation = useNavigation<NavigationProp<PortfolioStackParamList>>();

  function handleTokenDetailsPress() {
    onClose();
    if(selectedToken != null){
      navigation.navigate("TokenDetails", {tokenCode: selectedToken?.tokenCode}); 
    }
  }

  return (
    <Actionsheet
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      accessibilityLabel="tokens list"
    >
      <Actionsheet.Content>
        <Box w="100%" h={60} px={4} justifyContent="center">
          <Text
            fontSize="12"
            fontWeight={"semibold"}
            color="gray.500"
            textTransform={"uppercase"}
            _dark={{
              color: "gray.300",
            }}
          >
            Tokens
          </Text>
        </Box>
        {tokens.map(({ balance, tokenCode }) => {
          return (
            <Actionsheet.Item
              key={tokenCode}
              startIcon={
                <Pressable
                  onPress={handleTokenDetailsPress}
                  accessibilityLabel="see token details"
                  alignSelf="center"
                >
                  <Icon
                    as={Feather}
                    name="info"
                    size="6"
                    color={
                      tokenCode === selectedToken?.tokenCode
                        ? "light.100"
                        : "gray.500"
                    }
                  />
                </Pressable>
              }
              accessibilityLabel="token"
              onPress={() => handleTokenPress(tokenCode)}
              background={
                tokenCode === selectedToken?.tokenCode
                  ? "primary.500"
                  : "gray.50"
              }
              borderRadius="md"
            >
              <HStack justifyContent="space-between" w="81%">
                <Text
                  accessibilityLabel="token code"
                  color={
                    tokenCode === selectedToken?.tokenCode
                      ? "light.100"
                      : "gray.500"
                  }
                >
                  {tokenCode}
                </Text>
                <Text
                  accessibilityLabel="token balance"
                  color={
                    tokenCode === selectedToken?.tokenCode
                      ? "light.100"
                      : "gray.500"
                  }
                >
                  {displayFiatAmount(balance)}
                </Text>
              </HStack>
            </Actionsheet.Item>
          );
        })}
      </Actionsheet.Content>
    </Actionsheet>
  );

  function handleTokenPress(code: string) {
    setSelectedToken(tokens?.find((sc) => sc.tokenCode === code));
    onClose();
  }
}

export default TokensSelection;
