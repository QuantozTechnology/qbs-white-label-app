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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<keyof ConsumerData | keyof MerchantData, string> | any;
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
    .refine(
      (date) => {
        const [day, month, year] = date.split("/").map(Number);
        const epochFromDate = Date.UTC(year, month - 1, day);
        const reversedDate = date.split("/").reverse().join("-");

        // checks if input date is the same as the one created from its parts
        return (
          new Date(epochFromDate).toISOString().slice(0, 10) === reversedDate
        );
      },
      {
        message: "Invalid date of birth",
      }
    )
    .refine(
      (date) => {
        const [day, month, year] = date.split("/").map(Number);
        const epochFromDate = Date.UTC(year, month - 1, day);

        return epochFromDate <= new Date().getTime();
      },
      {
        message: "Date of birth cannot be in the future",
      }
    ),
  countryOfResidence: z.string({
    invalid_type_error: "Country must be specified",
    required_error: "Country must be specified",
  }),
  email: z.string().email(),
  phone: z.string(),
});

export type ICreateCustomer = z.infer<typeof CreateCustomerPayloadSchema>;
