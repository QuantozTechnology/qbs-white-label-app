// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { z } from "zod";

export const BusinessRegistrationSchema = z.object({
  companyName: z
    .string({ required_error: "Company name is required" })
    .min(1)
    .trim(),
  contactPersonFullName: z
    .string({
      required_error: "Contact person full name is required",
    })
    .min(1)
    .trim(),
  email: z
    .string({ required_error: "Business email is required" })
    .email({ message: "Invalid email address" })
    .trim(),
  countryOfRegistration: z.string({ required_error: "Country is required" }),
  terms: z
    .boolean()
    .refine(
      (val) => val,
      "You must accept the terms and conditions to proceed"
    ),
});

export const BusinessRegistrationSchemaKeys =
  BusinessRegistrationSchema.keyof();
