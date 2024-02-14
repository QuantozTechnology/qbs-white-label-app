// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import CreatePaymentRequest from "../CreatePaymentRequest";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";

describe("Create payment request", () => {
  const mockNavigation = jest.fn();
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: mockNavigation,
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("should display the expected initial state of the page", async () => {
    props = createTestProps({});
    render(<CreatePaymentRequest {...props} />);

    const balanceList = await screen.findByLabelText("balances list");
    const amount = screen.getByLabelText("amount");
    const message = screen.getByLabelText("message");
    const canChangeAmountCheckbox = screen.getByLabelText(
      "amount can be changed by payer"
    );
    const sharePersonalInfoCheckbox = screen.getByLabelText(
      "share name with the payer"
    );
    const expirationDateSelect = await screen.findByLabelText(
      "expiration date"
    );

    expect(balanceList).toBeTruthy();
    expect(amount.props.value).toBe("");
    expect(message.props.value).toBeUndefined();
    expect(canChangeAmountCheckbox.props.checked).toBeFalsy();
    expect(sharePersonalInfoCheckbox.props.checked).toBeFalsy();
    expect(expirationDateSelect.props.value).toBeUndefined();
  });

  it("shows error if balances API error occurs", async () => {
    const tokensApiError: APIError = {
      Errors: [
        {
          Message: "Missing fields",
          Code: ApiErrorCode.ValidationError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.get(`${backendApiUrl}/api/accounts/balances`, (req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json(tokensApiError));
      })
    );

    props = createTestProps({});
    render(<CreatePaymentRequest {...props} />);

    const stablecoinsSelectOptions =
      screen.queryAllByLabelText("stablecoin option");

    expect(stablecoinsSelectOptions).toHaveLength(0);

    expect(
      within(
        await screen.findByLabelText("full screen message")
      ).getByLabelText("full screen message title")
    ).toHaveTextContent(/^Oops$/);
    expect(
      within(
        await screen.findByLabelText("full screen message")
      ).getByLabelText("full screen message description")
    ).toHaveTextContent(/^An error occurred. Please try again later$/);
  });

  it("shows validation errors if user didn't complete the required form fields", async () => {
    props = createTestProps({});
    render(<CreatePaymentRequest {...props} />);

    const amount = await screen.findByLabelText("amount");
    const nextButton = screen.getByLabelText("create payment request");

    fireEvent(nextButton, "onPress");

    let zeroAmountError = await screen.findByLabelText("amount error");
    expect(zeroAmountError).toHaveTextContent("Amount must be specified");

    fireEvent(amount, "onChangeText", "0");
    fireEvent(nextButton, "onPress");

    zeroAmountError = await screen.findByLabelText("amount error");
    expect(zeroAmountError).toHaveTextContent("Amount must be greater than 0");

    fireEvent(amount, "onChangeText", "10");

    // the error message is not visible anymore
    zeroAmountError = screen.queryByLabelText("amount error");
    expect(zeroAmountError).toBeNull();
  });

  it("should create the payment request", async () => {
    render(<CreatePaymentRequest {...props} />);

    const amount = await screen.findByLabelText("amount");
    const nextButton = screen.getByLabelText("create payment request");

    fireEvent(amount, "onChangeText", "10");

    const updatedAmount = await screen.findByLabelText("amount");
    expect(updatedAmount.props.value).toBe("10");

    fireEvent(nextButton, "onPress");

    await waitFor(() =>
      expect(mockNavigation).toHaveBeenCalledWith("SummaryPaymentRequest", {
        code: "payment-request-code",
      })
    );
  });

  it("should show error notification if the creation of the payment request", async () => {
    const apiError: APIError = {
      Errors: [
        {
          Message: "Error",
          Code: ApiErrorCode.InternalServerError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.post(`${backendApiUrl}/api/paymentrequests`, (req, rest, ctx) => {
        return rest(ctx.status(500), ctx.json(apiError));
      })
    );

    render(<CreatePaymentRequest {...props} />);

    const amount = await screen.findByLabelText("amount");
    const nextButton = screen.getByLabelText("create payment request");

    fireEvent(amount, "onChangeText", "10");

    const updatedAmount = await screen.findByLabelText("amount");
    expect(updatedAmount.props.value).toBe("10");

    fireEvent(nextButton, "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Error$/);
  });
});
