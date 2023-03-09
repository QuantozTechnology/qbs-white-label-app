// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { render, screen } from "../../jest/test-utils";
import BalancePanel from "../BalancePanel";

describe("Balances panel", () => {
  it("shows the correct values on first load", async () => {
    render(
      <BalancePanel selectedToken={undefined} setSelectedToken={jest.fn()} />
    );

    expect(screen.getByLabelText("balance panel")).toBeTruthy();
    expect(await screen.findByLabelText("balances list")).toBeTruthy();
    expect(await screen.findByLabelText("tokens list")).toBeTruthy();
  });
});
