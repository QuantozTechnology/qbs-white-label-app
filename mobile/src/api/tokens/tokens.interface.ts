// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { z } from "zod";

// Available / owned tokens
const TokensSchema = z.object({
  code: z.string(),
  name: z.string(),
  issuerAddress: z.string(),
  balance: z.string().nullable(),
  status: z.enum(["Created", "Active", "Disabled"]),
});

export type Tokens = z.infer<typeof TokensSchema>;

// token details
const TokenDetailsSchema = z.object({
  tokenCode: z.string(),
  validatorUrl: z.string().url(),
  issuerUrl: z.string().url(),
  assetUrl: z.string().url(),
  schemaUrl: z.string().url(),
});

export type TokenDetails = z.infer<typeof TokenDetailsSchema>;
