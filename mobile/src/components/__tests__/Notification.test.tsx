import { render, screen, within } from "../../jest/test-utils";
import Notification from "../Notification";

describe("Notification", () => {
  it("displays error message and icon", () => {
    render(<Notification message="this is an error message" variant="error" />);

    const notification = screen.getByLabelText("notification message");
    const icon = screen.getByRole("image");

    expect(
      within(notification).getByLabelText("notification message description")
    ).toHaveTextContent(/^this is an error message$/);
    expect(icon).toBeTruthy();
  });

  it("displays also the title if passed", () => {
    render(
      <Notification
        message="this is an error message"
        variant="error"
        title="Test title"
      />
    );

    const notification = screen.getByLabelText("notification message");
    const icon = screen.getByRole("image");

    expect(
      within(notification).getByLabelText("notification message description")
    ).toHaveTextContent(/^this is an error message$/);
    expect(
      within(notification).getByLabelText("notification message title")
    ).toHaveTextContent(/^Test title$/);
    expect(icon).toBeTruthy();
  });
});
