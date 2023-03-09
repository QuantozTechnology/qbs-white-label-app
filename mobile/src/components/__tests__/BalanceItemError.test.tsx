// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { render, screen } from "../../jest/test-utils";
import BalanceItemError from "../BalanceItemError";

describe("BalanceItemError", () => {
  it("renders correctly", () => {
    render(<BalanceItemError />);
    expect(screen.getByLabelText("balance error")).toHaveTextContent("N/A");
    expect(screen.getByLabelText("token code error")).toHaveTextContent("N/A");
  });
});
