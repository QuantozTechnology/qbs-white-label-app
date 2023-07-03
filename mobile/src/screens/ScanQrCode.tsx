// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BarCodeEvent, BarCodeScanner } from "expo-barcode-scanner";
import { Button, Icon, Spinner, Text, Toast, View, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Linking, StyleSheet } from "react-native";
import { CreatePaymentRequestPayload } from "../api/paymentrequest/paymentRequest.interface";
import FullScreenLoadingSpinner from "../components/FullScreenLoadingSpinner";
import Notification from "../components/Notification";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import { useIsFocused } from "@react-navigation/native";

export interface PaymentRequestPayload extends CreatePaymentRequestPayload {
  canChangeAmount: boolean;
}

type PortfolioProps = NativeStackScreenProps<
  PortfolioStackParamList,
  "ScanQrCode"
>;

function ScanQrCode({ navigation }: PortfolioProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function getBarCodeScannerPermissions() {
      const { status } = await BarCodeScanner.requestPermissionsAsync();

      setHasPermission(status === "granted");
    }

    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
    }
  }, [isFocused]);

  const handleBarCodeScanned = ({ data }: BarCodeEvent) => {
    setScanned(true);

    const { type, code } = JSON.parse(data);

    if (type === "offer") {
      navigation.navigate("OffersStack", {
        screen: "ReviewScannedOffer",
        params: { code },
      });
    } else if (type === "payment-request") {
      navigation.navigate("SendStack", {
        screen: "SendSummary",
        params: { code },
      });
    } else {
      // Throw an error or return an error message if the data does not match either type
      // throw new Error("Invalid transaction type");
      Toast.show({
        render: () => (
          <Notification variant="error" message="QR code not valid" />
        ),
        duration: 3000,
      });
    }
  };

  if (hasPermission === null) {
    return (
      <VStack
        p={4}
        h="full"
        justifyContent="center"
        alignItems="center"
        space={4}
        accessibilityLabel="request camera permissions"
      >
        <Spinner size="lg" />
        <Text>Requesting for camera permission</Text>
      </VStack>
    );
  }

  if (hasPermission === false) {
    return (
      <VStack
        p={4}
        h="full"
        justifyContent="center"
        alignItems="center"
        space={4}
        accessibilityLabel="no permissions"
      >
        <Icon as={Ionicons} name="warning" size="4xl" />
        <Text>No access to camera</Text>
        <Button onPress={() => Linking.openSettings()}>Open settings</Button>
      </VStack>
    );
  }

  if (scanned) {
    return <FullScreenLoadingSpinner />;
  }

  return (
    <View
      flex={1}
      alignItems="center"
      justifyContent="center"
      bgColor="black"
      accessibilityLabel="ok camera permissions"
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

export default ScanQrCode;
