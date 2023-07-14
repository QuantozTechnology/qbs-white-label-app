// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, VbackendApiUrl 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";
import { Offers } from "../../api/offers/offers.interface";
import { render, screen, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import OffersList from "../OffersList";

describe("Offers list", () => {
  it("shows the list with the expected items ", async () => {
    render(<OffersList type="Open" />);

    const offers = await screen.findAllByLabelText("offer");
    expect(offers).toHaveLength(1);
  });

  it("shows API error message if offers cannot be loaded", async () => {
    const apiError: APIError = {
      Errors: [
        {
          Message: "Cannot load offers",
          Code: ApiErrorCode.InternalServerError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.get(`${backendApiUrl}/api/offers`, (_req, rest, ctx) => {
        return rest(ctx.status(500), ctx.json(apiError));
      })
    );

    render(<OffersList type="Open" />);

    const errorMessage = await screen.findByLabelText("full screen message");
    const notificationMessage = await screen.findByLabelText(
      "notification message description"
    );

    expect(
      within(errorMessage).getByLabelText("full screen message description")
    ).toHaveTextContent(/^Cannot load offers, try again later.$/);
    expect(notificationMessage).toHaveTextContent(/^Cannot load offers/);
  });

  it("shows empty records message if there are no transactions", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/offers`, (_req, rest, ctx) => {
        return rest(
          ctx.status(200),
          ctx.set(
            "x-pagination",
            '{"TotalCount":5,"PageSize":10,"CurrentPage":1,"PreviousPage":null,"NextPage":null,"TotalPages":1}'
          ),
          ctx.json<Offers>({
            value: [],
          })
        );
      })
    );

    render(<OffersList type="Open" />);

    const errorMessage = await screen.findByLabelText("full screen message");

    expect(
      within(errorMessage).getByLabelText("full screen message description")
    ).toHaveTextContent("No offers to show");
  });
});
