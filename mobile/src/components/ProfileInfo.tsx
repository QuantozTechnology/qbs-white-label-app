// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Feather } from "@expo/vector-icons";
import { Icon, IconButton, Toast, VStack } from "native-base";

import { ConsumerData, MerchantData } from "../api/customer/customer.interface";
import { useAuth } from "../auth/AuthContext";
import { formatDate } from "../utils/dates";
import DataDisplayField from "./DataDisplayField";
import Notification from "./Notification";

type Props<T> = {
  email: string;
  userData: T;
};

function ProfileInfo<T extends ConsumerData | MerchantData>({
  email,
  userData,
}: Props<T>) {
  const auth = useAuth();

  async function handleChangePassword() {
    try {
      await auth?.changePassword();

      if (auth?.error && auth.error === null) {
        Toast.show({
          render: () => (
            <Notification message="Password changed" variant="success" />
          ),
        });
      }
    } catch (error) {
      Toast.show({
        render: () => (
          <Notification
            title="Could not change password"
            message={error as string}
            variant="error"
          />
        ),
      });
    }
  }
  // customer is consumer
  if ("FirstName" in userData) {
    const { FirstName, LastName, CountryOfResidence, DateOfBirth, Phone } =
      userData;

    return (
      <VStack accessibilityLabel="user profile info">
        <DataDisplayField
          label="Full name"
          value={`${FirstName} ${LastName}`}
          accessibilityLabel="full name"
        />
        <DataDisplayField
          label="Email"
          value={email}
          accessibilityLabel="email"
        />
        <DataDisplayField
          label="Phone"
          value={Phone}
          accessibilityLabel="phone number"
        />
        <DataDisplayField
          label="Country of residence"
          value={CountryOfResidence}
          accessibilityLabel="country of residence"
        />
        <DataDisplayField
          label="Date of birth"
          value={formatDate(DateOfBirth)}
          accessibilityLabel="date of birth"
        />
        <DataDisplayField
          label="Password"
          value="********"
          accessibilityLabel="password"
          action={
            <IconButton
              icon={<Icon as={Feather} name="edit" />}
              _icon={{ color: "primary.500" }}
              onPress={handleChangePassword}
              mr={2}
            />
          }
        />
      </VStack>
    );
  }

  // customer is merchant
  const { CompanyName, ContactPersonFullName, CountryOfRegistration } =
    userData;

  return (
    <VStack accessibilityLabel="user profile info">
      <DataDisplayField label="Company name" value={CompanyName} />
      <DataDisplayField label="Contact person" value={ContactPersonFullName} />
      <DataDisplayField label="Email" value={email} />
      <DataDisplayField
        label="Country of registration"
        value={CountryOfRegistration}
      />
      <DataDisplayField
        label="Password"
        value="********"
        accessibilityLabel="password"
        action={
          <IconButton
            icon={<Icon as={Feather} name="edit" />}
            _icon={{ color: "primary.500" }}
            onPress={handleChangePassword}
            mr={2}
          />
        }
      />
    </VStack>
  );
}

export default ProfileInfo;
