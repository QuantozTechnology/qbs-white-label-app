import { Offer } from "../../api/offers/offers.interface";
import { mockOffers } from "../../api/offers/offers.mocks";
import { render, screen } from "../../jest/test-utils";
import OfferListItem from "../OfferListItem";

describe("OfferListItem", () => {
  it("shows expected values (buy offer)", () => {
    render(<OfferListItem offer={mockOffers.value[0]} offerStatus="Open" />);

    expect(screen.getByLabelText("source action")).toHaveTextContent(/^Buy$/);
    expect(screen.getByLabelText("source amount")).toHaveTextContent(
      /^PLAT 500.000$/
    );
    expect(screen.getByLabelText("destination action")).toHaveTextContent(
      /^Sell$/
    );
    expect(screen.getByLabelText("destination amount")).toHaveTextContent(
      /^SCEUR 100.00$/
    );
  });

  it("shows expected values (sell offer)", () => {
    const mockSellOffer: Offer = JSON.parse(
      JSON.stringify(mockOffers.value[0])
    );
    mockSellOffer.action = "Sell";

    render(<OfferListItem offer={mockSellOffer} offerStatus="Open" />);

    expect(screen.getByLabelText("source action")).toHaveTextContent(/^Sell$/);
    expect(screen.getByLabelText("source amount")).toHaveTextContent(
      /^SCEUR 100.00$/
    );
    expect(screen.getByLabelText("destination action")).toHaveTextContent(
      /^Buy$/
    );
    expect(screen.getByLabelText("destination amount")).toHaveTextContent(
      /^PLAT 500.000$/
    );
  });

  it("shows the partial badge if order is partially filled", () => {
    render(<OfferListItem offer={mockOffers.value[0]} offerStatus="Open" />);

    expect(screen.getByLabelText("partial offer badge")).toBeOnTheScreen();
  });
});
