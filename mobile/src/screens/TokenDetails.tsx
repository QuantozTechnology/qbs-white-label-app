import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Icon, Pressable } from "native-base";
import { Linking } from "react-native";
import { useTokenDetails } from "../api/tokens/tokens";
import DataDisplayField from "../components/DataDisplayField";
import DataDisplayFieldSkeleton from "../components/DataDisplayFieldSkeleton";
import FullScreenMessage from "../components/FullScreenMessage";
import ScreenWrapper from "../components/ScreenWrapper";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";

type Props = NativeStackScreenProps<PortfolioStackParamList, "TokenDetails">;

function TokenDetails({ route }: Props) {
  const { tokenCode } = route.params;
  const { data, status } = useTokenDetails({ tokenCode });

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

  const { assetUrl, validatorUrl, ownerUrl, schemaUrl } = data.value;

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
        value={ownerUrl}
        action={
          <Pressable
            accessibilityLabel="go to issuer page"
            onPress={() => handleUrlPress(ownerUrl)}
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
