// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import * as MailComposer from "expo-mail-composer";
import { MailComposerStatus } from "expo-mail-composer";
import { Linking } from "react-native";
import { waitFor } from "../../jest/test-utils";
import { ISendEmail, composeEmail } from "../email";

describe("email utils", () => {
  const canComposeEmailMock = jest
    .spyOn(MailComposer, "isAvailableAsync")
    .mockResolvedValue(true);
  const composeEmailMock = jest
    .spyOn(MailComposer, "composeAsync")
    .mockResolvedValue({ status: MailComposerStatus.SENT });

  const testEmailOptions: ISendEmail = {
    recipients: ["test@test.test"],
    onEmailSendError: jest.fn(() => "error"),
    body: "Test body for email",
    subject: "Email subject",
  };

  it("opens email client with specified recipient, subject and body", async () => {
    await composeEmail(testEmailOptions);

    expect(canComposeEmailMock).toHaveBeenCalled();
    expect(canComposeEmailMock).toBeTruthy();
    expect(composeEmailMock).toHaveBeenCalledWith({
      subject: testEmailOptions.subject,
      recipients: testEmailOptions.recipients,
      body: testEmailOptions.body,
    });
  });

  it("cannot open the email client, showing error to the user and NOTICE the email in the clipboard", async () => {
    const composeEmailMock = jest
      .spyOn(MailComposer, "composeAsync")
      .mockRejectedValue(new Error());

    await composeEmail(testEmailOptions);

    expect(canComposeEmailMock).toHaveBeenCalled();
    expect(composeEmailMock).toHaveBeenCalled();
    expect(testEmailOptions.onEmailSendError).toHaveBeenCalled();
  });

  it("cannot compose email (not available on device), returns error", async () => {
    const canComposeEmailMock = jest
      .spyOn(MailComposer, "isAvailableAsync")
      .mockRejectedValue(new Error());

    expect(canComposeEmailMock).toHaveBeenCalled();
    expect(testEmailOptions.onEmailSendError).toHaveBeenCalled();
  });

  it("cannot use expo-mail-composer, defaults to Linking API from react-native", async () => {
    const canComposeEmailMock = jest
      .spyOn(MailComposer, "isAvailableAsync")
      .mockResolvedValue(false);

    const linkingMock = jest.fn();
    Linking.openURL = linkingMock;

    await composeEmail(testEmailOptions);

    await waitFor(() => expect(canComposeEmailMock).toHaveBeenCalled());
    expect(linkingMock).toHaveBeenCalled();
  });
});
