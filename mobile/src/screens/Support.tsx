// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Button, Text, VStack } from "native-base";
import { useCustomer } from "../api/customer/customer";
import { defaultConfig } from "../config/config";
import { composeEmail } from "../utils/email";

function Support() {
  const { data } = useCustomer();
  async function handleSupportPress() {
    const emailRecipient = defaultConfig.supportEmail;
    const emailSubject = "Support request - Quantoz Blockchain Solutions";
    const emailBody = `Please provide a detailed description of the issue you are experiencing. Be sure to leave the information below as it is.
        
        ---------------------
        My account email: ${data?.data.value.email ?? "not available"}`;

    await composeEmail({
      recipients: [emailRecipient],
      subject: emailSubject,
      body: emailBody,
    });
  }

  return (
    <VStack p={4} space={2}>
      <Text>
        Your email app should have opened automatically. If not, press the
        button below.
      </Text>
      <Button onPress={handleSupportPress}>Request support</Button>
    </VStack>
  );
}

export default Support;
