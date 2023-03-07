import { fireEvent, render, screen } from "../../jest/test-utils";
import ActionButton from "../ActionButton";

describe("ActionButton", () => {
  const iconName = "plus";
  const label = "Add";
  test("renders icon and label correctly", async () => {
    render(
      <ActionButton
        iconName={iconName}
        label={label}
        onPressCallback={jest.fn()}
      />
    );

    expect(await screen.findByLabelText("action button icon")).toBeTruthy();
    expect(
      await screen.findByLabelText("action button label")
    ).toHaveTextContent(/^Add$/);
  });

  test("calls onPressCallback when pressed", async () => {
    const onPressCallback = jest.fn();
    render(
      <ActionButton
        iconName={iconName}
        label={label}
        onPressCallback={onPressCallback}
      />
    );

    fireEvent.press(await screen.findByLabelText("action button"));

    expect(onPressCallback).toHaveBeenCalled();
  });
});
