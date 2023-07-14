import { APIError, ApiErrorCode } from "../../api/generic/error.interface";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import { CreateOfferPayload } from "../../api/offers/offers.interface";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "../../jest/test-utils";
import ReviewCreatedOffer from "../ReviewCreatedOffer";

describe("ReviewCreatedOffer", () => {
  const mockOffer: CreateOfferPayload = {
    action: "Buy",
    destinationToken: {
      tokenCode: "GOLD",
      amount: "10.00",
    },
    options: {
      params: null,
      payerCanChangeRequestedAmount: false,
      memo: null,
      expiresOn: null,
      shareName: false,
      isOneOffPayment: false,
    },
    pricePerUnit: 1,
    offerCode: null,
    sourceToken: {
      tokenCode: "SCEUR",
      amount: "10.00",
    },
  };

  const mockParentReset = jest.fn();
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      getParent: jest.fn(() => {
        return {
          getState: jest.fn(() => {
            return {
              routeNames: ["Portfolio"],
            };
          }),
          reset: mockParentReset,
        };
      }),
    },
    route: {
      params: {
        offer: mockOffer,
      },
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("renders the expected fields on the screen", () => {
    props = createTestProps({});
    render(<ReviewCreatedOffer {...props} />);

    // top block for amount
    expect(
      screen.getByLabelText("review offer amount label")
    ).toHaveTextContent(/^Buy GOLD$/);
    expect(screen.getByLabelText("review offer amount")).toHaveTextContent(
      /^10.00$/
    );
    expect(screen.queryByLabelText("payer can change amount")).toBeNull();

    // other fields
    expect(
      within(screen.getByLabelText("price")).getByLabelText("label")
    ).toHaveTextContent(/^Price$/);
    expect(
      within(screen.getByLabelText("price")).getByLabelText("content")
    ).toHaveTextContent(/^1.00 SCEUR\/GOLD$/);

    expect(
      within(screen.getByLabelText("gross total")).getByLabelText("label")
    ).toHaveTextContent(/^Purchase$/);
    expect(
      within(screen.getByLabelText("gross total")).getByLabelText("content")
    ).toHaveTextContent(/^SCEUR 10.00$/);

    expect(
      within(screen.getByLabelText("fee")).getByLabelText("label")
    ).toHaveTextContent(/^Fee$/);
    expect(
      within(screen.getByLabelText("fee")).getByLabelText("content")
    ).toHaveTextContent(/^SCEUR 0.80$/);

    expect(
      within(screen.getByLabelText("net total")).getByLabelText("label")
    ).toHaveTextContent(/^Total$/);
    expect(
      within(screen.getByLabelText("net total")).getByLabelText("content")
    ).toHaveTextContent(/^SCEUR 10.80$/);

    expect(screen.getByLabelText("create offer")).toBeVisible();
  });

  it("handles error in offer creation", async () => {
    const apiError: APIError = {
      Errors: [
        {
          Message: "Cannot create offer",
          Code: ApiErrorCode.InternalServerError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.post(`${backendApiUrl}/api/offers`, (_req, rest, ctx) => {
        return rest(ctx.status(500), ctx.json(apiError));
      })
    );

    props = createTestProps({});
    render(<ReviewCreatedOffer {...props} />);

    const confirmButton = screen.getByLabelText("create offer");
    fireEvent(confirmButton, "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Cannot create offer$/);
  });

  it("handles successfull offer creation", async () => {
    props = createTestProps({});
    render(<ReviewCreatedOffer {...props} />);

    const confirmButton = screen.getByLabelText("create offer");
    fireEvent(confirmButton, "onPress");

    await waitFor(() => {
      expect(mockParentReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: "Portfolio" }],
      });
    });
    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Offer created successfully$/);
  });
});
