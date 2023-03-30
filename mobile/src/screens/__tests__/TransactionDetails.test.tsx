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
import { mockNavigation } from "../../jest/jest.setup";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import TransactionDetails from "../TransactionDetails";

describe("Transaction details screen", () => {
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      ...mockNavigation,
    },
    ...props,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("shows the expected info for a payout", async () => {
    props = createTestProps({
      route: {
        params: {
          transaction: mockPayout,
        },
      },
    });
    render(<TransactionDetails {...props} />);

    const transactionCode = await screen.findByLabelText("transaction code");
    const created = screen.getByLabelText("created date");
    const type = screen.getByLabelText("type");
    const status = screen.getByLabelText("status");
    const amount = screen.getByLabelText("amount");
    const to = await screen.findByLabelText("to");
    const message = screen.getByLabelText("message");

    expect(within(transactionCode).getByLabelText("label")).toHaveTextContent(
      /^Transaction code$/
    );
    expect(within(transactionCode).getByLabelText("value")).toHaveTextContent(
      /^3$/
    );
    expect(within(created).getByLabelText("label")).toHaveTextContent(/^Date$/);
    expect(within(created).getByLabelText("value")).toHaveTextContent(
      /^02\/02\/2023 - 09:30:38$/
    );
    expect(within(type).getByLabelText("label")).toHaveTextContent(/^Type$/);
    expect(within(type).getByLabelText("value")).toHaveTextContent(/^Payout$/);
    expect(within(status).getByLabelText("label")).toHaveTextContent(
      /^Status$/
    );
    expect(within(status).getByLabelText("value")).toHaveTextContent(
      /^COMPLETED$/
    );
    expect(within(amount).getByLabelText("label")).toHaveTextContent(
      /^Amount$/
    );
    expect(within(amount).getByLabelText("value")).toHaveTextContent(
      /^SCEUR 10.00$/
    );
    expect(within(to).getByLabelText("label")).toHaveTextContent(/^To$/);
    expect(within(to).getByLabelText("value")).toHaveTextContent(
      /^My bank account$/
    );
    expect(within(message).getByLabelText("label")).toHaveTextContent(
      /^Message$/
    );
    expect(within(message).getByLabelText("value")).toHaveTextContent(
      /^Withdraw$/
    );
  });

  it("shows the correct info for an outgoing transaction (name shared)", async () => {
    props = createTestProps({
      route: {
        params: {
          transaction: mockOutgoingPayment,
        },
      },
    });

    render(<TransactionDetails {...props} />);

    const transactionCode = await screen.findByLabelText("transaction code");
    const created = screen.getByLabelText("created date");
    const type = screen.getByLabelText("type");
    const status = screen.getByLabelText("status");
    const amount = screen.getByLabelText("amount");
    const to = await screen.findByLabelText("to");
    const message = screen.getByLabelText("message");

    expect(within(transactionCode).getByLabelText("label")).toHaveTextContent(
      /^Transaction code$/
    );
    expect(within(transactionCode).getByLabelText("value")).toHaveTextContent(
      /^4$/
    );
    expect(within(created).getByLabelText("label")).toHaveTextContent(/^Date$/);
    expect(within(created).getByLabelText("value")).toHaveTextContent(
      /^02\/02\/2023 - 09:30:38$/
    );
    expect(within(type).getByLabelText("label")).toHaveTextContent(/^Type$/);
    expect(within(type).getByLabelText("value")).toHaveTextContent(/^Payment$/);
    expect(within(status).getByLabelText("label")).toHaveTextContent(
      /^Status$/
    );
    expect(within(status).getByLabelText("value")).toHaveTextContent(
      /^COMPLETED$/
    );
    expect(within(amount).getByLabelText("label")).toHaveTextContent(
      /^Amount$/
    );
    expect(within(amount).getByLabelText("value")).toHaveTextContent(
      /^SCEUR 50.00$/
    );
    expect(within(to).getByLabelText("label")).toHaveTextContent(/^To$/);
    expect(within(to).getByLabelText("value")).toHaveTextContent(
      /^Jane Smith$/
    );
    expect(within(message).getByLabelText("label")).toHaveTextContent(
      /^Message$/
    );
    expect(within(message).getByLabelText("value")).toHaveTextContent(
      /^Split bills$/
    );
  });

  it("shows the correct info for an outgoing transaction (name NOT shared)", async () => {
    const nameNotShareOutgoingPayment: Transaction = JSON.parse(
      JSON.stringify(mockOutgoingPayment)
    );

    nameNotShareOutgoingPayment.receiverName = null;

    props = createTestProps({
      route: {
        params: {
          transaction: nameNotShareOutgoingPayment,
        },
      },
    });

    render(<TransactionDetails {...props} />);

    const transactionCode = await screen.findByLabelText("transaction code");
    const created = screen.getByLabelText("created date");
    const type = screen.getByLabelText("type");
    const status = screen.getByLabelText("status");
    const amount = screen.getByLabelText("amount");
    const to = await screen.findByLabelText("to");
    const message = screen.getByLabelText("message");

    expect(within(transactionCode).getByLabelText("label")).toHaveTextContent(
      /^Transaction code$/
    );
    expect(within(transactionCode).getByLabelText("value")).toHaveTextContent(
      /^4$/
    );
    expect(within(created).getByLabelText("label")).toHaveTextContent(/^Date$/);
    expect(within(created).getByLabelText("value")).toHaveTextContent(
      /^02\/02\/2023 - 09:30:38$/
    );
    expect(within(type).getByLabelText("label")).toHaveTextContent(/^Type$/);
    expect(within(type).getByLabelText("value")).toHaveTextContent(/^Payment$/);
    expect(within(status).getByLabelText("label")).toHaveTextContent(
      /^Status$/
    );
    expect(within(status).getByLabelText("value")).toHaveTextContent(
      /^COMPLETED$/
    );
    expect(within(amount).getByLabelText("label")).toHaveTextContent(
      /^Amount$/
    );
    expect(within(amount).getByLabelText("value")).toHaveTextContent(
      /^SCEUR 50.00$/
    );
    expect(within(to).getByLabelText("label")).toHaveTextContent(/^To$/);
    expect(within(to).getByLabelText("value")).toHaveTextContent(
      /^address-to$/
    );
    expect(within(message).getByLabelText("label")).toHaveTextContent(
      /^Message$/
    );
    expect(within(message).getByLabelText("value")).toHaveTextContent(
      /^Split bills$/
    );
  });

  it("shows the correct info for an incoming transaction (name shared)", async () => {
    props = createTestProps({
      route: {
        params: {
          transaction: mockIncomingPayment,
        },
      },
    });
    render(<TransactionDetails {...props} />);

    const transactionCode = await screen.findByLabelText("transaction code");
    const created = screen.getByLabelText("created date");
    const type = screen.getByLabelText("type");
    const status = screen.getByLabelText("status");
    const amount = screen.getByLabelText("amount");
    const from = await screen.findByLabelText("from");
    const message = screen.getByLabelText("message");

    expect(within(transactionCode).getByLabelText("label")).toHaveTextContent(
      /^Transaction code$/
    );
    expect(within(transactionCode).getByLabelText("value")).toHaveTextContent(
      /^1$/
    );
    expect(within(created).getByLabelText("label")).toHaveTextContent(/^Date$/);
    expect(within(created).getByLabelText("value")).toHaveTextContent(
      /^02\/02\/2023 - 09:30:38$/
    );
    expect(within(type).getByLabelText("label")).toHaveTextContent(/^Type$/);
    expect(within(type).getByLabelText("value")).toHaveTextContent(/^Payment$/);
    expect(within(status).getByLabelText("label")).toHaveTextContent(
      /^Status$/
    );
    expect(within(status).getByLabelText("value")).toHaveTextContent(
      /^COMPLETED$/
    );
    expect(within(amount).getByLabelText("label")).toHaveTextContent(
      /^Amount$/
    );
    expect(within(amount).getByLabelText("value")).toHaveTextContent(
      /^SCEUR 12345678.12$/
    );
    expect(within(from).getByLabelText("label")).toHaveTextContent(/^From$/);
    expect(within(from).getByLabelText("value")).toHaveTextContent(
      /^John Doe$/
    );
    expect(within(message).getByLabelText("label")).toHaveTextContent(
      /^Message$/
    );
    expect(within(message).getByLabelText("value")).toHaveTextContent(
      /^here goes the message$/
    );
  });

  it("shows the correct info for an incoming transaction (name NOT shared)", async () => {
    const nameNotShareIncomingPayment: Transaction = JSON.parse(
      JSON.stringify(mockIncomingPayment)
    );

    nameNotShareIncomingPayment.senderName = null;

    props = createTestProps({
      route: {
        params: {
          transaction: nameNotShareIncomingPayment,
        },
      },
    });
    render(<TransactionDetails {...props} />);

    const transactionCode = await screen.findByLabelText("transaction code");
    const created = screen.getByLabelText("created date");
    const type = screen.getByLabelText("type");
    const status = screen.getByLabelText("status");
    const amount = screen.getByLabelText("amount");
    const from = await screen.findByLabelText("from");
    const message = screen.getByLabelText("message");

    expect(within(transactionCode).getByLabelText("label")).toHaveTextContent(
      /^Transaction code$/
    );
    expect(within(transactionCode).getByLabelText("value")).toHaveTextContent(
      /^1$/
    );
    expect(within(created).getByLabelText("label")).toHaveTextContent(/^Date$/);
    expect(within(created).getByLabelText("value")).toHaveTextContent(
      /^02\/02\/2023 - 09:30:38$/
    );
    expect(within(type).getByLabelText("label")).toHaveTextContent(/^Type$/);
    expect(within(type).getByLabelText("value")).toHaveTextContent(/^Payment$/);
    expect(within(status).getByLabelText("label")).toHaveTextContent(
      /^Status$/
    );
    expect(within(status).getByLabelText("value")).toHaveTextContent(
      /^COMPLETED$/
    );
    expect(within(amount).getByLabelText("label")).toHaveTextContent(
      /^Amount$/
    );
    expect(within(amount).getByLabelText("value")).toHaveTextContent(
      /^SCEUR 12345678.12$/
    );
    expect(within(from).getByLabelText("label")).toHaveTextContent(/^From$/);
    expect(within(from).getByLabelText("value")).toHaveTextContent(
      /^address-from$/
    );
    expect(within(message).getByLabelText("label")).toHaveTextContent(
      /^Message$/
    );
    expect(within(message).getByLabelText("value")).toHaveTextContent(
      /^here goes the message$/
    );
  });

  it("shows the correct info for a funding operation", async () => {
    props = createTestProps({
      route: {
        params: {
          transaction: mockFunding,
        },
      },
    });
    render(<TransactionDetails {...props} />);

    const transactionCode = await screen.findByLabelText("transaction code");
    const created = screen.getByLabelText("created date");
    const type = screen.getByLabelText("type");
    const status = screen.getByLabelText("status");
    const amount = screen.getByLabelText("amount");
    const from = await screen.findByLabelText("from");
    const message = screen.getByLabelText("message");

    expect(within(transactionCode).getByLabelText("label")).toHaveTextContent(
      /^Transaction code$/
    );
    expect(within(transactionCode).getByLabelText("value")).toHaveTextContent(
      /^2$/
    );
    expect(within(created).getByLabelText("label")).toHaveTextContent(/^Date$/);
    expect(within(created).getByLabelText("value")).toHaveTextContent(
      /^02\/02\/2023 - 09:30:38$/
    );
    expect(within(type).getByLabelText("label")).toHaveTextContent(/^Type$/);
    expect(within(type).getByLabelText("value")).toHaveTextContent(/^Funding$/);
    expect(within(status).getByLabelText("label")).toHaveTextContent(
      /^Status$/
    );
    expect(within(status).getByLabelText("value")).toHaveTextContent(
      /^COMPLETED$/
    );
    expect(within(amount).getByLabelText("label")).toHaveTextContent(
      /^Amount$/
    );
    expect(within(amount).getByLabelText("value")).toHaveTextContent(
      /^SCEUR 100.00$/
    );
    expect(within(from).getByLabelText("label")).toHaveTextContent(/^From$/);
    expect(within(from).getByLabelText("value")).toHaveTextContent(/^Issuer$/);
    expect(within(message).getByLabelText("label")).toHaveTextContent(
      /^Message$/
    );
    expect(within(message).getByLabelText("value")).toHaveTextContent(
      /^Funding$/
    );
  });

  it("takes the user to the send screen when the refund button is pressed on an inc", async () => {
    props = createTestProps({
      route: {
        params: {
          transaction: mockIncomingPayment,
        },
      },
    });

    render(<TransactionDetails {...props} />);

    const refundButton = await screen.findByLabelText("refund");
    fireEvent.press(refundButton);

    expect(mockNavigation.replace).toHaveBeenCalledWith("SendStack", {
      screen: "Send",
      params: {
        accountCode: mockIncomingPayment.fromAccountCode,
        amount: mockIncomingPayment.amount,
        message: mockIncomingPayment.memo,
      },
    });
  });

  it("does not show the refund button on an outgoing transaction", async () => {
    props = createTestProps({
      route: {
        params: {
          transaction: mockOutgoingPayment,
        },
      },
    });

    render(<TransactionDetails {...props} />);

    expect(screen.queryByLabelText("refund")).toBeNull();
  });
});
