import { render, screen, within } from "../../jest/test-utils";
import { formatDate } from "../../utils/dates";
import SummaryPaymentRequest from "../SummaryPaymentRequest";

describe("Summary payment request", () => {
  const expirationDate = formatDate(new Date(2099, 0, 1).toISOString());
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: jest.fn(),
    },
    route: {
      params: {
        amount: "10",
        canChangeAmount: false,
        stablecoin: "SCEUR",
        message: "Test",
        expiresOn: expirationDate,
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
    // TODO add again after feature is implemented
    // const shareButton = screen.getByLabelText("share");
    const closeButton = screen.getByLabelText("close");

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
    expect(messageValue).toHaveTextContent(/^Test$/);
    expect(expirationDateMessage).toHaveTextContent(/^Expires on$/);
    expect(expirationDateValue).toHaveTextContent(/^01\/01\/2099$/);
    expect(qrCode).toBeTruthy();
    // expect(shareButton).toBeTruthy();
    expect(closeButton).toBeTruthy();
  });

  it("displays a default message if none is specified", () => {
    props = createTestProps({
      route: {
        params: {
          amount: "10",
          canChangeAmount: false,
          stablecoin: "SCEUR",
        },
      },
    });
    render(<SummaryPaymentRequest {...props} />);

    const message = screen.getByLabelText("message");

    expect(within(message).getByLabelText("label")).toHaveTextContent(
      /^Message$/
    );
    expect(within(message).getByLabelText("value")).toHaveTextContent(
      /^Not specified$/
    );
  });

  it("displays the info text if amount can be changed by payer", async () => {
    props = createTestProps({
      route: {
        params: {
          amount: "10",
          canChangeAmount: true,
          stablecoin: "SCEUR",
        },
      },
    });
    render(<SummaryPaymentRequest {...props} />);

    const amountCanBeChangedText = await screen.findByLabelText(
      "amount can be changed"
    );

    expect(amountCanBeChangedText).toHaveTextContent(
      /^can be changed by payer$/
    );
  });
});
