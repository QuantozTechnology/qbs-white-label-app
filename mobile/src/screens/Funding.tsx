// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import {
  Button,
  Icon,
  IconButton,
  IIconButtonProps,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  useDisclose,
  useToast,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { useBalances } from "../api/balances/balances";
import CustomerLimitsProgress from "../components/CustomerLimitsProgress";
import * as Clipboard from "expo-clipboard";
import Notification from "../components/Notification";
import { useCustomerLimits } from "../api/limits/limits";
import FullScreenMessage from "../components/FullScreenMessage";
import CustomerLimitsProgressSkeleton from "../components/CustomerLimitsProgressSkeleton";
import { defaultConfig } from "../config/config";
import ScreenWrapper from "../components/ScreenWrapper";
import DataDisplayField from "../components/DataDisplayField";
import { Ionicons } from "@expo/vector-icons";
import DataDisplayFieldSkeleton from "../components/DataDisplayFieldSkeleton";
import BalancesList from "../components/BalancesList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import { Balances } from "../api/balances/balances.interface";
import TokensSelection from "../components/TokensSelection";
import CustomerLimitsProgressError from "../components/CustomerLimitsProgressError";
import { useAccount } from "../api/account/account";
import { NavigationProp } from "@react-navigation/native";
import { UserProfileStackParamList } from "../navigation/UserProfileStack";
import { getPlatformOS } from "../utils/reactNative";

interface ICopyButton extends IIconButtonProps {
  callback: () => Promise<void>;
}

function CopyButton({ callback, ...otherProps }: ICopyButton) {
  return (
    <IconButton
      icon={<Icon as={Ionicons} name="copy-outline" />}
      onPress={() => callback()}
      accessibilityLabel="copy contents"
      mr={2}
      {...otherProps}
    />
  );
}

type FundingProps = NativeStackScreenProps<PortfolioStackParamList, "Funding">;

function Funding({ navigation }: FundingProps) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclose();

  const { data: accounts, status: accountsStatus } = useAccount();
  const {
    isLoading: isLoadingBalances,
    isSuccess: isSuccessBalances,
    error: balancesError,
    data: balances,
  } = useBalances();
  const {
    isLoading: isLoadingLimits,
    isSuccess: isSuccessLimits,
    error: limitsError,
    data: limits,
  } = useCustomerLimits();

  const [selectedToken, setSelectedToken] = useState<Balances>();

  useEffect(() => {
    if (
      balances != null &&
      balances.value.length === 1 &&
      selectedToken == null
    ) {
      setSelectedToken(balances.value[0]);
    }
  }, [balances]);

  const handleCopy = async (value: string) => {
    await Clipboard.setStringAsync(value);

    toast.show({
      render: () => (
        <Notification message="Copied to clipboard" variant="info" />
      ),
    });
  };

  if (limitsError || balancesError) {
    return (
      <VStack p={4}>
        <CustomerLimitsProgressError />
        <FullScreenMessage
          message="Please try again later"
          title="Error loading banking details"
          noFullScreen
        />
      </VStack>
    );
  }

  if (
    isLoadingLimits ||
    !isSuccessLimits ||
    isLoadingBalances ||
    !isSuccessBalances ||
    accountsStatus === "loading"
  ) {
    return (
      <VStack>
        <VStack p={4} space={4}>
          <CustomerLimitsProgressSkeleton hideDescriptionLines />
          <BalancesList
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
          />
        </VStack>
        <VStack space={1}>
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
        </VStack>
      </VStack>
    );
  }

  // TODO limits should change based on selected token, in the <BalanceList> component below
  const matchingToken = limits.value.find(
    ({ tokenCode }) => tokenCode === defaultConfig.defaultStableCoin.code
  );
  const hasReachedLimits =
    matchingToken?.funding.used.monthly ===
    matchingToken?.funding.limit.monthly;

  const { beneficiary, bic, iban } = defaultConfig.fundBankingInfo;

  return (
    <ScreenWrapper p={-4} flex={1}>
      <KeyboardAvoidingView
        behavior={getPlatformOS() === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={144}
        flex={1}
      >
        <ScrollView>
          <CustomerLimitsProgress operationType="funding" />
          {hasReachedLimits ? (
            <Notification
              title="Funding limit reached"
              message="Please upgrade your account for free, or wait until the next month."
              variant="error"
              actionButton={
                <Button
                  background="error.500"
                  onPress={() =>
                    navigation
                      .getParent<NavigationProp<UserProfileStackParamList>>()
                      ?.navigate("UpgradeAccountStack")
                  }
                >
                  Upgrade
                </Button>
              }
            />
          ) : (
            <VStack space={0} accessibilityLabel="payment info section">
              <VStack p={4}>
                <Pressable onPress={onOpen}>
                  <BalancesList
                    selectedToken={selectedToken}
                    setSelectedToken={setSelectedToken}
                  />
                </Pressable>
              </VStack>
              <Text p={4} fontSize="md">
                To fund your account, please make a bank transfer to the
                following recipient:
              </Text>
              <DataDisplayField
                label="Beneficiary"
                value={beneficiary}
                action={<CopyButton callback={() => handleCopy(beneficiary)} />}
                accessibilityLabel="beneficiary"
              />
              <DataDisplayField
                label="IBAN"
                value={iban}
                action={<CopyButton callback={() => handleCopy(iban)} />}
                accessibilityLabel="iban"
              />
              <DataDisplayField
                label="BIC"
                value={bic}
                action={<CopyButton callback={() => handleCopy(bic)} />}
                accessibilityLabel="bic"
              />
              {/* TODO input the real account! */}
              <DataDisplayField
                label="Message"
                value={`${selectedToken?.tokenCode}:${accounts?.data.value.accountCode}`}
                action={
                  <CopyButton
                    callback={() =>
                      handleCopy(
                        `${selectedToken?.tokenCode}:${accounts?.data.value.accountCode}`
                      )
                    }
                  />
                }
                accessibilityLabel="message"
              />
            </VStack>
          )}
        </ScrollView>
        <Button m={4} onPress={handleClose}>
          Close
        </Button>
        {balances && (
          <TokensSelection
            isOpen={isOpen}
            onClose={onClose}
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
            tokens={balances.value}
          />
        )}
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );

  function handleClose() {
    navigation.goBack();
  }
}

export default Funding;
