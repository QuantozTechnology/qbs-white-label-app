// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Actionsheet, HStack, useDisclose } from "native-base";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import ActionButton from "./ActionButton";

function ActionButtonsBar() {
  const { isOpen, onOpen, onClose } = useDisclose();
  const navigation = useNavigation<NavigationProp<PortfolioStackParamList>>();

  return (
    <>
      <HStack
        justifyContent="space-around"
        pt={2}
        accessibilityLabel="action buttons"
      >
        <ActionButton
          iconName="qrcode"
          label="Scan"
          onPressCallback={() => navigation.navigate("ScanQrCode")}
        />
        <ActionButton
          iconName="plus"
          label="Buy"
          onPressCallback={() =>
            navigation.navigate("OffersStack", {
              screen: "CreateOfferTabStack",
              params: {
                screen: "CreateBuyOfferStack",
                params: {
                  screen: "CreateBuyOffer",
                },
              },
            })
          }
        />
        <ActionButton
          iconName="minus"
          label="Sell"
          onPressCallback={() =>
            navigation.navigate("OffersStack", {
              screen: "CreateOfferTabStack",
              params: {
                screen: "CreateSellOfferStack",
                params: {
                  screen: "CreateSellOffer",
                },
              },
            })
          }
        />
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
          iconName="ellipsis-v"
          label="More"
          onPressCallback={onOpen}
        />
      </HStack>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              onClose();
              navigation
                .getParent<NavigationProp<PortfolioStackParamList>>()
                .navigate("Funding");
            }}
          >
            Fund
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              onClose();
              navigation
                .getParent<NavigationProp<PortfolioStackParamList>>()
                .navigate("Withdraw");
            }}
          >
            Withdraw
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

export default ActionButtonsBar;
