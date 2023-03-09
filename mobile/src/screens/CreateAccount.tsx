// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Heading, Image, Spinner, Text, Toast, VStack } from "native-base";
import { useEffect } from "react";
import { createAccount } from "../api/account/account";
import { APIError } from "../api/generic/error.interface";
import Notification from "../components/Notification";
import { useCustomerState } from "../context/CustomerContext";
import { WelcomeStackParamList } from "../navigation/WelcomeStack";
import { formatError } from "../utils/errors";
import { ImageIdentifier, imagesCollection } from "../utils/images";

type Props = NativeStackScreenProps<WelcomeStackParamList, "CreateAccount">;

function CreateAccount({ navigation }: Props) {
  const customerContext = useCustomerState();

  useEffect(() => {
    createNewAccount();
  }, []);

  const { mutate: createNewAccount, isSuccess: accountCreated } = useMutation({
    mutationFn: createAccount,
    onSuccess() {
      customerContext?.refresh();
    },
    onError(error: AxiosError<APIError>) {
      Toast.show({
        render: () => (
          <Notification message={formatError(error)} variant="error" />
        ),
      });
    },
  });

  if (accountCreated) {
    navigation.navigate("Feedback", {
      title: "Account created!",
      description:
        "We will contact you to ask for more information to complete the business registration. You will not be able to access the app, expect an email from ur support team.",
      variant: "success",
      button: {
        caption: "Done",
        callback: () => customerContext?.refresh(),
      },
    });
  }

  return (
    <VStack flex={1} bg="white" justifyContent="center" alignItems="center">
      <Spinner size="lg" />
      <Heading fontWeight="bold" size="2xl" letterSpacing="md" pb={2}>
        Creating account...
      </Heading>
      <Text maxW="90%" lineHeight="md" fontSize="lg" textAlign="center">
        It could take some time, please wait
      </Text>
      <Image
        // any needed to cast from string of enum to type requested from source
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        source={imagesCollection[ImageIdentifier.Loading] as any}
        alt="illustration"
      />
    </VStack>
  );
}

export default CreateAccount;
