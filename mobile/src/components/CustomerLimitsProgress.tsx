// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import {
  Button,
  HStack,
  Icon,
  IconButton,
  Popover,
  Progress,
  Text,
  VStack,
} from "native-base";
import { useState } from "react";
import { useCustomerLimits } from "../api/limits/limits";
import { defaultConfig } from "../config/config";
import { AppBottomTabParamList } from "../navigation/AppBottomTab";
import { displayFiatAmount } from "../utils/currencies";
import CustomerLimitsProgressError from "./CustomerLimitsProgressError";
import CustomerLimitsProgressSkeleton from "./CustomerLimitsProgressSkeleton";

type ICustomerLimitsProgress = {
  operationType: "funding" | "withdraw";
  hideRemainingAmountMessage?: boolean;
  label?: string;
};

function CustomerLimitsProgress({
  label,
  operationType,
  hideRemainingAmountMessage = false,
}: ICustomerLimitsProgress) {
  const navigation = useNavigation<NavigationProp<AppBottomTabParamList>>();
  const { status, data: limits } = useCustomerLimits();

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  if (status === "error") {
    return <CustomerLimitsProgressError />;
  }

  if (status === "loading") {
    return (
      <CustomerLimitsProgressSkeleton
        hideDescriptionLines={hideRemainingAmountMessage}
      />
    );
  }

  const matchingToken = limits.value.find(
    ({ tokenCode }) => tokenCode === defaultConfig.defaultStableCoin.code
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const used = matchingToken![operationType].used.monthly;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const max = matchingToken![operationType].limit.monthly;
  const isReachingLimits = (parseFloat(used) / parseFloat(max)) * 100;
  const hasReachedLimits = used === max;

  const amountsLeftText =
    operationType === "funding" &&
    !hideRemainingAmountMessage &&
    isReachingLimits ? (
      <Text accessibilityLabel="limits info">
        If you transfer more than{" "}
        <Text bold>
          EUR {displayFiatAmount(parseFloat(max) - parseFloat(used))}
        </Text>
        , the funding will fail.
      </Text>
    ) : null;

  return (
    <VStack
      background="white"
      p={4}
      space={1}
      accessibilityLabel="limits progress for customer"
    >
      {label && (
        <Text fontSize="sm" accessibilityLabel="limits progress label">
          {label}
        </Text>
      )}
      <Progress
        size="md"
        value={(parseFloat(used) / parseFloat(max)) * 100}
        colorScheme={hasReachedLimits ? "error" : "success"}
      />
      <HStack alignItems="center">
        <Popover
          isOpen={isInfoModalOpen}
          onOpen={() => setIsInfoModalOpen(true)}
          onClose={() => setIsInfoModalOpen(false)}
          trigger={(triggerProps) => {
            return (
              <IconButton
                {...triggerProps}
                icon={
                  <Icon
                    as={Ionicons}
                    name="information-circle-outline"
                    size="md"
                    color="primary.500"
                    mr={2}
                  />
                }
                p={1}
                accessibilityLabel="account upgrade info trigger"
              />
            );
          }}
        >
          <Popover.Content accessibilityLabel="limits info modal">
            <Popover.Arrow />
            <Popover.CloseButton />
            <Popover.Header>Account limits</Popover.Header>
            <Popover.Body>
              You can increase these limits by upgrading your account, and
              it&apos;s completely free!
            </Popover.Body>
            <Popover.Footer>
              <Button
                size="sm"
                colorScheme="primary"
                flex={1}
                onPress={handleUpgradePress}
                accessibilityLabel="go to upgrade account screen"
              >
                Upgrade
              </Button>
            </Popover.Footer>
          </Popover.Content>
        </Popover>

        <Text
          fontSize="sm"
          color={hasReachedLimits ? "error.500" : "black"}
          fontWeight={hasReachedLimits ? "black" : "normal"}
          accessibilityLabel="current usage and max limit"
        >
          {`${defaultConfig.defaultFiatCurrency} ${displayFiatAmount(
            parseFloat(used)
          )} / ${displayFiatAmount(parseFloat(max))}`}
        </Text>
      </HStack>

      {hasReachedLimits ? (
        <Text bold color="error.500" accessibilityLabel="limits info">
          You have reached your monthly limits.
        </Text>
      ) : (
        amountsLeftText
      )}
    </VStack>
  );

  function handleUpgradePress() {
    setIsInfoModalOpen(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "UserProfileStack",
            params: {
              screen: "UpgradeAccountStack",
            },
          },
        ],
      })
    );
  }
}

export default CustomerLimitsProgress;
