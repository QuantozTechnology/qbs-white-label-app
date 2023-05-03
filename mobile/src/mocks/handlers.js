// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { accountsMocks } from "../api/account/account.mocks";
import { balancesMocks } from "../api/balances/balances.mocks";
import { customerMocks } from "../api/customer/customer.mocks";
import { filesMocks } from "../api/customer/files.mocks";
import { merchantMocks } from "../api/customer/merchant.mocks";
import { trustlevelsMocks } from "../api/labelpartner/trustlevels.mocks";
import { limitsMocks } from "../api/limits/limits.mocks";
import { paymentRequestsMocks } from "../api/paymentrequest/paymentRequest.mocks";
import { paymentsMocks } from "../api/payments/payments.mocks";
import { transactionMocks } from "../api/transactions/transactions.mocks";
import { withdrawMocks } from "../api/withdraw/withdraw.mocks";
import { tokenDetailsMocks } from "../api/tokens/tokens.mocks";

export const handlers = [
  ...accountsMocks,
  ...balancesMocks,
  ...customerMocks,
  ...filesMocks,
  ...limitsMocks,
  ...merchantMocks,
  ...paymentRequestsMocks,
  ...paymentsMocks,
  ...transactionMocks,
  ...trustlevelsMocks,
  ...withdrawMocks,
  ...tokenDetailsMocks,
];
