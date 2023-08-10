import { rest } from "msw";
import { genericApiError } from "../../api/generic/error.interface";
import { Tokens } from "../../api/tokens/tokens.interface";
import { PaginatedResponse } from "../../api/utils/api.interface";
import { render, screen } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import AvailableTokensList from "../AvailableTokensList";

describe("AvailableTokensList", () => {
  it("shows error message if tokens cannot be fetched", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/tokens`, (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json(genericApiError));
      })
    );

    render(<AvailableTokensList />);

    expect(
      await screen.findByLabelText("full screen message description")
    ).toHaveTextContent("Error loading available assets");
  });

  it("shows empty results message if there are no tokens to show", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/tokens`, (_req, rest, ctx) => {
        return rest(
          ctx.status(200),
          ctx.set(
            "x-pagination",
            '{"TotalCount":0,"PageSize":10,"CurrentPage":1,"PreviousPage":null,"NextPage":null,"TotalPages":1}'
          ),
          ctx.json<PaginatedResponse<Tokens[]>>({ nextPage: null, value: [] })
        );
      })
    );

    render(<AvailableTokensList />);

    expect(
      await screen.findByLabelText("full screen message description")
    ).toHaveTextContent("No available assets to show");
  });

  it("shows expected UI", async () => {
    render(<AvailableTokensList />);

    expect(
      await screen.findByLabelText("available tokens section")
    ).toBeVisible();
    expect(screen.getByLabelText("available tokens heading")).toHaveTextContent(
      "Available assets"
    );
    expect(screen.getAllByLabelText("token list item")).toHaveLength(2);
  });
});
