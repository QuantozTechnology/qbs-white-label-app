// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { fireEvent, render, screen } from "../../jest/test-utils";
import CustomerLimitsProgress from "../CustomerLimitsProgress";
import { server } from "../../mocks/server";
import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../../api/utils/api.interface";
import { Limits } from "../../api/limits/limits.interface";
import { mockUseNavigationDispatch } from "../../jest/jest.setup";

describe("Customer limits progress", () => {
  it("shows the expected values in case of successful render", async () => {
    render(
      <CustomerLimitsProgress label="Test label" operationType="funding" />
    );

    await screen.findByLabelText("limits progress for customer");

    const label = await screen.findByLabelText("limits progress label");
    const limit = screen.getByLabelText("current usage and max limit");
    const textMessage = screen.getByLabelText("limits info");

    expect(label).toHaveTextContent(/^Test label$/);
    expect(limit).toHaveTextContent(/^EUR 100.00 \/ 500.00$/);
    expect(textMessage).toHaveTextContent(
      /^If you transfer more than EUR 400.00, the funding will fail.$/
    );
  });

  it("shows error if callback API fails", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers/limits`, (_req, rest, ctx) => {
        return rest(ctx.status(400));
      })
    );

    render(
      <CustomerLimitsProgress label="Test label" operationType="funding" />
    );

    const textMessage = await screen.findByLabelText("limits error message");

    expect(textMessage).toHaveTextContent(
      /^Could not load limits. Try again later$/
    );
  });

  it("shows limits reached error", async () => {
    const limitsReachedResponse: GenericApiResponse<Limits[]> = {
      value: [
        {
          tokenCode: "SCEUR",
          funding: {
            limit: {
              monthly: "500",
            },
            used: {
              monthly: "500",
            },
          },
          withdraw: {
            limit: {
              monthly: "100",
            },
            used: {
              monthly: "20",
            },
          },
        },
      ],
    };

    server.use(
      rest.get(`${backendApiUrl}/api/customers/limits`, (_req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(limitsReachedResponse));
      })
    );
    render(
      <CustomerLimitsProgress label="Test label" operationType="funding" />
    );

    const label = await screen.findByLabelText("limits progress label");
    const limit = screen.getByLabelText("current usage and max limit");
    const textMessage = screen.getByLabelText("limits info");

    expect(label).toHaveTextContent(/^Test label$/);
    expect(limit).toHaveTextContent(/^EUR 500.00 \/ 500.00$/);
    expect(textMessage).toHaveTextContent(
      /^You have reached your monthly limits.$/
    );
  });

  it("opens the info modal and redirects user to 'upgrade account' screen when button is clicked", async () => {
    render(
      <CustomerLimitsProgress label="Test label" operationType="funding" />
    );

    const infoButton = await screen.findByLabelText(
      "account upgrade info trigger"
    );

    fireEvent(infoButton, "onPress");

    const limitsInfoModal = await screen.findByLabelText("limits info modal");
    const upgradeButton = await screen.findByLabelText(
      "go to upgrade account screen"
    );

    expect(limitsInfoModal).toBeTruthy();

    fireEvent(upgradeButton, "onPress");

    expect(mockUseNavigationDispatch).toHaveBeenCalledWith({
      payload: {
        index: 0,
        routes: [
          {
            name: "UserProfileStack",
            params: { screen: "UpgradeAccountStack" },
          },
        ],
      },
      type: "RESET",
    });
  });
});
