import { fireEvent, render, screen } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import TokenDetails from "../TokenDetails";
import { backendApiUrl } from "../../utils/axios";
import { genericApiError } from "../../api/generic/error.interface";
import { linkingOpenUrlMock } from "../../jest/jest.setup";

describe("TokenDetails", () => {
  const createTestProps = (props: Record<string, unknown>) => {
    return {
      navigation: {},
      route: {
        params: {
          tokenCode: "TEST",
        },
      },
      ...props,
    };
  };

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

  it("opens the browser when the user taps the external link icon", async () => {
    props = createTestProps({});
    render(<TokenDetails {...props} />);

    expect(await screen.findByLabelText("asset info")).toBeVisible();

    fireEvent(screen.getByLabelText("go to asset info website"), "onPress");

    expect(linkingOpenUrlMock).toHaveBeenCalledWith("https://www.example.com");
  });
});
