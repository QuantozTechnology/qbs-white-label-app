// Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { genericApiError } from "../../api/generic/error.interface";
import { linkingOpenUrlMock} from "../../jest/jest.setup";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { mockApiUrl } from "../../utils/axios";
import TokenDetails from "../TokenDetails";

describe("TokenDetails", () => {
  const createTestProps = (props: Record<string, unknown>) => ({
    route: {
      params: {tokenCode: "SCEUR"},
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("shows the UI for correctly loaded tokens", async () => {
    props = createTestProps({});
    render(
      <TokenDetails
        {...props}
      />
    );
    
    const assetInfo = await screen.findByLabelText("asset info");
    const issuer = await screen.findByLabelText("issuer");
    const validator = await screen.findByLabelText("validator");
    const schema =  await screen.findByLabelText("schema");

    expect(within(assetInfo).getByLabelText("value")).toHaveTextContent("https://www.example.com");
    expect(within(issuer).getByLabelText("value")).toHaveTextContent("https://www.example.com");
    expect(within(validator).getByLabelText("value")).toHaveTextContent("https://www.example.com");
    expect(within(schema).getByLabelText("value")).toHaveTextContent("https://www.example.com");
  });

  it("shows an error when the API call for token details fails", async () => {
    server.use(
      rest.get(`${mockApiUrl}/api/tokens/:tokenCode`, (_req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json(genericApiError));
      })
    );

    props = createTestProps({});
    render(
      <TokenDetails
        {...props}
      />
    );

    expect(await screen.findByLabelText("full screen message description")).toHaveTextContent(/^Error loading the token details$/);
  });

  it("goes to the related webpage on press of the external url icon", async () => {
    props = createTestProps({});
    render(
      <TokenDetails
        {...props}
      />
    );
    const assetEntryLink = await screen.findByLabelText("go to asset info page");
    fireEvent(assetEntryLink, "onPress")

    expect(linkingOpenUrlMock).toHaveBeenCalledWith("https://www.example.com");
  });
});
