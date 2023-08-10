import { Tokens } from "../../api/tokens/tokens.interface";
import { tokensMock } from "../../api/tokens/tokens.mocks";
import { mockUseNavigationNavigate, mockUseRoute } from "../../jest/jest.setup";
import { fireEvent, render, screen } from "../../jest/test-utils";
import TokenListItem from "../TokenListItem";

describe("TokenListItem", () => {
  it("shows expected UI for available token", () => {
    render(<TokenListItem token={tokensMock.value[0]} />);

    expect(screen.getByLabelText("see token details")).toBeVisible();
    expect(screen.getByLabelText("token name and code")).toHaveTextContent(
      "Copper (COPR)"
    );
    expect(screen.queryByLabelText("token balance")).toBeNull();
  });

  it("shows expected UI for owned token", () => {
    const mockOwnedToken: Tokens = JSON.parse(
      JSON.stringify(tokensMock.value[0])
    );
    mockOwnedToken.balance = "100.00";

    render(<TokenListItem token={mockOwnedToken} />);

    expect(screen.getByLabelText("see token details")).toBeVisible();
    expect(screen.getByLabelText("token name and code")).toHaveTextContent(
      "Copper (COPR)"
    );
    expect(screen.getByLabelText("token balance")).toHaveTextContent("100.00");
  });

  it("navigates to the details page if the detaisl button is pressed", () => {
    render(<TokenListItem token={tokensMock.value[0]} />);

    fireEvent(screen.getByLabelText("see token details"), "onPress");

    expect(mockUseNavigationNavigate).toHaveBeenCalledWith("TokenDetails", {
      tokenCode: "COPR",
    });
  });

  it("navigates back to the create buy offer, if that was the previous screen", () => {
    mockUseRoute.mockReturnValue({
      params: { sourceScreen: "CreateBuyOffer" },
    });
    render(<TokenListItem token={tokensMock.value[0]} />);

    fireEvent(screen.getByLabelText("token list item"), "onPress");

    expect(mockUseNavigationNavigate).toHaveBeenCalledWith(
      "CreateOfferTabStack",
      {
        params: {
          params: {
            token: {
              balance: null,
              code: "COPR",
              issuerAddress: "0xabcdefghijkmnop",
              name: "Copper",
              status: "Active",
            },
          },
          screen: "CreateBuyOffer",
        },
        screen: "CreateBuyOfferStack",
      }
    );
  });

  it("navigates back to the create sell offer, if that was the previous screen", () => {
    mockUseRoute.mockReturnValue({
      params: { sourceScreen: "CreateSellOffer" },
    });

    render(<TokenListItem token={tokensMock.value[0]} />);

    fireEvent(screen.getByLabelText("token list item"), "onPress");

    expect(mockUseNavigationNavigate).toHaveBeenCalledWith(
      "CreateOfferTabStack",
      {
        params: {
          params: {
            token: {
              balance: null,
              code: "COPR",
              issuerAddress: "0xabcdefghijkmnop",
              name: "Copper",
              status: "Active",
            },
          },
          screen: "CreateSellOffer",
        },
        screen: "CreateSellOfferStack",
      }
    );
  });
});
