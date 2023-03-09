// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { render, screen, fireEvent } from "../../jest/test-utils";
import DocumentTypeOption from "../DocumentTypeOption";

describe("DocumentTypeOption", () => {
  const mockSetSelected = jest.fn();

  it("should show the correct UI for the selected option", async () => {
    render(
      <DocumentTypeOption
        id="id"
        label="Test label"
        selected="id"
        setSelected={mockSetSelected}
      />
    );

    const typeOption = screen.getByLabelText("document type option");
    const icon = await screen.findByLabelText("selected option icon");
    const label = screen.getByLabelText("label");

    expect(typeOption).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(label).toHaveTextContent("Test label");
  });

  it("should show the correct UI for the non-selected option", async () => {
    render(
      <DocumentTypeOption
        id="id"
        label="Test label"
        selected="passport"
        setSelected={mockSetSelected}
      />
    );

    const typeOption = screen.getByLabelText("document type option");
    const icon = await screen.findByLabelText("not selected option icon");
    const label = screen.getByLabelText("label");

    expect(typeOption).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(label).toHaveTextContent("Test label");
  });

  it("should react on the onPress by making the item selected", async () => {
    render(
      <DocumentTypeOption
        id="id"
        label="Test label"
        selected="passport"
        setSelected={mockSetSelected}
      />
    );

    const typeOption = screen.getByLabelText("document type option");
    fireEvent(typeOption, "onPress");

    expect(mockSetSelected).toHaveBeenCalledWith("id");
  });
});
