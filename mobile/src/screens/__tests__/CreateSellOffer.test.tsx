// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Tokens } from "../../api/tokens/tokens.interface";
import { fireEvent, render, screen, waitFor } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import { mockApiUrl } from "../../utils/axios";
import CreateSellOffer from "../CreateSellOffer";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";

const mockReset = jest.fn();

describe("CreateSellOffer screen", () => {
  const mockToken: Tokens = {
    balance: "100",
    code: "GOLD",
    name: "Gold",
    issuerAddress: "test-address",
  };
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      getParent: () => ({
        getState: () => ({
          routeNames: [],
        }),
        reset: mockReset,
      }),
    },
    route: {
      params: {
        token: mockToken,
      },
    },
    ...props,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("shows proper validation errors", async () => {
    props = createTestProps({ route: {} });
    render(<CreateSellOffer {...props} />);

    const reviewButton = screen.getByLabelText("review");

    fireEvent(reviewButton, "onPress");

    expect(
      await screen.findByLabelText("select token error")
    ).toHaveTextContent(/^Select an asset$/);
    expect(await screen.findByLabelText("amount error")).toHaveTextContent(
      /^Amount is required$/
    );
    expect(await screen.findByLabelText("price error")).toHaveTextContent(
      /^Price is required$/
    );
  });

  it("shows amount validation if empty", async () => {
    props = createTestProps({});
    render(<CreateSellOffer {...props} />);

    const amountInput = screen.getByLabelText("amount");
    const reviewButton = screen.getByLabelText("review");

    fireEvent(amountInput, "onChangeText", "");
    fireEvent(reviewButton, "onPress");

    expect(await screen.findByLabelText("amount error")).toHaveTextContent(
      /^Amount is required$/
    );
  });

  it("shows price validation if empty", async () => {
    props = createTestProps({});
    render(<CreateSellOffer {...props} />);

    const priceInput = screen.getByLabelText("price");
    const reviewButton = screen.getByLabelText("review");

    fireEvent(priceInput, "onChangeText", "");
    fireEvent(reviewButton, "onPress");

    expect(await screen.findByLabelText("price error")).toHaveTextContent(
      /^Price is required$/
    );
  });

  it("show price error if total amount above balance", async () => {
    // pre-select token to avoid failing validation
    const mockToken: Tokens = {
      balance: "100",
      code: "GOLD",
      name: "Gold",
      issuerAddress: "test-address",
    };
    props = createTestProps({ route: { params: { token: mockToken } } });
    render(<CreateSellOffer {...props} />);

    const amountInput = screen.getByLabelText("amount");
    const reviewButton = screen.getByLabelText("review");

    fireEvent(amountInput, "onChangeText", "200");
    fireEvent(reviewButton, "onPress");

    expect(await screen.findByLabelText("amount error")).toHaveTextContent(
      /^Insufficient balance$/
    );
  });

  it("fails to create an offer and displays an error message", async () => {
    const apiError: APIError = {
      Errors: [
        {
          Message: "Cannot create offer",
          Code: ApiErrorCode.InternalServerError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.post(`${mockApiUrl}/api/offers`, (_req, rest, ctx) => {
        return rest(ctx.status(500), ctx.json(apiError));
      })
    );

    props = createTestProps({});
    render(<CreateSellOffer {...props} />);

    // need to wait for balances to be loaded
    await waitFor(() => {
      expect(screen.getByLabelText("balance")).toHaveTextContent(
        /^Balance: GOLD 100/
      );
    });
    const amountInput = screen.getByLabelText("amount");
    const priceInput = screen.getByLabelText("price");
    const reviewButton = screen.getByLabelText("review");

    fireEvent(amountInput, "onChangeText", "1");
    fireEvent(priceInput, "onChangeText", "1");
    fireEvent(reviewButton, "onPress");

    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Cannot create offer$/);
  });

  it("creates an offer successfully", async () => {
    props = createTestProps({});
    render(<CreateSellOffer {...props} />);

    // need to wait for balances to be loaded
    await waitFor(() => {
      expect(screen.getByLabelText("balance")).toHaveTextContent(
        /^Balance: GOLD 100/
      );
    });
    const amountInput = screen.getByLabelText("amount");
    const priceInput = screen.getByLabelText("price");
    const reviewButton = screen.getByLabelText("review");

    fireEvent(amountInput, "onChangeText", "10");
    fireEvent(priceInput, "onChangeText", "10");
    fireEvent(reviewButton, "onPress");

    // TODO cannot test this for some reason, solving it in the future
    expect(
      await screen.findByLabelText("notification message description")
    ).toHaveTextContent(/^Offer created successfully$/);
    expect(mockReset).toHaveBeenCalled();
  });
});
