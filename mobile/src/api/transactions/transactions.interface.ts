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
  memo: string | null;
  direction: "Outgoing" | "Incoming";
}

export enum TransactionType {
  Funding = "Funding",
  Payment = "Payment",
  Payout = "Payout",
  Clawback = "Clawback",
}
