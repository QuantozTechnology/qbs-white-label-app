// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { mockUseNavigationGoBack } from "../../jest/jest.setup";
import { fireEvent, render, screen } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import CancelOfferDialog from "../CancelOfferDialog";
import { backendApiUrl } from "../../utils/axios";
import { genericApiError } from "../../api/generic/error.interface";

describe("CancelOfferDialog", () => {
  it("shows the expected UI", async () => {
    render(
      <CancelOfferDialog isOpen={true} setIsOpen={jest.fn()} offerCode="test" />
    );

    expect(await screen.findByLabelText("cancel offer dialog")).toBeVisible();
    expect(screen.getByLabelText("close cancel offer dialog")).toBeVisible();
    expect(screen.getByLabelText("confirm cancel offer")).toBeVisible();
  });

  it("shows confirmation for successfull offer cancel", async () => {
    render(
      <CancelOfferDialog isOpen={true} setIsOpen={jest.fn()} offerCode="test" />
    );

    await screen.findByLabelText("cancel offer dialog");
    fireEvent(screen.getByLabelText("confirm cancel offer"), "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent("Offer cancelled successfully");
    expect(mockUseNavigationGoBack).toHaveBeenCalled();
  });

  it("shows error message it it cannot cancel the offer", async () => {
    server.use(
      rest.put(
        `${backendApiUrl}/api/offers/:offerCode/cancel`,
        (_req, rest, ctx) => {
          return rest(ctx.status(400), ctx.json(genericApiError));
        }
      )
    );
    render(
      <CancelOfferDialog isOpen={true} setIsOpen={jest.fn()} offerCode="test" />
    );

    await screen.findByLabelText("cancel offer dialog");
    fireEvent(screen.getByLabelText("confirm cancel offer"), "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent("Error");
  });
});
