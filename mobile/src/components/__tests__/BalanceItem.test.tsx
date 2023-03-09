// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import BalanceItem from "../BalanceItem";
import { render, screen } from "../../jest/test-utils";

describe("BalanceItem", () => {
  it("renders correctly", () => {
    render(<BalanceItem balance={10} tokenCode="SCEUR" />);

    expect(screen.getByLabelText("balance")).toHaveTextContent(/^10.00$/);
    expect(screen.getByLabelText("token code")).toHaveTextContent(/^SCEUR$/);
  });
});
