// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Transaction } from "../../api/transactions/transactions.interface";
import {
  mockFunding,
  mockIncomingPayment,
  mockOutgoingPayment,
  mockPayout,
} from "../../api/transactions/transactions.mocks";
import { render, screen } from "../../jest/test-utils";
import TransactionsListItem from "../TransactionsListItem";

describe("Transaction list item", () => {
  it("shows expected values for a payout ", async () => {
    render(<TransactionsListItem transaction={mockPayout} />);

    const amount = screen.getByLabelText("amount");
    const description = screen.getByLabelText("description");
    const icon = await screen.findByLabelText("outgoing icon");

    expect(description).toHaveTextContent(/^Payout$/);
    expect(amount).toHaveTextContent(/^-10.00$/);
    expect(icon).toBeTruthy();
  });

  it("shows expected values for an outgoing payment (name shared) ", async () => {
    render(<TransactionsListItem transaction={mockOutgoingPayment} />);

    const amount = screen.getByLabelText("amount");
    const description = screen.getByLabelText("description");
    const icon = await screen.findByLabelText("outgoing icon");

    expect(description).toHaveTextContent(/^Jane Smith$/);
    expect(amount).toHaveTextContent(/^-50.00$/);
    expect(icon).toBeTruthy();
  });

  it("shows expected values for an outgoing payment (name NOT shared) ", async () => {
    const nameNotShareOutgoingPayment: Transaction = JSON.parse(
      JSON.stringify(mockOutgoingPayment)
    );

    nameNotShareOutgoingPayment.receiverName = null;

    render(<TransactionsListItem transaction={nameNotShareOutgoingPayment} />);

    const amount = screen.getByLabelText("amount");
    const description = screen.getByLabelText("description");
    const icon = await screen.findByLabelText("outgoing icon");

    expect(description).toHaveTextContent(/^address-to$/);
    expect(amount).toHaveTextContent(/^-50.00$/);
    expect(icon).toBeTruthy();
  });

  it("shows expected values for an incoming payment (name shared) ", async () => {
    render(<TransactionsListItem transaction={mockIncomingPayment} />);

    const amount = screen.getByLabelText("amount");
    const description = screen.getByLabelText("description");
    const icon = await screen.findByLabelText("incoming icon");

    expect(description).toHaveTextContent(/^John Doe$/);
    expect(amount).toHaveTextContent(/^\+12345678.12$/);
    expect(icon).toBeTruthy();
  });

  it("shows expected values for an incoming payment (name NOT shared) ", async () => {
    const nameNotShareIncomingPayment: Transaction = JSON.parse(
      JSON.stringify(mockIncomingPayment)
    );

    nameNotShareIncomingPayment.senderName = null;

    render(<TransactionsListItem transaction={nameNotShareIncomingPayment} />);

    const amount = screen.getByLabelText("amount");
    const description = screen.getByLabelText("description");
    const icon = await screen.findByLabelText("incoming icon");

    expect(description).toHaveTextContent(/^address-from$/);
    expect(amount).toHaveTextContent(/^\+12345678.12$/);
    expect(icon).toBeTruthy();
  });

  it("shows expected values for a funding ", async () => {
    render(<TransactionsListItem transaction={mockFunding} />);

    const amount = screen.getByLabelText("amount");
    const description = screen.getByLabelText("description");
    const icon = await screen.findByLabelText("incoming icon");

    expect(description).toHaveTextContent(/^Funding$/);
    expect(amount).toHaveTextContent(/^\+100.00$/);
    expect(icon).toBeTruthy();
  });
});
