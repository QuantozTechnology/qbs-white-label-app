// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Balances } from "../../api/balances/balances.interface";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import TokensSelection from "../TokensSelection";

describe("TokensSelection", () => {
  it("switches correctly between stablecoins", async () => {
    const mockBalances: Balances[] = [
      { balance: 300, tokenCode: "SCEUR" },
      { balance: 10, tokenCode: "SCUSD" },
    ];
    const mockSetToken = jest.fn();

    render(
      <TokensSelection
        isOpen={true}
        onClose={jest.fn()}
        tokens={mockBalances}
        selectedToken={mockBalances[0]}
        setSelectedToken={mockSetToken}
      />
    );

    const availableStablecoins = await screen.findAllByLabelText("token");

    expect(availableStablecoins).toHaveLength(2);

    expect(
      within(availableStablecoins[0]).getByLabelText("token code")
    ).toHaveTextContent(/^SCEUR$/);
    expect(
      within(availableStablecoins[0]).getByLabelText("token balance")
    ).toHaveTextContent(/^300.00$/);
    expect(
      within(availableStablecoins[1]).getByLabelText("token code")
    ).toHaveTextContent(/^SCUSD$/);
    expect(
      within(availableStablecoins[1]).getByLabelText("token balance")
    ).toHaveTextContent(/^10.00$/);

    fireEvent(availableStablecoins[1], "onPress");

    expect(mockSetToken).toHaveBeenCalledWith({
      balance: 10,
      tokenCode: "SCUSD",
    });
  });
});
