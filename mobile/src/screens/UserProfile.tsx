// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import {
  Button,
  Icon,
  IconButton,
  ScrollView,
  Toast,
  VStack,
} from "native-base";
import { useCustomer } from "../api/customer/customer";
import { ConsumerData, MerchantData } from "../api/customer/customer.interface";
import AllCapsSectionHeading from "../components/AllCapsSectionHeading";
import FullScreenMessage from "../components/FullScreenMessage";
import ProfileInfo from "../components/ProfileInfo";
import DataDisplayFieldSkeleton from "../components/DataDisplayFieldSkeleton";
import ScreenWrapper from "../components/ScreenWrapper";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { paymentsApi } from "../utils/axios";
import { useAuth } from "../auth/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserProfileStackParamList } from "../navigation/UserProfileStack";
import DataDisplayField from "../components/DataDisplayField";
import { useAccount } from "../api/account/account";
import { useCustomerState } from "../context/CustomerContext";
import * as Clipboard from "expo-clipboard";
import Notification from "../components/Notification";

type Props = NativeStackScreenProps<UserProfileStackParamList, "UserProfile">;

function UserProfile({ navigation }: Props) {
  const auth = useAuth();
  const customerContext = useCustomerState();
  const queryClient = useQueryClient();

  const { data: account, status: accountStatus } = useAccount();
  const { status: customerStatus, data: customer } = useCustomer();

  if (customerStatus === "error" || accountStatus === "error") {
    return (
      <VStack space={2}>
        <FullScreenMessage
          title="Error"
          message="Could not get your details, try again later"
        />
      </VStack>
    );
  }

  if (customerStatus === "loading" || accountStatus === "loading") {
    return (
      <VStack py={4} space={8}>
        <VStack space={1}>
          <AllCapsSectionHeading text="Personal info" px={4} />
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
          <DataDisplayFieldSkeleton />
        </VStack>
      </VStack>
    );
  }

  const { bankAccountNumber, isBusiness, data, email } = customer.data.value;
  const { accountCode } = account.data.value;

  return (
    <ScreenWrapper p={-4}>
      <ScrollView>
        {bankAccountNumber && (
          <DataDisplayField
            label="Bank account number"
            value={bankAccountNumber}
            accessibilityLabel="bank account"
          />
        )}
        <VStack>
          <AllCapsSectionHeading text="Personal info" pl={4} />
          <DataDisplayField
            label="Account code"
            value={accountCode}
            accessibilityLabel="account code"
            action={
              <IconButton
                accessibilityLabel="copy account code"
                icon={<Icon as={Ionicons} name="copy-outline" />}
                _icon={{ color: "primary.500" }}
                onPress={copyAccountCode}
                mr={2}
              />
            }
          />
          <ProfileInfo<
            typeof isBusiness extends boolean ? MerchantData : ConsumerData
          >
            email={email}
            userData={data}
          />
          <VStack space={3} p={4}>
            <Button
              onPress={handleUpgradeAccountPress}
              accessibilityLabel="upgrade account"
            >
              Upgrade account
            </Button>
            <Button
              variant="outline"
              startIcon={<Icon as={FontAwesome5} name="sign-out-alt" />}
              onPress={handleLogout}
              accessibilityLabel="sign out"
            >
              Sign out
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );

  function handleUpgradeAccountPress() {
    navigation.navigate("UpgradeAccountStack");
  }

  async function handleLogout() {
    await auth?.logout();
    customerContext?.refresh();

    // reset bearer
    paymentsApi.defaults.headers.common["Authorization"] = undefined;
    queryClient.clear();
  }

  async function copyAccountCode() {
    await Clipboard.setStringAsync(accountCode);

    Toast.show({
      render: () => (
        <Notification
          message="Account code copied"
          variant="info"
          isToastNotification
        />
      ),
    });
  }
}

export default UserProfile;
