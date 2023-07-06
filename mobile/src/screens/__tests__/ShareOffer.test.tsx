import { Share } from "react-native";
import { Offer } from "../../api/offers/offers.interface";
import { mockOffers } from "../../api/offers/offers.mocks";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import ShareOffer from "../ShareOffer";

describe("ShareOffer", () => {
  const mockNavigate = jest.fn();
  const mockOffer: Offer = mockOffers.value[0];
  const createTestProps = (props: Record<string, unknown>) => {
    return {
      navigation: {
        navigate: mockNavigate,
      },
      route: {
        params: {
          offer: {
            ...mockOffer,
          },
        },
      },
      ...props,
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("displays the info passed in the props and other UI elements", () => {
    props = createTestProps({});
    render(<ShareOffer {...props} />);

    expect(screen.getByLabelText("primary text")).toHaveTextContent(
      /^Buy PLAT$/
    );
    expect(screen.getByLabelText("secondary text")).toHaveTextContent(
      /^500.000$/
    );
    expect(
      within(screen.getByLabelText("total")).getByLabelText("label")
    ).toHaveTextContent(/^Total to be paid$/);
    expect(
      within(screen.getByLabelText("total")).getByLabelText("content")
    ).toHaveTextContent(/^SCEUR 100.80$/);
    expect(screen.getByLabelText("qrCode")).toBeVisible();
    expect(screen.getByLabelText("share")).toBeVisible();
  });

  it("shows the share OS overlay when user presses the share button", () => {
    const shareSpy = jest.spyOn(Share, "share");

    props = createTestProps({});
    render(<ShareOffer {...props} />);

    const shareButton = screen.getByLabelText("share");
    fireEvent(shareButton, "onPress");

    // expect(mockNavigate).toHaveBeenCalledWith("asd");
    expect(shareSpy).toHaveBeenCalledWith({
      message:
        "Hi, I've created a Buy offer for SCEUR 100.80. You can confirm it through the Quantoz Blockchain Solutions (QBS) app by tapping the following link. Thanks! http://test.com/deeplinks/offers/test",
    });
  });
});
