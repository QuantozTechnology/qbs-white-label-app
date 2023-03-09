// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { render, screen, within } from "../../jest/test-utils";
import FullScreenMessage from "../FullScreenMessage";

describe("Full screen message", () => {
  it("renders the passed values correctly", async () => {
    render(<FullScreenMessage message="Test message" title="Test title" />);

    const fullScreenMessage = screen.getByLabelText("full screen message");
    const warningIcon = await screen.findByLabelText("warning icon");

    expect(fullScreenMessage).toBeTruthy();
    expect(warningIcon).toBeTruthy();
    expect(
      within(fullScreenMessage).getByLabelText("full screen message title")
    ).toHaveTextContent(/^Test title$/);
    expect(
      within(fullScreenMessage).getByLabelText(
        "full screen message description"
      )
    ).toHaveTextContent(/^Test message$/);
  });
});
