import { mockOffers } from "../../api/offers/offers.mocks";
import { mockNavigation } from "../../jest/jest.setup";
import OfferDetails from "../OfferDetails";
import { render, screen, within } from "../../jest/test-utils";
import { Offer } from "../../api/offers/offers.interface";

describe("OfferDetails", () => {
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      ...mockNavigation,
    },
    route: {
      params: {
        offer: mockOffers.value[0],
        offerStatus: "Open",
      },
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  describe("Buy offer", () => {
    it("shows the expected fields and values", () => {
      props = createTestProps({});
      render(<OfferDetails {...props} />);

      expect(screen.getByLabelText("primary text")).toHaveTextContent(/^PLAT$/);
      expect(screen.getByLabelText("secondary text")).toHaveTextContent(
        /^500.000$/
      );
      expect(
        within(screen.getByLabelText("order filled")).getByLabelText("label")
      ).toHaveTextContent(/^Order filled$/);
      expect(
        within(screen.getByLabelText("order filled")).getByLabelText("content")
      ).toHaveTextContent(/^100.000\/500.000$/);
      expect(
        within(screen.getByLabelText("price")).getByLabelText("label")
      ).toHaveTextContent(/^Price$/);
      expect(
        within(screen.getByLabelText("price")).getByLabelText("content")
      ).toHaveTextContent(/^0.2 SCEUR\/PLAT$/);
      expect(
        within(screen.getByLabelText("fee")).getByLabelText("label")
      ).toHaveTextContent(/^Fee$/);
      expect(
        within(screen.getByLabelText("fee")).getByLabelText("content")
      ).toHaveTextContent(/^SCEUR 0.80$/);
      expect(
        within(screen.getByLabelText("total")).getByLabelText("label")
      ).toHaveTextContent(/^Total to be paid$/);
      expect(
        within(screen.getByLabelText("total")).getByLabelText("content")
      ).toHaveTextContent(/^SCEUR 100.80$/);
    });
  });

  describe("Sell offer", () => {
    it("shows the expected fields and values", () => {
      const sellOffer: Offer = JSON.parse(JSON.stringify(mockOffers.value[0]));
      sellOffer.action = "Sell";
      sellOffer.status = "Open";
      sellOffer.sourceToken = {
        tokenCode: "GOLD",
        totalAmount: "10.000",
        remainingAmount: "10.000",
      };
      sellOffer.destinationToken = {
        tokenCode: "SCEUR",
        totalAmount: "100.000",
        remainingAmount: null,
      };

      props = createTestProps({
        route: {
          params: {
            offer: sellOffer,
            offerStatus: "Open",
          },
        },
      });
      render(<OfferDetails {...props} />);

      expect(screen.getByLabelText("primary text")).toHaveTextContent(/^GOLD$/);
      expect(screen.getByLabelText("secondary text")).toHaveTextContent(
        /^10.000$/
      );
      expect(screen.queryByLabelText("order filled")).toBeNull();
      expect(
        within(screen.getByLabelText("price")).getByLabelText("label")
      ).toHaveTextContent(/^Price$/);
      expect(
        within(screen.getByLabelText("price")).getByLabelText("content")
      ).toHaveTextContent(/^10.00 SCEUR\/GOLD$/);
      expect(
        within(screen.getByLabelText("fee")).getByLabelText("label")
      ).toHaveTextContent(/^Fee$/);
      expect(
        within(screen.getByLabelText("fee")).getByLabelText("content")
      ).toHaveTextContent(/^SCEUR 0.80$/);
      expect(
        within(screen.getByLabelText("total")).getByLabelText("label")
      ).toHaveTextContent(/^Total to receive$/);
      expect(
        within(screen.getByLabelText("total")).getByLabelText("content")
      ).toHaveTextContent(/^SCEUR 99.200$/);
    });
  });
});
