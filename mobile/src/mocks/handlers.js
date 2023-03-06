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
];
