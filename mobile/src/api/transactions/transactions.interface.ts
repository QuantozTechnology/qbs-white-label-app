// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

export interface Transaction {
  transactionCode: string;
  fromAccountCode: string;
  toAccountCode: string;
  senderName: string | null;
  receiverName: string | null;
  amount: number;
  // unix epoch timestamp
  created: number;
  status: string;
  type: TransactionType;
  tokenCode: string;
  memo?: string;
  direction: "Outgoing" | "Incoming";
}

export enum TransactionType {
  Funding = "Funding",
  Payment = "Payment",
  Payout = "Payout",
  Clawback = "Clawback",
}
