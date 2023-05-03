// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import {z} from "zod";

const TokenDetailsSchema = z.object({
  tokenCode: z.string(),
  validator: z.string().url(),
  owner: z.string().url(),
  asset: z.string().url(),
  schema: z.string().url(),
});

export type TokenDetails = z.infer<typeof TokenDetailsSchema>;
