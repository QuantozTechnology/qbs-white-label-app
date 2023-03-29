// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import * as MailComposer from "expo-mail-composer";
import { MailComposerOptions } from "expo-mail-composer";
import { Linking } from "react-native";
import { defaultConfig } from "../config/config";
import { z } from "zod";

const ZSendEmail = z.object({
  recipients: z.string().array().default([defaultConfig.supportEmail]),
  subject: z.string().optional(),
  body: z.string().optional(),
  onEmailSendError: z.function().returns(z.void()).optional(),
});

export type SendEmailPayload = z.infer<typeof ZSendEmail>;

export async function composeEmail({
  recipients,
  subject,
  body,
  onEmailSendError,
}: SendEmailPayload) {
  if (
    !ZSendEmail.safeParse({ recipients, subject, body, onEmailSendError })
      .success
  ) {
    console.log("Error");
  }

  try {
    const canComposeEmail = await MailComposer.isAvailableAsync();

    if (canComposeEmail) {
      // Returns true on iOS when the device has a default email setup for sending mail.
      // Always returns true in the browser and on Android.
      const options: MailComposerOptions = {
        recipients: recipients,
      };
      if (subject) {
        options["subject"] = subject;
      }
      if (body) {
        options["body"] = body;
      }

      try {
        await MailComposer.composeAsync(options);
      } catch (error) {
        onEmailSendError && onEmailSendError();
      }
    } else {
      // Can return false on iOS if an MDM profile is setup to block outgoing mail. If this is the case, you may want to use the Linking API instead.
      const emailUrl = new URL(`mailto:${recipients}`);
      if (subject) {
        emailUrl.searchParams.append("subject", subject);
      }
      if (body) {
        emailUrl.searchParams.append("body", body);
      }

      Linking.openURL(emailUrl.href);
    }
  } catch (error) {
    onEmailSendError && onEmailSendError();
  }
}

const ZContactSupportProps = z.object({
  emailData: ZSendEmail,
  userEmail: z.string().email().nullish(),
});

export async function contactSupportViaEmail({
  emailData,
  userEmail,
}: z.infer<typeof ZContactSupportProps>) {
  const { recipients, body, subject, onEmailSendError } = emailData;

  const emailBody = `
      ${body}
      ---------------------
      User email: ${userEmail ?? "not available (please fill it manually)"}`;

  await composeEmail({
    recipients: recipients,
    subject: subject,
    body: emailBody,
    onEmailSendError,
  });
}
