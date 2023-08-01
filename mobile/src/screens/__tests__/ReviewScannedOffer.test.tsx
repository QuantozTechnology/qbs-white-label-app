import { rest } from "msw";
import { genericApiError } from "../../api/generic/error.interface";
import { Offer, OfferResponse } from "../../api/offers/offers.interface";
import { mockBuyOffer, mockSellOffer } from "../../api/offers/offers.mocks";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl, mockApiUrl } from "../../utils/axios";
import ReviewScannedOffer from "../ReviewScannedOffer";

const mockPopToTop = jest.fn();

const createTestProps = (props: Record<string, unknown>) => ({
  navigation: {
    popToTop: mockPopToTop,
  },
  route: {
    params: {},
  },
  ...props,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let props: any;

describe("ReviewScannedOffer screen", () => {
  it("fetches buy offer successfully and displays expected UI", async () => {
    props = createTestProps({});
    render(<ReviewScannedOffer {...props} />);

    expect(
      await screen.findByLabelText("review offer amount label")
    ).toHaveTextContent("Buy PLAT");
    expect(
      await screen.findByLabelText("review offer amount")
    ).toHaveTextContent("500.000");
    expect(
      within(await screen.findByLabelText("initiator")).getByLabelText("label")
    ).toHaveTextContent("Seller");
    expect(
      within(await screen.findByLabelText("initiator")).getByLabelText(
        "content"
      )
    ).toHaveTextContent("test-cust");
    expect(
      within(await screen.findByLabelText("price")).getByLabelText("label")
    ).toHaveTextContent("Price");
    expect(
      within(await screen.findByLabelText("price")).getByLabelText("content")
    ).toHaveTextContent("0.2 SCEUR/PLAT");
    expect(
      within(await screen.findByLabelText("offer value")).getByLabelText(
        "label"
      )
    ).toHaveTextContent("Purchase value");
    expect(
      within(await screen.findByLabelText("offer value")).getByLabelText(
        "content"
      )
    ).toHaveTextContent("SCEUR 100.00");
    expect(
      within(await screen.findByLabelText("fee")).getByLabelText("label")
    ).toHaveTextContent("Fee");
    expect(
      within(await screen.findByLabelText("fee")).getByLabelText("content")
    ).toHaveTextContent("SCEUR 0.80");
    expect(
      within(await screen.findByLabelText("total")).getByLabelText("label")
    ).toHaveTextContent("Total to be paid");
    expect(
      within(await screen.findByLabelText("total")).getByLabelText("content")
    ).toHaveTextContent("SCEUR 100.80");
    expect(await screen.findByLabelText("confirm offer")).toBeOnTheScreen();
  });

  it("shows the right UI for a sell offer", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/offers/:offerCode`, (_req, rest, ctx) => {
        return rest(
          ctx.status(200),
          ctx.json<OfferResponse>({ value: mockSellOffer })
        );
      })
    );

    props = createTestProps({});
    render(<ReviewScannedOffer {...props} />);

    expect(
      await screen.findByLabelText("review offer amount label")
    ).toHaveTextContent("Sell PLAT");
    expect(
      await screen.findByLabelText("review offer amount")
    ).toHaveTextContent("1000.00");
    expect(
      within(await screen.findByLabelText("initiator")).getByLabelText("label")
    ).toHaveTextContent("Buyer");
    expect(
      within(await screen.findByLabelText("initiator")).getByLabelText(
        "content"
      )
    ).toHaveTextContent("test-cust");
    expect(
      within(await screen.findByLabelText("price")).getByLabelText("label")
    ).toHaveTextContent("Price");
    expect(
      within(await screen.findByLabelText("price")).getByLabelText("content")
    ).toHaveTextContent("10.0 SCEUR/PLAT");
    expect(
      within(await screen.findByLabelText("offer value")).getByLabelText(
        "label"
      )
    ).toHaveTextContent("Sell value");
    expect(
      within(await screen.findByLabelText("offer value")).getByLabelText(
        "content"
      )
    ).toHaveTextContent("SCEUR 10000.00");
    expect(
      within(await screen.findByLabelText("fee")).getByLabelText("label")
    ).toHaveTextContent("Fee");
    expect(
      within(await screen.findByLabelText("fee")).getByLabelText("content")
    ).toHaveTextContent("SCEUR 0.80");
    expect(
      within(await screen.findByLabelText("total")).getByLabelText("label")
    ).toHaveTextContent("Total to receive");
    expect(
      within(await screen.findByLabelText("total")).getByLabelText("content")
    ).toHaveTextContent("SCEUR 9999.20");
  });
  it("shows error message if offer cannot be fetched", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/offers/:offerCode`, (_req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json(genericApiError));
      })
    );

    props = createTestProps({});
    render(<ReviewScannedOffer {...props} />);

    expect(
      await screen.findByLabelText("full screen message description")
    ).toHaveTextContent("Error loading the offer");
  });

  it("confirms an offer successfully", async () => {
    props = createTestProps({});
    render(<ReviewScannedOffer {...props} />);

    const confirmButton = await screen.findByLabelText("confirm offer");
    fireEvent(confirmButton, "onPress");

    expect(
      await screen.findByLabelText("notification message title")
    ).toHaveTextContent("Offer confirmed");
    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent("Buy value: SCEUR 500.00");
    expect(mockPopToTop).toHaveBeenCalled();
  });

  it("fails to confirm an offer due to API error", async () => {
    server.use(
      rest.post(`${mockApiUrl}/api/offers/confirm`, (_req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json(genericApiError));
      })
    );

    props = createTestProps({});
    render(<ReviewScannedOffer {...props} />);

    const confirmButton = await screen.findByLabelText("confirm offer");
    fireEvent(confirmButton, "onPress");

    expect(
      await screen.findByLabelText("notification message title")
    ).toHaveTextContent("Error");
    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent("Error");
  });
});

describe("ReviewScannedOffer - changeable amount", () => {
  const canChangeAmountOffer: Offer = JSON.parse(JSON.stringify(mockBuyOffer));
  canChangeAmountOffer.options.payerCanChangeRequestedAmount = true;

  beforeEach(() => {
    server.use(
      rest.get(`${backendApiUrl}/api/offers/:offerCode`, (_req, rest, ctx) => {
        return rest(
          ctx.status(200),
          ctx.json<OfferResponse>({ value: canChangeAmountOffer })
        );
      })
    );
  });

  it("shows input to change the amount if allowed by initiator", async () => {
    props = createTestProps({});
    render(<ReviewScannedOffer {...props} />);

    expect(await screen.findByLabelText("changeable amount")).toBeOnTheScreen();
    expect(
      await screen.findByLabelText("payer can change amount")
    ).toBeOnTheScreen();
  });

  it("does not allow to create an offer if changeable amount is greater than balance", async () => {
    props = createTestProps({});
    render(<ReviewScannedOffer {...props} />);

    const inputField = await screen.findByLabelText("changeable amount");
    fireEvent(inputField, "onChangeText", "10000");

    expect(
      await screen.findByLabelText("payer can change amount error")
    ).toBeOnTheScreen();
    expect(await screen.findByLabelText("confirm offer")).toBeDisabled();
  });
});
