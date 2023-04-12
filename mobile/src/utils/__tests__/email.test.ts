// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import * as MailComposer from "expo-mail-composer";
import { MailComposerStatus } from "expo-mail-composer";
import { linkingOpenUrlMock } from "../../jest/jest.setup";
import { waitFor } from "../../jest/test-utils";
import { composeEmail, SendEmailPayload } from "../email";

describe("email utils", () => {
  let canComposeEmailMock: jest.SpyInstance;
  let composeEmailMock: jest.SpyInstance;
  beforeEach(() => {
    canComposeEmailMock = jest
      .spyOn(MailComposer, "isAvailableAsync")
      .mockResolvedValue(true);
    composeEmailMock = jest
      .spyOn(MailComposer, "composeAsync")
      .mockResolvedValue({ status: MailComposerStatus.SENT });
  });

  const testEmailOptions: SendEmailPayload = {
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
    composeEmailMock = jest
      .spyOn(MailComposer, "composeAsync")
      .mockRejectedValue(new Error());

    await composeEmail(testEmailOptions);

    expect(canComposeEmailMock).toHaveBeenCalled();
    expect(composeEmailMock).toHaveBeenCalled();
    expect(testEmailOptions.onEmailSendError).toHaveBeenCalled();
  });

  it("cannot compose email (not available on device), returns error", async () => {
    canComposeEmailMock = jest
      .spyOn(MailComposer, "isAvailableAsync")
      .mockRejectedValue(new Error());

    await composeEmail(testEmailOptions);

    expect(canComposeEmailMock).toHaveBeenCalled();
    expect(testEmailOptions.onEmailSendError).toHaveBeenCalled();
  });

  it("cannot use expo-mail-composer, defaults to Linking API from react-native", async () => {
    canComposeEmailMock = jest
      .spyOn(MailComposer, "isAvailableAsync")
      .mockResolvedValue(false);

    await composeEmail(testEmailOptions);

    await waitFor(() => expect(canComposeEmailMock).toHaveBeenCalled());
    expect(linkingOpenUrlMock).toHaveBeenCalled();
  });
});
