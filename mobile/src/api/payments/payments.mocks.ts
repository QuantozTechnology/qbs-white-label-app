// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { http } from "msw";
import { backendApiUrl } from "../../utils/axios";

export const paymentsMocks = [
  http.post(
    `${backendApiUrl}/api/transactions/payments/pay/paymentrequest`,
    _ => {
      return new Response(null, { status: 201 });
    }
  ),
  http.post(
    `${backendApiUrl}/api/transactions/payments/pay/account`,
    _ => {
      return new Response(null, { status: 201 });
    }
  ),
];
