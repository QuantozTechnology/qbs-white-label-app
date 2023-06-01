// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Icon, IconButton } from "native-base";
import { Linking } from "react-native";
import { useTokenDetails } from "../api/tokens/tokens";
import DataDisplayFieldSkeleton from "../components/DataDisplayFieldSkeleton";
import FullScreenMessage from "../components/FullScreenMessage";
import GenericListItem from "../components/GenericListItem";
import ScreenWrapper from "../components/ScreenWrapper";
import { OffersStackParamList } from "../navigation/OffersStack";

type TokenDetailsProps = NativeStackScreenProps<
  OffersStackParamList,
  "TokenDetails"
>;

function TokenDetails({ route }: TokenDetailsProps) {
  const { tokenCode } = route.params;
  const { data: details, status } = useTokenDetails({ tokenCode });

  if (status === "error") {
    return <FullScreenMessage message="Cannot retrieve token details" />;
  }

  if (status === "loading") {
    return (
      <ScreenWrapper flex={1} space={2}>
        <DataDisplayFieldSkeleton />
        <DataDisplayFieldSkeleton />
        <DataDisplayFieldSkeleton />
        <DataDisplayFieldSkeleton />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper flex={1} space={2}>
      <GenericListItem
        accessibilityLabel="asset info"
        leftContent="Asset info"
        rightContent={
          <IconButton
            accessibilityLabel="go to asset info website"
            icon={<Icon as={Feather} name="external-link" />}
            onPress={() => handleGoToUrl(details.value.assetUrl)}
          />
        }
      />
      <GenericListItem
        accessibilityLabel="issuer info"
        leftContent="Issuer"
        rightContent={
          <IconButton
            accessibilityLabel="go to issuer info website"
            icon={<Icon as={Feather} name="external-link" />}
            onPress={() => handleGoToUrl(details.value.issuerUrl)}
          />
        }
      />
      <GenericListItem
        accessibilityLabel="validator info"
        leftContent="Validator"
        rightContent={
          <IconButton
            accessibilityLabel="go to validator info website"
            icon={<Icon as={Feather} name="external-link" />}
            onPress={() => handleGoToUrl(details.value.validatorUrl)}
          />
        }
      />
      <GenericListItem
        accessibilityLabel="schema info"
        leftContent="Schema"
        rightContent={
          <IconButton
            accessibilityLabel="go to schema info website"
            icon={<Icon as={Feather} name="external-link" />}
            onPress={() => handleGoToUrl(details.value.schemaUrl)}
          />
        }
      />
    </ScreenWrapper>
  );

  function handleGoToUrl(url: string) {
    Linking.openURL(url);
  }
}

export default TokenDetails;
