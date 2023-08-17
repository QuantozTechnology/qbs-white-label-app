// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Icon, IconButton, Toast } from "native-base";
import * as Linking from "expo-linking";
import { useTokenDetails } from "../api/tokens/tokens";
import DataDisplayFieldSkeleton from "../components/DataDisplayFieldSkeleton";
import FullScreenMessage from "../components/FullScreenMessage";
import GenericListItem from "../components/GenericListItem";
import ScreenWrapper from "../components/ScreenWrapper";
import { OffersStackParamList } from "../navigation/OffersStack";
import Notification from "../components/Notification";
import { ImageIdentifier } from "../utils/images";

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

  if (noDetailsToShow()) {
    return (
      <ScreenWrapper flex={1} bg="white">
        <FullScreenMessage
          message="No details available for this asset"
          icon={null}
          illustration={ImageIdentifier.Find}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper flex={1} space={2}>
      {details.value.data?.AssetUrl && (
        <GenericListItem
          accessibilityLabel="asset info"
          leftContent="Asset info"
          rightContent={
            <IconButton
              accessibilityLabel="go to asset info website"
              icon={<Icon as={Feather} name="external-link" />}
              onPress={() => handleGoToUrl(details.value.data?.AssetUrl)}
            />
          }
        />
      )}
      {details.value.data?.OwnerUrl && (
        <GenericListItem
          accessibilityLabel="issuer info"
          leftContent="Issuer"
          rightContent={
            <IconButton
              accessibilityLabel="go to issuer info website"
              icon={<Icon as={Feather} name="external-link" />}
              onPress={() => handleGoToUrl(details.value.data?.OwnerUrl)}
            />
          }
        />
      )}
      {details.value.data?.ValidatorUrl && (
        <GenericListItem
          accessibilityLabel="validator info"
          leftContent="Validator"
          rightContent={
            <IconButton
              accessibilityLabel="go to validator info website"
              icon={<Icon as={Feather} name="external-link" />}
              onPress={() => handleGoToUrl(details.value.data?.ValidatorUrl)}
            />
          }
        />
      )}
      {details.value.taxonomy?.assetUrl && (
        <GenericListItem
          accessibilityLabel="schema info"
          leftContent="Schema"
          rightContent={
            <IconButton
              accessibilityLabel="go to schema info website"
              icon={<Icon as={Feather} name="external-link" />}
              onPress={() => handleGoToUrl(details.value.taxonomy?.assetUrl)}
            />
          }
        />
      )}
    </ScreenWrapper>
  );

  function handleGoToUrl(url: string | null | undefined) {
    if (!url) return;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    // Validate URL format using URL constructor
    try {
      new URL(url);
      Linking.openURL(url);
    } catch (_) {
      Toast.show({
        render: () => (
          <Notification message="Invalid url format" variant="error" />
        ),
        id: "tx-api-error",
      });
    }
  }

  function noDetailsToShow() {
    return !(
      details?.value.data?.AssetUrl ||
      details?.value.data?.ValidatorUrl ||
      details?.value.data?.OwnerUrl ||
      details?.value.taxonomy?.assetUrl
    );
  }
}

export default TokenDetails;
