// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import ActionButtonsBar from "../ActionButtonsBar";
import { fireEvent, render, screen } from "../../jest/test-utils";
import { mockUseNavigationNavigate } from "../../jest/jest.setup";

describe("ActionButtonsBar", () => {
  it("renders correctly", async () => {
    render(<ActionButtonsBar />);
    expect(await screen.findByLabelText("action buttons")).toBeTruthy();
    expect(screen.getAllByLabelText("action button")).toHaveLength(4);
  });

  it("navigates to correct screen when buttons are pressed", async () => {
    render(<ActionButtonsBar />);

    const actionButtons = await screen.findAllByLabelText("action button");

    fireEvent.press(actionButtons[0]);
    expect(mockUseNavigationNavigate).toHaveBeenCalledWith("SendStack");

    fireEvent.press(actionButtons[1]);
    expect(mockUseNavigationNavigate).toHaveBeenCalledWith(
      "CreatePaymentRequest"
    );

    fireEvent.press(actionButtons[2]);
    expect(mockUseNavigationNavigate).toHaveBeenCalledWith("Funding");

    fireEvent.press(actionButtons[3]);
    expect(mockUseNavigationNavigate).toHaveBeenCalledWith("Withdraw");
  });
});
