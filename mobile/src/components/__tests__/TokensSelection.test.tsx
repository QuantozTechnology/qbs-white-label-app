// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { defaultBalancesResponse } from "../../api/balances/balances.mocks";
import {mockUseNavigationNavigate } from "../../jest/jest.setup";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import TokensSelection from "../TokensSelection";

describe("TokensSelection", () => {
  it("switches correctly between stablecoins", async () => {
    const mockSetToken = jest.fn();

    render(
      <TokensSelection
        isOpen={true}
        onClose={jest.fn()}
        tokens={defaultBalancesResponse.value}
        selectedToken={defaultBalancesResponse.value[0]}
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

  it("goes to token details page on press of the external url icon", async () => {
    render(
      <TokensSelection
        isOpen={true}
        onClose={jest.fn()}
        tokens={defaultBalancesResponse.value}
        selectedToken={defaultBalancesResponse.value[0]}
        setSelectedToken={jest.fn()}
      />
    );

    await screen.findAllByLabelText("token");
    const tokenDetailsButtons = await screen.findAllByLabelText(
      "see token details"
    );

    fireEvent(tokenDetailsButtons[0], "onPress");
    expect(mockUseNavigationNavigate).toHaveBeenCalledWith("TokenDetails", {"tokenCode": "SCEUR"})
  });
});
