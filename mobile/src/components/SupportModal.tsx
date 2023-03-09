// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Button, Center, Modal, Text, Toast } from "native-base";
import { useEffect, useState } from "react";
import { defaultConfig } from "../config/config";
import { composeEmail } from "../utils/email";
import * as Clipboard from "expo-clipboard";
import Notification from "./Notification";
import { useCustomer } from "../api/customer/customer";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SupportModal({ open, setOpen }: Props) {
  const [composingEmailError, setComposingEmailError] = useState(false);

  const { data: customerData } = useCustomer();

  useEffect(() => {
    async function copyEmailAddressToClipboard() {
      await Clipboard.setStringAsync(defaultConfig.supportEmail);
    }

    if (composingEmailError) {
      copyEmailAddressToClipboard();

      Toast.show({
        render: () => (
          <Notification
            title="Cannot open email client"
            message={`Please send as an email at ${defaultConfig.supportEmail}. This email address has been copied for you`}
            variant="error"
          />
        ),
      });
    }
  }, [composingEmailError]);
  async function handleContactSupport() {
    const emailRecipient = defaultConfig.supportEmail;
    const emailSubject = "Request to upgrade account tier";
    // TODO maybe add info needed here as template?
    const emailBody = `I would like to start the process to upgrade the tier for my Quantoz Payments account.
    
    Account info:
      - email: ${
        customerData?.data.value.email ??
        " -> fill in the email you used to sign up"
      }`;

    await composeEmail({
      recipients: [emailRecipient],
      subject: emailSubject,
      body: emailBody,
      onEmailSendError: () => {
        setComposingEmailError(true);
      },
    });
  }

  return (
    <Center>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Contact Us</Modal.Header>
          <Modal.Body>
            <Text>
              To upgrade the tier for your business account, get in touch with
              our support team
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setOpen(false);
                }}
              >
                Close
              </Button>
              <Button onPress={handleContactSupport}>Contact support</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
}

export default SupportModal;
