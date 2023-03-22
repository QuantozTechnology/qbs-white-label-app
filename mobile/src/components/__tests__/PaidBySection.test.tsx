// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { PaymentRequestPayments } from "../../api/paymentrequest/paymentRequest.interface";
import { paymentRequestMocksDefaultResponse } from "../../api/paymentrequest/paymentRequest.mocks";
import { render, screen } from "../../jest/test-utils";
import PaidBySection from "../PaidBySection";

describe("PaidBySection", () => {
  it("renders the component correctly when there are no payments", () => {
    render(<PaidBySection tokenCode="SCEUR" payments={[]} />);

    expect(screen.getByLabelText("no payments")).toHaveTextContent(
      /^Nobody paid yet$/
    );
  });

  it("renders the component correctly when there are payments", async () => {
    const paymentsList: PaymentRequestPayments = [
      ...paymentRequestMocksDefaultResponse.value.payments,
    ];

    render(<PaidBySection tokenCode="SCEUR" payments={paymentsList} />);

    expect(screen.getByLabelText("label")).toHaveTextContent(/^02\/01\/2023$/);
    expect(screen.getByLabelText("value")).toHaveTextContent(/^12345678$/);
    expect(
      await screen.findByLabelText("payment paid amount")
    ).toHaveTextContent(/^SCEUR 10.00$/);
  });

  it("handles missing accountCode values correctly", () => {
    const paymentsList: PaymentRequestPayments = [
      ...paymentRequestMocksDefaultResponse.value.payments,
    ];
    paymentsList[0].accountCode = null;

    render(<PaidBySection tokenCode="SCEUR" payments={paymentsList} />);

    expect(screen.getByLabelText("value")).toHaveTextContent(/^N\/A$/);
  });
});
