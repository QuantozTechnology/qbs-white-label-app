// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { rest } from "msw";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";
import { PaymentRequestResponse } from "../../api/paymentrequest/paymentRequest.interface";
import { paymentRequestMocksDefaultResponse } from "../../api/paymentrequest/paymentRequest.mocks";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import SendSummary from "../SendSummary";
import { biometricValidation } from "../../utils/biometric";

const mockedNavigationReset = jest.fn();
const mockedNavigate = jest.fn();

describe("SendSummary", () => {
  const initialRouteParams = {
    code: "payment-request-code",
  };

  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      getParent: () => ({
        navigate: mockedNavigate,
        reset: mockedNavigationReset,
      }),
    },
    route: {
      params: initialRouteParams,
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("should display all the expected UI elements", async () => {
    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });
    render(<SendSummary {...props} />);

    const amount = await screen.findByLabelText("editable amount");
    const expires = screen.queryByLabelText("expires");
    const message = screen.getByLabelText("message");
    const name = screen.getByLabelText("name");
    const sendButton = screen.getByLabelText("send");

    expect(amount).toBeTruthy();
    expect(amount.props.value).toBeUndefined();

    expect(expires).toBeTruthy();
    expect(within(expires).getByLabelText("label")).toHaveTextContent(
      /^Expires on$/
    );
    expect(within(expires).getByLabelText("value")).toHaveTextContent(
      /^01\/01\/2099 - 13:35:04$/
    );

    expect(message).toBeTruthy();
    expect(within(message).getByLabelText("label")).toHaveTextContent(
      /^Message$/
    );
    expect(within(message).getByLabelText("value")).toHaveTextContent(
      /^Test message$/
    );

    expect(name).toBeTruthy();
    expect(within(name).getByLabelText("label")).toHaveTextContent(/^Name$/);
    expect(within(name).getByLabelText("value")).toHaveTextContent(
      /^John Doe$/
    );

    expect(sendButton).toBeTruthy();
  });

  it("should show the amount as non-editable", async () => {
    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });

    const cannotChangeAmountResponse: PaymentRequestResponse = JSON.parse(
      JSON.stringify(paymentRequestMocksDefaultResponse)
    );
    cannotChangeAmountResponse.value.options.payerCanChangeRequestedAmount =
      false;

    server.use(
      rest.get(
        `${backendApiUrl}/api/paymentrequests/:code`,
        (req, rest, ctx) => {
          return rest(ctx.status(200), ctx.json(cannotChangeAmountResponse));
        }
      )
    );

    render(<SendSummary {...props} />);

    expect(await screen.findByLabelText("non-editable amount")).toBeTruthy();
  });

  it("should show the insufficient balance error for the non-editable amount", async () => {
    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });

    const highAmount: PaymentRequestResponse = JSON.parse(
      JSON.stringify(paymentRequestMocksDefaultResponse)
    );
    // amount higher than balance
    highAmount.value.requestedAmount = 10000;
    highAmount.value.options.payerCanChangeRequestedAmount = false;

    server.use(
      rest.get(
        `${backendApiUrl}/api/paymentrequests/:code`,
        (req, rest, ctx) => {
          return rest(ctx.status(200), ctx.json(highAmount));
        }
      )
    );

    render(<SendSummary {...props} />);

    const sendButton = await screen.findByLabelText("send");

    fireEvent(sendButton, "onPress");

    expect(await screen.findByLabelText("amount errors")).toHaveTextContent(
      /^Amount greater than your balance$/
    );

    // show also the hint to add funds and button to redirect to funding screen
    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(
      /^You should first fund your account before being able to proceed with this payment$/
    );
    const addFundsButton = screen.getByLabelText("add funds");
    expect(addFundsButton).toBeTruthy();

    fireEvent(addFundsButton, "onPress");

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith("Funding"));
  });

  it("should show the not-owned token error for the non-editable amount", async () => {
    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });

    const tokenError: PaymentRequestResponse = JSON.parse(
      JSON.stringify(paymentRequestMocksDefaultResponse)
    );
    tokenError.value.tokenCode = "TEST";
    tokenError.value.options.payerCanChangeRequestedAmount = false;

    server.use(
      rest.get(
        `${backendApiUrl}/api/paymentrequests/:code`,
        (req, rest, ctx) => {
          return rest(ctx.status(200), ctx.json(tokenError));
        }
      )
    );

    render(<SendSummary {...props} />);

    const sendButton = await screen.findByLabelText("send");

    fireEvent(sendButton, "onPress");

    expect(await screen.findByLabelText("amount errors")).toHaveTextContent(
      /^You do not own any TEST token$/
    );
  });

  it("should show the insufficient balance error for the editable amount", async () => {
    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });

    const highAmount: PaymentRequestResponse = JSON.parse(
      JSON.stringify(paymentRequestMocksDefaultResponse)
    );
    highAmount.value.requestedAmount = 10000;

    server.use(
      rest.get(
        `${backendApiUrl}/api/paymentrequests/:code`,
        (req, rest, ctx) => {
          return rest(ctx.status(200), ctx.json(highAmount));
        }
      )
    );

    render(<SendSummary {...props} />);

    const sendButton = await screen.findByLabelText("send");

    fireEvent(sendButton, "onPress");

    expect(await screen.findByLabelText("amount errors")).toHaveTextContent(
      /^Amount greater than your balance$/
    );

    // show also the hint to add funds and button to redirect to funding screen
    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(
      /^You should first fund your account before being able to proceed with this payment$/
    );
    const addFundsButton = screen.getByLabelText("add funds");
    expect(addFundsButton).toBeTruthy();

    fireEvent(addFundsButton, "onPress");

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith("Funding"));
  });

  it("should show the not-owned token error for the editable amount", async () => {
    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });

    const tokenError: PaymentRequestResponse = JSON.parse(
      JSON.stringify(paymentRequestMocksDefaultResponse)
    );
    tokenError.value.tokenCode = "TEST";

    server.use(
      rest.get(
        `${backendApiUrl}/api/paymentrequests/:code`,
        (req, rest, ctx) => {
          return rest(ctx.status(200), ctx.json(tokenError));
        }
      )
    );

    render(<SendSummary {...props} />);

    const sendButton = await screen.findByLabelText("send");

    fireEvent(sendButton, "onPress");

    expect(await screen.findByLabelText("amount errors")).toHaveTextContent(
      /^You do not own any TEST token$/
    );
  });

  it("should show an error if the GET /paymentrequests/:code API is not reachable", async () => {
    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });

    server.use(
      rest.get(
        `${backendApiUrl}/api/paymentrequests/:code`,
        (req, rest, ctx) => {
          return rest(ctx.status(400));
        }
      )
    );

    render(<SendSummary {...props} />);

    expect(
      await screen.findByLabelText("full screen message title")
    ).toHaveTextContent(/^Error$/);
    expect(
      await screen.findByLabelText("full screen message description")
    ).toHaveTextContent(/^Could not scan payment request, try again later$/);
  });

  it("should show an error if the GET /balances API is not reachable", async () => {
    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });

    server.use(
      rest.get(`${backendApiUrl}/api/accounts/balances`, (req, rest, ctx) => {
        return rest(ctx.status(400));
      })
    );

    render(<SendSummary {...props} />);

    expect(
      await screen.findByLabelText("full screen message title")
    ).toHaveTextContent(/^Error$/);
    expect(
      await screen.findByLabelText("full screen message description")
    ).toHaveTextContent(/^Could not scan payment request, try again later$/);
  });

  it("should succeed the payment and go back to Portfolio", async () => {
    (biometricValidation as jest.Mock).mockResolvedValueOnce({
      result: "success",
    });

    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });
    render(<SendSummary {...props} />);

    const sendButton = await screen.findByLabelText("send");

    fireEvent(sendButton, "onPress");

    expect(
      await screen.findByLabelText("notification message title")
    ).toHaveTextContent(/^Payment successful$/);
    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Paid SCEUR 10.00$/);
    await waitFor(() =>
      expect(mockedNavigationReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: "Portfolio" }],
      })
    );
  });

  it("should not allow payment to go on if POST payments API error", async () => {
    (biometricValidation as jest.Mock).mockResolvedValueOnce({
      result: "success",
    });

    const balancesApiError: APIError = {
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
        `${backendApiUrl}/api/transactions/payments/pay/paymentrequest`,
        (_req, rest, ctx) => {
          return rest(ctx.status(400), ctx.json(balancesApiError));
        }
      )
    );

    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });

    render(<SendSummary {...props} />);

    const sendButton = await screen.findByLabelText("send");
    fireEvent(sendButton, "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Cannot create payment$/);
  });

  it("should not allow payment to go on biometric check does not pass", async () => {
    (biometricValidation as jest.Mock).mockResolvedValue({
      result: "error",
      message: "Error message",
    });

    props = createTestProps({
      route: {
        params: {
          ...initialRouteParams,
        },
      },
    });

    render(<SendSummary {...props} />);

    const sendButton = await screen.findByLabelText("send");
    fireEvent(sendButton, "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Please complete biometric authentication$/);
  });
});
