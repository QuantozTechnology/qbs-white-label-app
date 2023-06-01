import { Offer } from "../../api/offers/offers.interface";
import { mockOffers } from "../../api/offers/offers.mocks";
import { render, screen } from "../../jest/test-utils";
import OfferListItem from "../OfferListItem";

describe("OfferListItem", () => {
  it("shows expected values (buy offer)", () => {
    render(<OfferListItem offer={mockOffers.value[0]} />);

    expect(screen.getByLabelText("source action")).toHaveTextContent(/^Buy$/);
    expect(screen.getByLabelText("source amount")).toHaveTextContent(
      /^PLAT 500.00$/
    );
    expect(screen.getByLabelText("destination action")).toHaveTextContent(
      /^Sell$/
    );
    expect(screen.getByLabelText("destination amount")).toHaveTextContent(
      /^SCEUR 5.00$/
    );
  });

  it("shows expected values (sell offer)", () => {
    const mockSellOffer: Offer = JSON.parse(
      JSON.stringify(mockOffers.value[0])
    );
    mockSellOffer.action = "Sell";

    render(<OfferListItem offer={mockSellOffer} />);

    expect(screen.getByLabelText("source action")).toHaveTextContent(/^Sell$/);
    expect(screen.getByLabelText("source amount")).toHaveTextContent(
      /^SCEUR 5.00$/
    );
    expect(screen.getByLabelText("destination action")).toHaveTextContent(
      /^Buy$/
    );
    expect(screen.getByLabelText("destination amount")).toHaveTextContent(
      /^PLAT 500.00$/
    );
  });

  it("shows the partial badge if order is partially filled", () => {
    render(<OfferListItem offer={mockOffers.value[0]} />);

    expect(screen.getByLabelText("partial offer badge")).toBeOnTheScreen();
  });
});
