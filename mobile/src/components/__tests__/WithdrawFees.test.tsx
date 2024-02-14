// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { render, screen, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import WithdrawFees from "../WithdrawFees";

describe("WithdrawFees", () => {
  it("should display 0 when amount is not set yet", () => {
    render(<WithdrawFees tokenCode="TEST" amount="" />);

    const emptyAmountFees = screen.getByLabelText("empty amount withdraw fees");
    expect(emptyAmountFees).toBeTruthy();
    expect(within(emptyAmountFees).getByLabelText("label")).toHaveTextContent(
      /^You will receive$/
    );
    expect(
      within(emptyAmountFees).getByLabelText("total amount")
    ).toHaveTextContent(/^EUR 0.00$/);
    expect(within(emptyAmountFees).getByLabelText("fees")).toHaveTextContent(
      /^Fees: EUR 0.00$/
    );
  });
  it("should display error message when status is error", async () => {
    server.use(
      rest.get(
        `${backendApiUrl}/api/transactions/withdraws/fees`,
        (_req, rest, ctx) => {
          return rest(ctx.status(400));
        }
      )
    );

    render(<WithdrawFees tokenCode="TEST" amount="10" />);

    const feesError = await screen.findByLabelText("withdraw fees error");
    expect(feesError).toBeTruthy();
    expect(within(feesError).getByLabelText("label")).toHaveTextContent(
      /^You will receive$/
    );
    expect(within(feesError).getByLabelText("total amount")).toHaveTextContent(
      /^Select a valid amount$/
    );
    expect(within(feesError).getByLabelText("fees")).toHaveTextContent(
      /^Fees: N\/A$/
    );
  });
  it("should display error message when amount is not valid", async () => {
    // amount higher than limits / balance
    render(<WithdrawFees tokenCode="TEST" amount="100000" />);

    const feesError = await screen.findByLabelText("withdraw fees error");
    expect(feesError).toBeTruthy();
    expect(within(feesError).getByLabelText("label")).toHaveTextContent(
      /^You will receive$/
    );
    expect(within(feesError).getByLabelText("total amount")).toHaveTextContent(
      /^Select a valid amount$/
    );
    expect(within(feesError).getByLabelText("fees")).toHaveTextContent(
      /^Fees: N\/A$/
    );
  });
  it("should display calculated fees when amount is valid and fees are retrieved", async () => {
    render(<WithdrawFees tokenCode="TEST" amount="12" />);

    const withdrawFees = await screen.findByLabelText("withdraw fees");
    expect(withdrawFees).toBeTruthy();

    expect(within(withdrawFees).getByLabelText("label")).toHaveTextContent(
      /^You will receive$/
    );
    expect(
      await within(withdrawFees).findByLabelText("total amount")
    ).toHaveTextContent(/^EUR 10.00$/);
    expect(
      await within(withdrawFees).findByLabelText("fees")
    ).toHaveTextContent(/^Fees: EUR 2.00$/);
  });

  it("should not call the API if the amount is lower than the minimum fee set in config", async () => {
    render(<WithdrawFees tokenCode="TEST" amount="1" />);

    const feesError = await screen.findByLabelText("withdraw fees error");
    expect(feesError).toBeTruthy();
    expect(within(feesError).getByLabelText("label")).toHaveTextContent(
      /^You will receive$/
    );
    expect(within(feesError).getByLabelText("total amount")).toHaveTextContent(
      /^Amount too low$/
    );
    expect(within(feesError).getByLabelText("fees")).toHaveTextContent(
      /^Min: SCEUR 2.00$/
    );
  });
});
