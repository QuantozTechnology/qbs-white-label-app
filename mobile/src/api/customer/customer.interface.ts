// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { z } from "zod";

export type Customer = {
  reference: string;
  trustLevel: string;
  currencyCode: string | null;
  email: string;
  status: string;
  bankAccountNumber: string | null;
  data: Record<keyof ConsumerData | keyof MerchantData, string>;
  isBusiness: boolean;
};

export type ConsumerData = {
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  CountryOfResidence: string;
  Phone: string;
  IdFront: string | null;
  IdBack: string | null;
  Passport: string | null;
  Selfie: string | null;
};

export type MerchantData = {
  CompanyName: string;
  ContactPersonFullName: string;
  CountryOfRegistration: string;
};

export const CreateCustomerPayloadSchema = z.object({
  reference: z.string(),
  firstName: z
    .string({ required_error: "First name must be specified" })
    .min(1, { message: "First name must be longer than 1 character" }),
  lastName: z
    .string({ required_error: "Last name must be specified" })
    .min(1, { message: "Last name must be longer than 1 character" }),
  dateOfBirth: z
    .string({ required_error: "A valid date of birth must be specified" })
    .datetime()
    .refine(
      (date) => {
        return new Date(date).getTime() <= new Date().getTime();
      },
      {
        message: "Date of birth cannot be in the future",
      }
    ),
  countryOfResidence: z.string({ required_error: "Country must be specified" }),
  email: z.string().email(),
  phone: z.string(),
});

export type ICreateCustomer = z.infer<typeof CreateCustomerPayloadSchema>;
