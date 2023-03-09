// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { render, screen } from "../../jest/test-utils";
import AllCapsSectionHeading from "../AllCapsSectionHeading";

describe("AllCapsSectionHeading", () => {
  it("shows the heading with the message prop passed", () => {
    render(<AllCapsSectionHeading text="Test heading" />);

    expect(screen.getByText("Test heading")).toBeTruthy();
  });
});
