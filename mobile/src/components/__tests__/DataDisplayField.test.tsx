import { render, screen } from "../../jest/test-utils";
import DataDisplayField from "../DataDisplayField";

describe("QRCode error", () => {
  it("should display the expected message", () => {
    render(<DataDisplayField label="Test label" value="Test value" />);

    const label = screen.getByLabelText("label");
    const value = screen.getByLabelText("value");

    expect(label).toHaveTextContent("Test label");
    expect(value).toHaveTextContent("Test value");
  });

  it("can receive accessibility props", () => {
    render(
      <DataDisplayField
        label="Test label"
        value="Test value"
        accessibilityLabel="test accessibility label"
      />
    );

    const accessibilityLabel = screen.getByLabelText(
      "test accessibility label"
    );

    expect(accessibilityLabel).toBeTruthy();
  });
});
