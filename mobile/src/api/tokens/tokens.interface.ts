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

const TokenDetailsTaxonomySchema = z.object({
  taxonomySchemaCode: z.string().nullable(),
  assetUrl: z.string().nullable(),
  taxonomyProperties: z.string().nullable(), // Assuming this is always a stringified JSON
  hash: z.string().nullable(),
});

const TokenDetailsSchema = z.object({
  code: z.string(),
  name: z.string(),
  issuerAddress: z.string(),
  status: z.string(),
  balance: z.string().nullable(),
  // unix epoch, therefore number
  created: z.number(),
  taxonomy: TokenDetailsTaxonomySchema.nullable(),
  data: z.record(z.string()).nullable(),
});

export type TokenDetails = z.infer<typeof TokenDetailsSchema>;
