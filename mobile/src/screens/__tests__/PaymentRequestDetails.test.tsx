// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { PaymentRequestDetails as PaymentRequestDetailsType } from "../../api/paymentrequest/paymentRequest.interface";
import { paymentRequestMocksDefaultResponse } from "../../api/paymentrequest/paymentRequest.mocks";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import PaymentRequestDetails from "../PaymentRequestDetails";

describe("PaymentRequestDetails", () => {
  const mockNavigate = jest.fn();
  const mockSetOptions = jest.fn();
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: mockNavigate,
      setOptions: mockSetOptions,
    },
    route: {
      params: {
        details: {
          ...paymentRequestMocksDefaultResponse.value,
        },
      },
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("should render expected UI", async () => {
    props = createTestProps({});
    render(<PaymentRequestDetails {...props} />);

    expect(
      within(screen.getByLabelText("message")).getByLabelText("value")
    ).toHaveTextContent(/^Test message$/);
    expect(
      within(screen.getByLabelText("amount")).getByLabelText("value")
    ).toHaveTextContent(/^SCEUR 10.00$/);
    expect(
      within(screen.getByLabelText("expiration")).getByLabelText("value")
    ).toHaveTextContent(/^01\/01\/2099 - 13:35:04$/);
    expect(await screen.findByLabelText("paid to account")).toHaveTextContent(
      /^test-account-code$/
    );
    expect(screen.getByLabelText("my account badge")).toBeTruthy();
    expect(screen.getByLabelText("# payments")).toHaveTextContent(/^1$/);
    expect(screen.getByLabelText("total paid")).toHaveTextContent(
      /^Total: SCEUR 10.00$/
    );
    expect(screen.getByLabelText("my account badge")).toBeTruthy();
    expect(screen.getByLabelText("paid by section")).toBeTruthy();
    expect(screen.getByLabelText("share again")).toBeTruthy();
  });

  it("should render the 'Never' if the expiration date is null", async () => {
    const noExpirationDate: PaymentRequestDetailsType = {
      ...paymentRequestMocksDefaultResponse.value,
      options: {
        ...paymentRequestMocksDefaultResponse.value.options,
        expiresOn: null,
      },
    };

    props = createTestProps({
      route: {
        params: {
          details: noExpirationDate,
        },
      },
    });

    render(<PaymentRequestDetails {...props} />);

    expect(
      within(screen.getByLabelText("expiration")).getByLabelText("value")
    ).toHaveTextContent(/^Never$/);
  });

  it("should render the Expired badge if the expiration date is in the past", async () => {
    const expired: PaymentRequestDetailsType = {
      ...paymentRequestMocksDefaultResponse.value,
      options: {
        ...paymentRequestMocksDefaultResponse.value.options,
        expiresOn: 946681208000,
      },
    };

    props = createTestProps({
      route: {
        params: {
          details: expired,
        },
      },
    });

    render(<PaymentRequestDetails {...props} />);

    expect(screen.getByLabelText("expired badge")).toHaveTextContent(
      /^Expired$/
    );
  });

  it("should render 'Loading...' if accounts API is loading", async () => {
    props = createTestProps({});
    render(<PaymentRequestDetails {...props} />);

    expect(
      within(screen.getByLabelText("paid to field")).getByLabelText("value")
    ).toHaveTextContent(/^Loading...$/);
  });

  it("should not render 'Total paid' if there are no payments", async () => {
    const noPayments: PaymentRequestDetailsType = {
      ...paymentRequestMocksDefaultResponse.value,
      payments: [],
    };

    props = createTestProps({
      route: {
        params: {
          details: noPayments,
        },
      },
    });

    render(<PaymentRequestDetails {...props} />);

    expect(screen.queryByLabelText("total paid")).toBeNull();
  });

  it("should not render 'Share again' button if payment request has expired", async () => {
    const expired: PaymentRequestDetailsType = {
      ...paymentRequestMocksDefaultResponse.value,
      options: {
        ...paymentRequestMocksDefaultResponse.value.options,
        expiresOn: 946681208000,
      },
    };

    props = createTestProps({
      route: {
        params: {
          details: expired,
        },
      },
    });

    render(<PaymentRequestDetails {...props} />);

    expect(screen.queryByLabelText("share again")).toBeNull();
  });

  it("navigates to SummaryPaymentRequest if share again button is tapped", async () => {
    props = createTestProps({});
    render(<PaymentRequestDetails {...props} />);
    const shareAgainButton = screen.queryByLabelText("share again");

    fireEvent(shareAgainButton, "onPress");

    expect(mockNavigate).toHaveBeenCalledWith("SummaryPaymentRequest", {
      code: "payment-request-code",
    });
  });

  it("should not show the cancel button if request is expired", async () => {
    const today = new Date();
    const yesterday = new Date(today).setDate(today.getDate() - 1);

    props = createTestProps({
      route: {
        params: {
          details: {
            ...paymentRequestMocksDefaultResponse.value,
            options: {
              ...paymentRequestMocksDefaultResponse.value.options,
              expiresOn: yesterday,
            },
          },
        },
      },
    });
    render(<PaymentRequestDetails {...props} />);

    expect(screen.queryByLabelText("cancel payment request")).toBeNull();
  });
  it("should show the cancel button if expiresOn is null", () => {
    props = createTestProps({
      route: {
        params: {
          details: {
            ...paymentRequestMocksDefaultResponse.value,
            options: {
              ...paymentRequestMocksDefaultResponse.value.options,
              expiresOn: null,
            },
          },
        },
      },
    });
    render(<PaymentRequestDetails {...props} />);

    expect(screen.queryByLabelText("cancel payment request")).toBeNull();
  });
});
