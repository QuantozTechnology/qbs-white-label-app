// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { HStack, VStack, Heading, Icon, Text, View, Box } from "native-base";
import { ReactElement } from "react";
import { defaultConfig } from "../config/config";
import { displayFiatAmount } from "../utils/currencies";

export enum ITierStatus {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
  Disabled = "disabled",
}

type ITierOverview = {
  heading: string;
  isCurrent: boolean;
  fundingLimit: number;
  withdrawLimit: number;
  tierStatus: ITierStatus;
  description?: string[];
  tierUpgradeActions?: ReactElement;
};

function TierOverview({
  tierStatus,
  isCurrent,
  description,
  fundingLimit,
  heading,
  withdrawLimit,
  tierUpgradeActions,
}: ITierOverview) {
  return (
    <VStack space={3} pb={4} accessibilityLabel="tier">
      <HStack>
        <VStack pr={3} alignItems="center">
          <Box
            bg={tierStatus === ITierStatus.Active ? "primary.500" : "white"}
            rounded="full"
          >
            <Icon
              as={Ionicons}
              name={
                tierStatus === ITierStatus.Active
                  ? "checkmark"
                  : "lock-closed-outline"
              }
              color={
                tierStatus === ITierStatus.Active ? "white" : "primary.500"
              }
              size="sm"
              m={3}
              accessibilityLabel={`${
                tierStatus === ITierStatus.Active ? "active" : "not active"
              } tier icon`}
            />
          </Box>
          <View
            flex={1}
            width={1}
            bg={tierStatus === ITierStatus.Active ? "primary.500" : "white"}
            roundedBottom="md"
          />
        </VStack>
        <VStack space={3}>
          <HStack space={3} alignItems="center">
            <Heading
              size="md"
              fontWeight="bold"
              pt={2}
              accessibilityLabel="tier heading"
            >
              {heading}
            </Heading>
            {isCurrent && (
              <Text
                p={1}
                bg="white"
                rounded="sm"
                textTransform="uppercase"
                fontSize="xs"
                color="primary.500"
                accessibilityLabel="current tier"
              >
                Current
              </Text>
            )}
          </HStack>
          <VStack space={1}>
            <Text fontSize="md" accessibilityLabel="tier funding limits">
              Funding:{" "}
              {displayFiatAmount(fundingLimit, {
                currency: defaultConfig.defaultFiatCurrency,
              })}
            </Text>
            <Text fontSize="md" accessibilityLabel="tier withdraw limits">
              Withdraw:{" "}
              {displayFiatAmount(withdrawLimit, {
                currency: defaultConfig.defaultFiatCurrency,
              })}
            </Text>
          </VStack>
          {description &&
            description.map((d) => (
              <VStack key={d}>
                <HStack
                  space={1}
                  alignItems="center"
                  accessibilityLabel="description item"
                >
                  <Icon
                    as={Ionicons}
                    name={
                      tierStatus === ITierStatus.Active
                        ? "checkmark"
                        : "lock-closed-outline"
                    }
                    color="primary.500"
                    accessibilityLabel={`${
                      tierStatus === ITierStatus.Active
                        ? "active"
                        : "not active"
                    } tier description icon`}
                  />
                  <Text
                    textTransform="capitalize"
                    color="gray.500"
                    accessibilityLabel="description item text"
                  >
                    {d}
                  </Text>
                </HStack>
              </VStack>
            ))}
        </VStack>
      </HStack>
      {tierUpgradeActions &&
        (tierStatus === ITierStatus.Inactive ||
          tierStatus === ITierStatus.Pending) && (
          <Box accessibilityLabel="tier upgrade actions">
            {tierUpgradeActions}
          </Box>
        )}
    </VStack>
  );
}

export default TierOverview;
