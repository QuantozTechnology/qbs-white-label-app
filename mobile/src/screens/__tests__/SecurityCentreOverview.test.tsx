// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { Customer } from "../../api/customer/customer.interface";
import { customerMocksDefaultResponse } from "../../api/customer/customer.mocks";
import { genericApiError } from "../../api/generic/error.interface";
import { GenericApiResponse } from "../../api/utils/api.interface";
import { render, screen, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import SecurityCentreOverview from "../SecurityCentreOverview";

describe("Security centre overview", () => {
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: jest.fn(),
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("shows the customer limits for funding and withdraw and the three tiers", async () => {
    props = createTestProps({});
    render(<SecurityCentreOverview {...props} />);

    await screen.findByLabelText("upgrade account overview");
    const limits = await screen.findAllByLabelText(
      "limits progress for customer"
    );
    const tiers = screen.getAllByLabelText("tier");

    expect(limits).toHaveLength(2);
    expect(tiers).toHaveLength(3);
  });

  it("shows full screen error if customer API returns error", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (_req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json({ ...genericApiError }));
      })
    );

    props = createTestProps({});
    render(<SecurityCentreOverview {...props} />);

    const fullScreenError = await screen.findByLabelText("full screen message");

    expect(fullScreenError).toBeTruthy();
    expect(
      within(fullScreenError).getByLabelText("full screen message title")
    ).toHaveTextContent(/^Error$/);
    expect(
      within(fullScreenError).getByLabelText("full screen message description")
    ).toHaveTextContent(/^Please try again later$/);
  });

  it("shows full screen error if label partner limits API returns error", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/trustlevels`, (_req, rest, ctx) => {
        return rest(ctx.status(400));
      })
    );

    props = createTestProps({});
    render(<SecurityCentreOverview {...props} />);

    const fullScreenError = await screen.findByLabelText("full screen message");

    expect(fullScreenError).toBeTruthy();
    expect(
      within(fullScreenError).getByLabelText("full screen message title")
    ).toHaveTextContent(/^Error$/);
    expect(
      within(fullScreenError).getByLabelText("full screen message description")
    ).toHaveTextContent(/^Please try again later$/);
  });

  it("hides description and changes behavior of onPress if customer is a business", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (_req, rest, ctx) => {
        return rest(
          ctx.status(200),
          ctx.json<GenericApiResponse<Customer>>({
            ...customerMocksDefaultResponse,
            value: { ...customerMocksDefaultResponse.value, isBusiness: true },
          })
        );
      })
    );

    props = createTestProps({});
    render(<SecurityCentreOverview {...props} />);

    await screen.findAllByLabelText("limits progress for customer");
    const tiers = screen.getAllByLabelText("tier");

    const tierOne = tiers[0];
    const tierTwo = tiers[1];
    const tierThree = tiers[2];

    expect(within(tierOne).queryByLabelText("tier description")).toBeNull();
    expect(within(tierTwo).queryByLabelText("tier description")).toBeNull();
    expect(within(tierThree).queryByLabelText("tier description")).toBeNull();
  });
});
