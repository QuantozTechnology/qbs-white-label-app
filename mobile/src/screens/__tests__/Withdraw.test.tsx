// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { Customer } from "../../api/customer/customer.interface";
import { customerMocksDefaultResponse } from "../../api/customer/customer.mocks";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";
import { Limits, LimitsDetails } from "../../api/limits/limits.interface";
import { defaultLimitsMockResponse } from "../../api/limits/limits.mocks";
import { GenericApiResponse } from "../../api/utils/api.interface";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import { biometricValidation } from "../../utils/biometric";
import Withdraw from "../Withdraw";

jest.mock("../../utils/biometric", () => ({
  biometricValidation: jest
    .fn()
    .mockResolvedValue({ result: "error", message: "Error message" }),
}));

describe("Withdraw screen", () => {
  beforeEach(() => {
    (biometricValidation as jest.Mock).mockResolvedValue({ result: "success" });
  });

  const responseWithBankAccount: { value: Customer } = {
    value: {
      ...customerMocksDefaultResponse.value,
      bankAccountNumber: "NL123456",
    },
  };

  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: jest.fn(),
      setOptions: jest.fn(),
    },
    ...props,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("shows the expected UI if bank account is null", async () => {
    props = createTestProps({});
    render(<Withdraw {...props} />);

    const limitsProgress = await screen.findByLabelText(
      "limits progress for customer"
    );
    const noBankAccountNotification = screen.getByLabelText(
      "notification message"
    );
    const withdrawButton = screen.getByLabelText("withdraw button");

    expect(limitsProgress).toBeTruthy();
    expect(
      within(noBankAccountNotification).getByLabelText(
        "notification message title"
      )
    ).toHaveTextContent(/^No known bank account$/);
    expect(withdrawButton).toBeTruthy();
  });

  it("shows the expected UI if bank account is defined", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(responseWithBankAccount));
      })
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const limitsProgress = await screen.findByLabelText(
      "limits progress for customer"
    );
    const balances = await screen.findByLabelText("balances list");
    const amount = screen.getByLabelText("amount");
    const fees = await screen.findByLabelText("empty amount withdraw fees");
    const withdrawButton = screen.getByLabelText("withdraw button");

    expect(limitsProgress).toBeTruthy();
    expect(balances).toBeTruthy();
    expect(amount.props.value).toBe("");
    expect(fees).toBeTruthy();
    expect(withdrawButton).toBeTruthy();
  });

  it("shows error if limit API returns an error", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers/limits`, (req, rest, ctx) => {
        return rest(ctx.status(400));
      })
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const limitsProgressError = await screen.findByLabelText("limits error");
    const errorFullScreenMessage = screen.getByLabelText("full screen message");

    expect(limitsProgressError).toBeTruthy();
    expect(
      within(errorFullScreenMessage).getByLabelText("full screen message title")
    ).toHaveTextContent(/^Error loading data$/);
    expect(
      within(errorFullScreenMessage).getByLabelText(
        "full screen message description"
      )
    ).toHaveTextContent(/^Please try again later$/);
  });

  it("shows error if balances API returns an error", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/accounts/balances`, (req, rest, ctx) => {
        return rest(ctx.status(400));
      })
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const limitsProgressError = await screen.findByLabelText("limits error");
    const errorFullScreenMessage = screen.getByLabelText("full screen message");

    expect(limitsProgressError).toBeTruthy();
    expect(
      within(errorFullScreenMessage).getByLabelText("full screen message title")
    ).toHaveTextContent(/^Error loading data$/);
    expect(
      within(errorFullScreenMessage).getByLabelText(
        "full screen message description"
      )
    ).toHaveTextContent(/^Please try again later$/);
  });

  it("hides the form if limits have been reached", async () => {
    const withdrawLimitsReached: LimitsDetails = {
      limit: { monthly: "100" },
      used: { monthly: "100" },
    };

    const limitsReachedMock: GenericApiResponse<Limits[]> = {
      value: [
        {
          ...defaultLimitsMockResponse.value[0],
          withdraw: withdrawLimitsReached,
        },
      ],
    };

    server.use(
      rest.get(`${backendApiUrl}/api/customers/limits`, (_req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(limitsReachedMock));
      })
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const limitsProgress = await screen.findByLabelText(
      "limits progress for customer"
    );

    const withdrawButton = screen.queryByLabelText("withdraw button");
    const selectStablecoin = screen.queryByLabelText("select stablecoin");
    const amount = screen.queryByLabelText("amount");
    const limitsReachedMessage = screen.getByLabelText("limits info");

    expect(limitsProgress).toBeTruthy();
    expect(selectStablecoin).toBeFalsy();
    expect(amount).toBeFalsy();
    expect(withdrawButton).toBeDisabled();
    expect(limitsReachedMessage).toHaveTextContent(
      /^You have reached your monthly limits.$/
    );
  });

  it("shows validation error if amount is not filled", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(responseWithBankAccount));
      })
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const withdrawButton = await screen.findByLabelText("withdraw button");

    await waitFor(() => expect(withdrawButton).toBeEnabled());
    fireEvent(withdrawButton, "onPress");

    const amountError = await screen.findByLabelText("amount error");
    expect(amountError).toHaveTextContent(/^Min: SCEUR 2.00$/);
  });

  it("shows validation error if amount is 0 or lower", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(responseWithBankAccount));
      })
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const amount = await screen.findByLabelText("amount");

    fireEvent(amount, "onChangeText", "0");

    const feesAmountError = await screen.findByLabelText("withdraw fees error");
    expect(
      within(feesAmountError).getByLabelText("total amount")
    ).toHaveTextContent(/^Amount too low$/);
  });

  it("shows validation error if amount is greater than balance", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(responseWithBankAccount));
      })
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const amount = await screen.findByLabelText("amount");

    fireEvent(amount, "onChangeText", "1000");

    const amountError = await screen.findByLabelText("amount error");
    expect(amountError).toHaveTextContent(
      /^Amount greater than balance or account limits$/
    );
  });

  it("shows validation error if amount is lower than min fee", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(responseWithBankAccount));
      })
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const withdrawButton = await screen.findByLabelText("withdraw button");
    const amount = screen.getByLabelText("amount");

    fireEvent(amount, "onChangeText", "1");

    await screen.findByLabelText("amount");
    await waitFor(() => expect(withdrawButton).toBeEnabled());

    fireEvent(withdrawButton, "onPress");

    const amountError = await screen.findByLabelText("amount error");
    expect(amountError).toHaveTextContent(/^Min: SCEUR 2.00$/);
  });

  it("successfully creates a withdraw request", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(responseWithBankAccount));
      })
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const withdrawButton = await screen.findByLabelText("withdraw button");
    const amount = screen.getByLabelText("amount");

    fireEvent(amount, "onChangeText", "10");

    await screen.findByLabelText("withdraw fees");
    await waitFor(() => expect(withdrawButton).toBeEnabled());

    fireEvent(withdrawButton, "onPress");

    const notification = await screen.findByLabelText("notification message");

    expect(
      within(notification).getByLabelText("notification message title")
    ).toHaveTextContent(/^Withdraw successful$/);
    expect(
      within(notification).getByLabelText("notification message description")
    ).toHaveTextContent(/^Withdrew SCEUR 10.00$/);
  });

  it("fails to create a new withdraw", async () => {
    const apiError: APIError = {
      Errors: [
        {
          Message: "Cannot withdraw",
          Code: ApiErrorCode.InternalServerError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(responseWithBankAccount));
      })
    );

    server.use(
      rest.post(
        `${backendApiUrl}/api/transactions/withdraws`,
        (_req, rest, ctx) => {
          return rest(ctx.status(400), ctx.json(apiError));
        }
      )
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const withdrawButton = await screen.findByLabelText("withdraw button");
    const amount = screen.getByLabelText("amount");

    fireEvent(amount, "onChangeText", "10");

    await screen.findByLabelText("total amount");
    await waitFor(() => expect(withdrawButton).toBeEnabled());

    fireEvent(withdrawButton, "onPress");

    const notification = await screen.findByLabelText("notification message");

    expect(
      within(notification).getByLabelText("notification message description")
    ).toHaveTextContent(/^Cannot withdraw$/);
  });

  it("does not create a withdraw if biometric check is not passed", async () => {
    (biometricValidation as jest.Mock).mockResolvedValue({
      result: "error",
      message: "Error message",
    });

    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(responseWithBankAccount));
      })
    );

    props = createTestProps({});
    render(<Withdraw {...props} />);

    const withdrawButton = await screen.findByLabelText("withdraw button");
    const amount = screen.getByLabelText("amount");

    fireEvent(amount, "onChangeText", "10");

    await screen.findByLabelText("withdraw fees");
    await waitFor(() => expect(withdrawButton).toBeEnabled());

    fireEvent(withdrawButton, "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Please complete biometric authentication$/);
  });
});
