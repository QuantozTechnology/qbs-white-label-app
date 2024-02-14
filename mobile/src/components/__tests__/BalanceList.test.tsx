// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import BalancesList from "../BalancesList";
import { render, screen } from "../../jest/test-utils";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";
import { Balances } from "../../api/balances/balances.interface";

describe("BalancesList", () => {
  const mockBalance: Balances = { balance: 300, tokenCode: "SCEUR" };
  const mockSetToken = jest.fn();

  it("renders correctly with loading state", () => {
    render(
      <BalancesList
        selectedToken={mockBalance}
        setSelectedToken={mockSetToken}
      />
    );

    expect(screen.getByLabelText("balance item loading")).toBeTruthy();
  });

  it("renders correctly with error state", async () => {
    const apiError: APIError = {
      Errors: [{ Code: ApiErrorCode.NexusSDKError, Message: "", Target: "" }],
    };

    server.use(
      rest.get(`${backendApiUrl}/api/accounts/balances`, (_req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json(apiError));
      })
    );
    render(
      <BalancesList
        selectedToken={mockBalance}
        setSelectedToken={mockSetToken}
      />
    );

    expect(await screen.findByLabelText("balance error")).toBeTruthy();
  });

  it("renders correctly with data", async () => {
    render(
      <BalancesList
        selectedToken={mockBalance}
        setSelectedToken={mockSetToken}
      />
    );

    expect(
      await screen.findAllByLabelText("selected balance item")
    ).toBeTruthy();
    expect(
      await screen.findAllByLabelText("non selected balance item")
    ).toBeTruthy();
  });
});
