import { render, screen, within } from "../../jest/test-utils";
import Settings from "../Settings";

describe("Settings", () => {
  it("shows the expected elements of the page", () => {
    render(<Settings />);

    const supportEntry = screen.getByLabelText("support");
    const termsEntry = screen.getByLabelText("terms");

    expect(supportEntry).toBeOnTheScreen();
    expect(termsEntry).toBeOnTheScreen();

    expect(within(supportEntry).getByLabelText("label")).toHaveTextContent(
      /^Contact support$/
    );
    expect(within(supportEntry).getByLabelText("value")).toHaveTextContent(
      /^support@quantozpayments.com$/
    );
    expect(within(termsEntry).getByLabelText("label")).toHaveTextContent(
      /^How it works$/
    );
    expect(within(termsEntry).getByLabelText("value")).toHaveTextContent(
      /^Terms and conditions$/
    );
  });
});
