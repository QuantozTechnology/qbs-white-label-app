// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HttpResponse, http } from "msw";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";
import { Transaction } from "../../api/transactions/transactions.interface";
import { GenericApiResponse } from "../../api/utils/api.interface";
import { render, screen, waitFor, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import TransactionsList from "../TransactionsList";

describe("Transactions list", () => {
  it("shows the list with the expected items ", async () => {
    render(<TransactionsList selectedToken="SCEUR" />);

    const transactions = await screen.findAllByLabelText("transaction");
    expect(transactions).toHaveLength(4);
  });

  it("shows API error message if transactions cannot be loaded", async () => {
    const apiError: APIError = {
      Errors: [
        {
          Message: "Cannot load transactions",
          Code: ApiErrorCode.InternalServerError,
          Target: null,
        },
      ],
    };

    server.use(
      http.get(`${backendApiUrl}/api/transactions`, () => {
        return HttpResponse.json(apiError, { status: 400 });
      })
    );

    render(<TransactionsList selectedToken="SCEUR" />);
    waitFor(async () => {
      const errorMessage = await screen.findByLabelText("full screen message");
      const notificationMessage = await screen.findByLabelText(
        "notification message description"
      );

      expect(
        within(errorMessage).getByLabelText("full screen message description")
      ).toHaveTextContent(/^Cannot load transactions, try again later$/);
      expect(notificationMessage).toHaveTextContent(
        /^Cannot load transactions$/
      );
    });
  });

  it("shows empty records message if there are no transactions", async () => {
    server.use(
      http.get(`${backendApiUrl}/api/transactions`, () => {
        return HttpResponse.json<GenericApiResponse<Transaction[]>>(
          { value: [] },
          {
            status: 200,
            headers: {
              "x-pagination":
                '{"TotalCount":5,"PageSize":10,"CurrentPage":1,"PreviousPage":null,"NextPage":null,"TotalPages":1}',
            },
          }
        );
      })
    );

    render(<TransactionsList selectedToken="SCEUR" />);

    const errorMessage = await screen.findByLabelText("full screen message");

    expect(
      within(errorMessage).getByLabelText("full screen message title")
    ).toHaveTextContent("No transactions");
    expect(
      within(errorMessage).getByLabelText("full screen message description")
    ).toHaveTextContent(
      "The more you use the app, the more you will see here :)"
    );
  });
});
