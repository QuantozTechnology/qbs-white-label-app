// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";
import { mockClipboardCopy } from "../../jest/jest.setup";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import Funding from "../Funding";
import { defaultLimitsMockResponse } from "../../api/limits/limits.mocks";
import { GenericApiResponse } from "../../api/utils/api.interface";
import { Limits } from "../../api/limits/limits.interface";

describe("Funding", () => {
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: jest.fn(),
      setOptions: jest.fn(),
    },
    route: {
      params: {
        screenTitle: "Test title",
        description: "Explanation of screen",
      },
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("shows expected data after loading from APIs", async () => {
    props = createTestProps({});
    render(<Funding {...props} />);

    const limitsForCustomers = await screen.findByLabelText(
      "limits progress for customer"
    );
    const beneficiary = screen.getByLabelText("beneficiary");
    const iban = screen.getByLabelText("iban");
    const bic = screen.getByLabelText("bic");
    const message = await screen.findByLabelText("message");

    expect(limitsForCustomers).toBeTruthy();
    expect(within(beneficiary).getByLabelText("label")).toHaveTextContent(
      /^Beneficiary$/
    );
    expect(within(beneficiary).getByLabelText("value")).toHaveTextContent(
      /^Quantoz Payments B.V.$/
    );
    expect(within(iban).getByLabelText("label")).toHaveTextContent(/^IBAN$/);
    expect(within(iban).getByLabelText("value")).toHaveTextContent(
      /^NL123456789$/
    );
    expect(within(bic).getByLabelText("label")).toHaveTextContent(/^BIC$/);
    expect(within(bic).getByLabelText("value")).toHaveTextContent(
      /^NLABN12434$/
    );
    expect(within(message).getByLabelText("label")).toHaveTextContent(
      /^Message$/
    );
    // undefined because it's set in the useEffect, and we did not mock it
    expect(within(message).getByLabelText("value")).toHaveTextContent(
      /^undefined:test-account-code$/
    );
  });

  it("shows error if cannot load balances from API", async () => {
    const balancesApiError: APIError = {
      Errors: [
        {
          Message: "Cannot load balances",
          Code: ApiErrorCode.InternalServerError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.get(`${backendApiUrl}/api/accounts/balances`, (req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json(balancesApiError));
      })
    );

    props = createTestProps({});
    render(<Funding {...props} />);

    const errorMessage = await screen.findByLabelText("full screen message");

    expect(
      within(errorMessage).getByLabelText("full screen message title")
    ).toHaveTextContent("Error loading banking details");
    expect(
      within(errorMessage).getByLabelText("full screen message description")
    ).toHaveTextContent("Please try again later");
  });

  it("shows error if cannot load customer limits from API", async () => {
    const limitsApiError: APIError = {
      Errors: [
        {
          Message: "Cannot load customer limits",
          Code: ApiErrorCode.InternalServerError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.get(`${backendApiUrl}/api/customers/limits`, (req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json(limitsApiError));
      })
    );

    props = createTestProps({});
    render(<Funding {...props} />);

    const errorMessage = await screen.findByLabelText("full screen message");

    expect(
      within(errorMessage).getByLabelText("full screen message title")
    ).toHaveTextContent("Error loading banking details");
    expect(
      within(errorMessage).getByLabelText("full screen message description")
    ).toHaveTextContent("Please try again later");
  });

  it("NOTICE in clipboard works", async () => {
    props = createTestProps({});
    render(<Funding {...props} />);

    const copyButtons = await screen.findAllByLabelText("copy contents");
    expect(copyButtons).toHaveLength(4);

    fireEvent(copyButtons[0], "onPress");

    expect(mockClipboardCopy).toHaveBeenCalled();
    expect(mockClipboardCopy).toHaveBeenCalledWith("Quantoz Payments B.V.");
  });

  it("hides the payment info if customer reached the limit", async () => {
    const mockReachedLimits: GenericApiResponse<Limits[]> = JSON.parse(
      JSON.stringify(defaultLimitsMockResponse)
    );
    mockReachedLimits.value[0].funding.used.monthly = "500";

    server.use(
      rest.get(`${backendApiUrl}/api/customers/limits`, (_req, rest, ctx) => {
        return rest(ctx.status(200), ctx.json(mockReachedLimits));
      })
    );

    props = createTestProps({});
    render(<Funding {...props} />);

    const paymentInfoSection = screen.queryByLabelText("payment info section");

    expect(paymentInfoSection).toBeFalsy();
  });
});
