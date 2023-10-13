// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Icon, Pressable } from "native-base";
import * as Linking from "expo-linking";
import { useToken } from "../api/tokens/tokens";
import DataDisplayField from "../components/DataDisplayField";
import DataDisplayFieldSkeleton from "../components/DataDisplayFieldSkeleton";
import FullScreenMessage from "../components/FullScreenMessage";
import ScreenWrapper from "../components/ScreenWrapper";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";

type Props = NativeStackScreenProps<PortfolioStackParamList, "TokenDetails">;

function TokenDetails({ route }: Props) {
  const { tokenCode } = route.params;
  const { data, status } = useToken({ tokenCode });

  if (status === "error") {
    return <FullScreenMessage message="Error loading the token details" />;
  }

  if (status === "loading") {
    return (
      <ScreenWrapper space={1} flex={1} px={-4}>
        <DataDisplayFieldSkeleton />
        <DataDisplayFieldSkeleton />
        <DataDisplayFieldSkeleton />
        <DataDisplayFieldSkeleton />
      </ScreenWrapper>
    );
  }

  const { assetUrl, validatorUrl, issuerUrl, schemaUrl } = data.value;

  function handleUrlPress(url: string) {
    Linking.openURL(url);
  }

  return (
    <ScreenWrapper flex={1} px={-4}>
      <DataDisplayField
        accessibilityLabel="asset info"
        label="Asset info"
        value={assetUrl}
        action={
          <Pressable
            accessibilityLabel="go to asset info page"
            onPress={() => handleUrlPress(assetUrl)}
            mr={4}
          >
            <Icon
              as={Feather}
              name="external-link"
              color="primary.500"
              size="md"
            />
          </Pressable>
        }
      />
      <DataDisplayField
        accessibilityLabel="issuer"
        label="Issuer"
        value={issuerUrl}
        action={
          <Pressable
            accessibilityLabel="go to issuer page"
            onPress={() => handleUrlPress(issuerUrl)}
            mr={4}
          >
            <Icon
              as={Feather}
              name="external-link"
              color="primary.500"
              size="md"
            />
          </Pressable>
        }
      />
      <DataDisplayField
        accessibilityLabel="validator"
        label="Validator"
        value={validatorUrl}
        action={
          <Pressable
            accessibilityLabel="go to validator page"
            onPress={() => handleUrlPress(validatorUrl)}
            mr={4}
          >
            <Icon
              as={Feather}
              name="external-link"
              color="primary.500"
              size="md"
            />
          </Pressable>
        }
      />
      <DataDisplayField
        accessibilityLabel="schema"
        label="Schema"
        value={schemaUrl}
        action={
          <Pressable
            accessibilityLabel="go to schema page"
            onPress={() => handleUrlPress(schemaUrl)}
            mr={4}
          >
            <Icon
              as={Feather}
              name="external-link"
              color="primary.500"
              size="md"
            />
          </Pressable>
        }
      />
    </ScreenWrapper>
  );
}

export default TokenDetails;
