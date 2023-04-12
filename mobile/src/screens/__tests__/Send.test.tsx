// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import Send from "../Send";
import { biometricValidation } from "../../utils/biometric";

describe("Send", () => {
  const mockNavigate = jest.fn();
  const mockReset = jest.fn();
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: jest.fn(),
      getParent: () => ({
        navigate: mockNavigate,
        reset: mockReset,
      }),
    },
    route: {
      params: {},
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("shows expected UI on first load", async () => {
    props = createTestProps({});
    render(<Send {...props} />);

    const balances = await screen.findByLabelText("balances list");
    const accountCode = screen.getByLabelText("account code");
    const amount = screen.getByLabelText("amount");
    const message = screen.getByLabelText("message");
    const shareName = screen.getByLabelText("share name with the payer");
    const sendButton = screen.getByLabelText("send");

    expect(balances).toBeTruthy();
    expect(accountCode).toBeTruthy();
    expect(accountCode.props.value).toBeUndefined();
    expect(amount).toBeTruthy();
    expect(amount.props.value).toBeUndefined();
    expect(message).toBeTruthy();
    expect(message.props.value).toBeUndefined();
    expect(shareName).toBeTruthy();
    expect(shareName.props.checked).toBeFalsy();
    expect(sendButton).toBeTruthy();
    expect(sendButton).toBeEnabled();
  });

  it("shows error if cannot load balances from API", async () => {
    const balancesApiError: APIError = {
      Errors: [
        {
          Message: "Cannot load balances",
          Code: ApiErrorCode.InternalServerError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.get(`${backendApiUrl}/api/accounts/balances`, (req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json(balancesApiError));
      })
    );

    props = createTestProps({});
    render(<Send {...props} />);

    const errorMessage = await screen.findByLabelText("full screen message");

    expect(
      within(errorMessage).getByLabelText("full screen message title")
    ).toHaveTextContent("Cannot load balances");
    expect(
      within(errorMessage).getByLabelText("full screen message description")
    ).toHaveTextContent("Please try again later");
  });

  it("shows account code validation errors", async () => {
    props = createTestProps({});
    render(<Send {...props} />);

    const accountCode = await screen.findByLabelText("account code");
    const sendButton = screen.getByLabelText("send");

    fireEvent(sendButton, "onPress");

    // no account code specified, required error
    expect(
      await screen.findByLabelText("account code error")
    ).toHaveTextContent(/^Required$/);

    // account code too short, specific length error
    fireEvent(accountCode, "onChangeText", "A123");
    expect(await screen.findByLabelText("send")).toBeDisabled();
    fireEvent(sendButton, "onPress");
    expect(
      await screen.findByLabelText("account code error")
    ).toHaveTextContent(
      /^The account code must be exactly 8 characters long.$/
    );
  });

  it("shows amount validation errors", async () => {
    props = createTestProps({});
    render(<Send {...props} />);

    const amount = await screen.findByLabelText("amount");
    const sendButton = screen.getByLabelText("send");

    fireEvent(sendButton, "onPress");

    // no amount specified, required error
    expect(await screen.findByLabelText("amount error")).toHaveTextContent(
      /^Required$/
    );

    // amount higher than balance
    fireEvent(amount, "onChangeText", "10000");
    expect(await screen.findByLabelText("send")).toBeDisabled();
    fireEvent(sendButton, "onPress");
    expect(await screen.findByLabelText("amount error")).toHaveTextContent(
      /^Max: SCEUR 300.00$/
    );
  });

  it("shows message validation errors", async () => {
    props = createTestProps({});
    render(<Send {...props} />);

    const message = await screen.findByLabelText("message");
    const sendButton = screen.getByLabelText("send");

    fireEvent(
      message,
      "onChangeText",
      "This is a random text that is longer than the allowed length"
    );
    fireEvent(sendButton, "onPress");

    // message too long
    expect(await screen.findByLabelText("message error")).toHaveTextContent(
      /^Max 28 characters allowed$/
    );
  });

  it("does not create a payment if biometric check is not passed", async () => {
    (biometricValidation as jest.Mock).mockResolvedValueOnce({
      result: "error",
      message: "Error message",
    });

    props = createTestProps({});
    render(<Send {...props} />);

    const accountCode = await screen.findByLabelText("account code");
    const amount = screen.getByLabelText("amount");
    const message = screen.getByLabelText("message");

    fireEvent(accountCode, "onChangeText", "12345678");
    fireEvent(amount, "onChangeText", "10.00");
    fireEvent(message, "onChangeText", "test");
    fireEvent(await screen.findByLabelText("send"), "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Please complete biometric authentication$/);
  });

  it("sends a payment correctly", async () => {
    (biometricValidation as jest.Mock).mockResolvedValueOnce({
      result: "success",
    });

    props = createTestProps({});
    render(<Send {...props} />);

    const accountCode = await screen.findByLabelText("account code");
    const amount = screen.getByLabelText("amount");
    const message = screen.getByLabelText("message");

    fireEvent(accountCode, "onChangeText", "12345678");
    fireEvent(amount, "onChangeText", "10.00");
    fireEvent(message, "onChangeText", "test");

    fireEvent(await screen.findByLabelText("send"), "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Payment successful$/);
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: "Portfolio" }],
    });
  });

  it("fails to create a payment", async () => {
    (biometricValidation as jest.Mock).mockResolvedValueOnce({
      result: "success",
    });

    const apiError: APIError = {
      Errors: [
        {
          Message: "Cannot create payment",
          Code: ApiErrorCode.InternalServerError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.post(
        `${backendApiUrl}/api/transactions/payments/pay/account`,
        (req, rest, ctx) => {
          return rest(ctx.status(400), ctx.json(apiError));
        }
      )
    );

    props = createTestProps({});
    render(<Send {...props} />);

    const accountCode = await screen.findByLabelText("account code");
    const amount = screen.getByLabelText("amount");
    const message = screen.getByLabelText("message");

    fireEvent(accountCode, "onChangeText", "12345678");
    fireEvent(amount, "onChangeText", "10.00");
    fireEvent(message, "onChangeText", "test");

    fireEvent(await screen.findByLabelText("send"), "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Cannot create payment$/);
  });
});
