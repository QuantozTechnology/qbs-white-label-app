// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { paymentRequestMocksDefaultResponse } from "../../api/paymentrequest/paymentRequest.mocks";
import { fireEvent, render, screen } from "../../jest/test-utils";
import { mockUseNavigationNavigate } from "../../jest/jest.setup";
import PaymentRequestItem from "../PaymentRequestItem";
import { PaymentRequestDetails } from "../../api/paymentrequest/paymentRequest.interface";

describe("PaymentRequestDetails", () => {
  const now = new Date("2023-03-13T12:00:00.000Z").getTime();

  const mockPaymentRequestDetails: PaymentRequestDetails = {
    ...paymentRequestMocksDefaultResponse.value,
  };

  beforeEach(() => {
    // Mocking the date of today to be a set date instead
    jest.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    // Restore the original Date.now() implementation
    jest.spyOn(Date, "now").mockRestore();
  });

  it("should render details correctly", async () => {
    render(<PaymentRequestItem details={mockPaymentRequestDetails} />);

    expect(screen.getByLabelText("payment request item")).toBeTruthy();
    expect(screen.getByLabelText("message")).toHaveTextContent(
      /^Test message$/
    );
    expect(screen.getByLabelText("validity")).toHaveTextContent(
      /^Valid for 27688 days$/
    );
    expect(screen.getByLabelText("amount")).toHaveTextContent(/^SCEUR 10.00$/);
  });

  it("should navigate to PaymentRequestDetails correctly", async () => {
    render(<PaymentRequestItem details={mockPaymentRequestDetails} />);
    const pressableItem = screen.getByLabelText("payment request item");

    fireEvent(pressableItem, "onPress");

    expect(mockUseNavigationNavigate).toHaveBeenCalledWith(
      "PaymentRequestDetails",
      {
        details: {
          code: "payment-request-code",
          createdOn: 1672562403000,
          options: {
            expiresOn: 4070957704000,
            isOneOffPayment: true,
            memo: "Test message",
            name: "John Doe",
            payerCanChangeRequestedAmount: true,
          },
          payments: [
            {
              accountCode: "12345678",
              amount: 10,
              createdOn: 1672648803000,
              transactionCode: "test-tx-code",
              updatedOn: 1672648803000,
            },
          ],
          requestedAmount: 10,
          status: "Open",
          tokenCode: "SCEUR",
          updatedOn: 1672562403000,
        },
      }
    );
  });

  it("should handle missing memo correctly", async () => {
    const missingMemo: PaymentRequestDetails = {
      ...paymentRequestMocksDefaultResponse.value,
      options: {
        ...paymentRequestMocksDefaultResponse.value.options,
        memo: null,
      },
    };

    render(<PaymentRequestItem details={missingMemo} />);

    expect(screen.getByLabelText("message")).toHaveTextContent(
      /^Message N\/A$/
    );
  });

  it("should handle missing expiresOn correctly", async () => {
    const missingMemo: PaymentRequestDetails = {
      ...paymentRequestMocksDefaultResponse.value,
      options: {
        ...paymentRequestMocksDefaultResponse.value.options,
        expiresOn: null,
      },
    };

    render(<PaymentRequestItem details={missingMemo} />);

    expect(screen.getByLabelText("validity")).toHaveTextContent(
      /^Never expires$/
    );
  });
});
