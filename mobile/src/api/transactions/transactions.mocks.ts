// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Transaction, TransactionType } from "./transactions.interface";

export const mockPayout: Transaction = {
  transactionCode: "3",
  created: 1675330238000,
  type: TransactionType.Payout,
  status: "COMPLETED",
  amount: 10,
  tokenCode: "SCEUR",
  fromAccountCode: "address-from",
  toAccountCode: "address-to",
  senderName: "John Doe",
  receiverName: null,
  memo: "Withdraw",
  direction: "Outgoing",
};

export const mockOutgoingPayment: Transaction = {
  transactionCode: "4",
  created: 1675330238000,
  type: TransactionType.Payment,
  status: "COMPLETED",
  amount: 50,
  tokenCode: "SCEUR",
  fromAccountCode: "address-from",
  toAccountCode: "address-to",
  senderName: "John Doe",
  receiverName: "Jane Smith",
  memo: "Split bills",
  direction: "Outgoing",
};

export const mockIncomingPayment: Transaction = {
  transactionCode: "1",
  created: 1675330238000,
  type: TransactionType.Payment,
  status: "COMPLETED",
  amount: 12345678.12,
  tokenCode: "SCEUR",
  fromAccountCode: "address-from",
  toAccountCode: "address-to",
  senderName: "John Doe",
  receiverName: "Jane Smith",
  memo: "here goes the message",
  direction: "Incoming",
};

export const mockFunding: Transaction = {
  transactionCode: "2",
  created: 1675330238000,
  type: TransactionType.Funding,
  status: "COMPLETED",
  amount: 100,
  tokenCode: "SCEUR",
  fromAccountCode: "address-from",
  toAccountCode: "address-to",
  senderName: null,
  receiverName: null,
  memo: "Funding",
  direction: "Incoming",
};

export const defaultTransactionsResponseMock: GenericApiResponse<
  Transaction[]
> = {
  value: [
    { ...mockPayout },
    { ...mockOutgoingPayment },
    { ...mockIncomingPayment },
    { ...mockFunding },
  ],
};

export const transactionMocks = [
  rest.get(`${backendApiUrl}/api/transactions`, (req, rest, ctx) => {
    return rest(
      ctx.status(200),
      ctx.set(
        "x-pagination",
        '{"TotalCount":5,"PageSize":10,"CurrentPage":1,"PreviousPage":null,"NextPage":null,"TotalPages":1}'
      ),
      ctx.json(defaultTransactionsResponseMock)
    );
  }),
];
