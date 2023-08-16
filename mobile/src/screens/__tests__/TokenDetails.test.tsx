// Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { fireEvent, render, screen } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { genericApiError } from "../../api/generic/error.interface";
import TokenDetails from "../TokenDetails";
import * as Linking from "expo-linking";
import { GenericApiResponse } from "../../api/utils/api.interface";
import { TokenDetails as TokenDetailsType } from "../../api/tokens/tokens.interface";
import { tokenDetailsDefaultMock } from "../../api/tokens/tokens.mocks";

describe("TokenDetails", () => {
  const createTestProps = (props: Record<string, unknown>) => ({
    route: {
      params: { tokenCode: "SILV" },
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("shows the expected fields", async () => {
    props = createTestProps({});
    render(<TokenDetails {...props} />);

    expect(await screen.findByLabelText("asset info")).toBeVisible();
    expect(await screen.findByLabelText("issuer info")).toBeVisible();
    expect(await screen.findByLabelText("validator info")).toBeVisible();
    expect(await screen.findByLabelText("schema info")).toBeVisible();
  });

  it("shows error message if it cannot retrieve details from the API", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/tokens/:tokenCode`, (_req, rest, ctx) => {
        return rest(ctx.status(500), ctx.json(genericApiError));
      })
    );

    props = createTestProps({});
    render(<TokenDetails {...props} />);

    expect(
      await screen.findByLabelText("full screen message description")
    ).toHaveTextContent("Cannot retrieve token details");
  });

  it("shows en empty message if no available asset details to show", async () => {
    const emptyTokenDetailsResponse: GenericApiResponse<TokenDetailsType> =
      JSON.parse(JSON.stringify(tokenDetailsDefaultMock));

    // check needed to avoid Typescript warnings
    if (emptyTokenDetailsResponse.value.taxonomy) {
      emptyTokenDetailsResponse.value.taxonomy.assetUrl = null;
    }
    emptyTokenDetailsResponse.value.data = {};

    server.use(
      rest.get(`${backendApiUrl}/api/tokens/:tokenCode`, (_req, rest, ctx) => {
        return rest(
          ctx.status(200),
          ctx.json<GenericApiResponse<TokenDetailsType>>(
            emptyTokenDetailsResponse
          )
        );
      })
    );

    props = createTestProps({});
    render(<TokenDetails {...props} />);

    expect(
      await screen.findByLabelText("full screen message description")
    ).toHaveTextContent("No details available for this asset");
  });

  it("opens the browser when the user taps the external link icon", async () => {
    props = createTestProps({});
    render(<TokenDetails {...props} />);

    expect(await screen.findByLabelText("asset info")).toBeVisible();

    fireEvent(screen.getByLabelText("go to asset info website"), "onPress");

    expect(Linking.openURL).toHaveBeenCalledWith("http://www.test.com");
  });
});
