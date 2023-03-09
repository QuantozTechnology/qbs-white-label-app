// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NavigationProp, useNavigation } from "@react-navigation/native";
import { HStack } from "native-base";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import ActionButton from "./ActionButton";

function ActionButtonsBar() {
  const navigation = useNavigation();
  return (
    <HStack
      justifyContent="space-around"
      pt={2}
      accessibilityLabel="action buttons"
    >
      <ActionButton
        iconName="upload"
        label="Send"
        onPressCallback={() =>
          navigation
            .getParent<NavigationProp<PortfolioStackParamList>>()
            .navigate("SendStack")
        }
      />
      <ActionButton
        iconName="download"
        label="Receive"
        onPressCallback={() =>
          navigation
            .getParent<NavigationProp<PortfolioStackParamList>>()
            .navigate("CreatePaymentRequest")
        }
      />
      <ActionButton
        iconName="plus"
        label="Fund"
        onPressCallback={() =>
          navigation
            .getParent<NavigationProp<PortfolioStackParamList>>()
            .navigate("Funding")
        }
        variant="outline"
      />
      <ActionButton
        iconName="minus"
        label="Withdraw"
        onPressCallback={() =>
          navigation
            .getParent<NavigationProp<PortfolioStackParamList>>()
            .navigate("Withdraw")
        }
        variant="outline"
      />
    </HStack>
  );
}

export default ActionButtonsBar;
