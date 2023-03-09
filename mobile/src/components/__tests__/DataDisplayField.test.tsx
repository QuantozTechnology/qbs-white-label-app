// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
