// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { HStack, Icon, IconButton, Pressable, Text } from "native-base";
import { Tokens } from "../api/tokens/tokens.interface";
import { CreateBuyOfferStackParamList } from "../navigation/CreateBuyOfferStack";
import { OffersStackParamList } from "../navigation/OffersStack";
import { displayFiatAmount } from "../utils/currencies";

type TokenListItemProps = {
  token: Tokens;
};

function TokenListItem({ token }: TokenListItemProps) {
  const navigation = useNavigation<NavigationProp<OffersStackParamList>>();
  const route =
    useRoute<RouteProp<CreateBuyOfferStackParamList, "TokensOverview">>();
  const { code, name, balance } = token;

  return (
    <Pressable
      onPress={handleTokenListItemPress}
      accessibilityLabel="token list item"
    >
      <HStack
        alignItems="center"
        justifyContent="space-between"
        bg="white"
        p={4}
        rounded="md"
        minH="72px"
      >
        <HStack alignItems="center" space={2}>
          <IconButton
            icon={
              <Icon as={Ionicons} name="information-circle-outline" size="md" />
            }
            onPress={handleTokenDetailsPress}
            accessibilityLabel="see token details"
          />
          <Text accessibilityLabel="token name and code">
            {name} ({code})
          </Text>
        </HStack>
        {balance !== null && (
          <Text accessibilityLabel="token balance">
            {displayFiatAmount(parseFloat(balance))}
          </Text>
        )}
      </HStack>
    </Pressable>
  );

  function handleTokenDetailsPress() {
    navigation.navigate("TokenDetails", { tokenCode: code });
  }

  function handleTokenListItemPress() {
    if (route.params.sourceScreen === "CreateBuyOffer") {
      navigation.navigate("CreateOfferTabStack", {
        screen: "CreateBuyOfferStack",
        params: {
          screen: "CreateBuyOffer",
          params: { token: token },
        },
      });
    } else {
      navigation.navigate("CreateOfferTabStack", {
        screen: "CreateSellOfferStack",
        params: {
          screen: "CreateSellOffer",
          params: { token: token },
        },
      });
    }
  }
}

export default TokenListItem;
