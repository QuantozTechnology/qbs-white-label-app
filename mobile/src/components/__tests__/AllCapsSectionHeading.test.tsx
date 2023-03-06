import { render, screen } from "../../jest/test-utils";
import AllCapsSectionHeading from "../AllCapsSectionHeading";

describe("AllCapsSectionHeading", () => {
  it("shows the heading with the message prop passed", () => {
    render(<AllCapsSectionHeading text="Test heading" />);

    expect(screen.getByText("Test heading")).toBeTruthy();
  });
});
