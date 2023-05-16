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
import { CreateOfferTabsParamList } from "../navigation/CreateOfferTabsStack";
import { OfferOverviewStackParamList } from "../navigation/OfferOverviewStack";
import { displayFiatAmount } from "../utils/currencies";

type AssetListItemProps = {
  asset: Tokens;
};

function AssetListItem({ asset }: AssetListItemProps) {
  const navigation =
    useNavigation<NavigationProp<OfferOverviewStackParamList>>();

  const route =
    useRoute<RouteProp<CreateOfferTabsParamList, "CreateBuyOffer">>();
  const { code, name, balance } = asset;

  return (
    <Pressable onPress={handleAssetListItemPress}>
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
            onPress={handleAssetDetailsPress}
          />
          <Text>{name}</Text>
        </HStack>
        {balance !== null && (
          <Text>{displayFiatAmount(parseFloat(balance))}</Text>
        )}
      </HStack>
    </Pressable>
  );

  function handleAssetDetailsPress() {
    navigation.navigate("AssetDetails", { tokenCode: code });
  }

  function handleAssetListItemPress() {
    navigation.navigate("CreateOfferTabStack", {
      screen: route.params.sourceScreen,
      params: { token: asset },
    });
  }
}

export default AssetListItem;
