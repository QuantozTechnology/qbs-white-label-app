// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { PaymentRequestResponse } from "../../api/paymentrequest/paymentRequest.interface";
import { paymentRequestMocksDefaultResponse } from "../../api/paymentrequest/paymentRequest.mocks";
import { render, screen, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import SummaryPaymentRequest from "../SummaryPaymentRequest";

describe("Summary payment request", () => {
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: jest.fn(),
    },
    route: {
      params: {
        code: "payment-request-code",
      },
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("should display the expected initial state of the screen", async () => {
    props = createTestProps({});
    render(<SummaryPaymentRequest {...props} />);

    const qrCode = await screen.findByLabelText("qrCode");
    const shareButton = screen.getByLabelText("share");

    const amountLabel = within(
      await screen.findByLabelText("amount")
    ).getByLabelText("label");
    const amountValue = within(
      await screen.findByLabelText("amount")
    ).getByLabelText("value");
    const messageLabel = within(
      await screen.findByLabelText("message")
    ).getByLabelText("label");
    const messageValue = within(
      await screen.findByLabelText("message")
    ).getByLabelText("value");
    const expirationDateMessage = within(
      await screen.findByLabelText("expires on")
    ).getByLabelText("label");
    const expirationDateValue = within(
      await screen.findByLabelText("expires on")
    ).getByLabelText("value");

    expect(amountLabel).toHaveTextContent(/^Amount$/);
    expect(amountValue).toHaveTextContent(/^SCEUR 10.00$/);
    expect(messageLabel).toHaveTextContent(/^Message$/);
    expect(messageValue).toHaveTextContent(/^Test message$/);
    expect(expirationDateMessage).toHaveTextContent(/^Expires on$/);
    expect(expirationDateValue).toHaveTextContent(/^01\/01\/2099 - 13:35:04$/);
    expect(qrCode).toBeTruthy();
    expect(shareButton).toBeTruthy();
  });

  it("displays a default message if none is specified", async () => {
    const noMessageResponse: PaymentRequestResponse = {
      value: {
        ...paymentRequestMocksDefaultResponse.value,
        options: {
          ...paymentRequestMocksDefaultResponse.value.options,
          memo: null,
        },
      },
    };

    server.use(
      rest.get(
        `${backendApiUrl}/api/paymentrequests/:code`,
        (_req, rest, ctx) => {
          return rest(
            ctx.status(200),
            ctx.json<PaymentRequestResponse>(noMessageResponse)
          );
        }
      )
    );

    props = createTestProps({});
    render(<SummaryPaymentRequest {...props} />);

    const message = await screen.findByLabelText("message");

    expect(within(message).getByLabelText("label")).toHaveTextContent(
      /^Message$/
    );
    expect(within(message).getByLabelText("value")).toHaveTextContent(
      /^Not specified$/
    );
  });

  it("displays the info text if amount can be changed by payer", async () => {
    const amountCanBeChangedResponse: PaymentRequestResponse = {
      value: {
        ...paymentRequestMocksDefaultResponse.value,
        options: {
          ...paymentRequestMocksDefaultResponse.value.options,
          payerCanChangeRequestedAmount: true,
        },
      },
    };

    server.use(
      rest.get(
        `${backendApiUrl}/api/paymentrequests/:code`,
        (_req, rest, ctx) => {
          return rest(
            ctx.status(200),
            ctx.json<PaymentRequestResponse>(amountCanBeChangedResponse)
          );
        }
      )
    );

    props = createTestProps({});
    render(<SummaryPaymentRequest {...props} />);

    const amountCanBeChangedText = await screen.findByLabelText(
      "amount can be changed"
    );

    expect(amountCanBeChangedText).toHaveTextContent(
      /^can be changed by payer$/
    );
  });
});
