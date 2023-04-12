// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { render, screen, within } from "../../jest/test-utils";
import Notification from "../Notification";

describe("Notification", () => {
  it("displays error message and icon", () => {
    render(<Notification message="this is an error message" variant="error" />);

    const notification = screen.getByLabelText("notification message");

    expect(
      within(notification).getByLabelText("notification message description")
    ).toHaveTextContent(/^this is an error message$/);
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

    expect(
      within(notification).getByLabelText("notification message description")
    ).toHaveTextContent(/^this is an error message$/);
    expect(
      within(notification).getByLabelText("notification message title")
    ).toHaveTextContent(/^Test title$/);
  });
});
