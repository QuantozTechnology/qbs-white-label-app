// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HttpResponse, http } from "msw";
import { genericApiError } from "../../api/generic/error.interface";
import { render, screen, waitFor, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import PaymentRequestsList from "../../components/PaymentRequestsList";

describe("PaymentRequestDetails", () => {
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {},
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  it("shows the list with the expected items ", async () => {
    props = createTestProps({});
    render(<PaymentRequestsList {...props} />);

    const transactions = await screen.findAllByLabelText(
      "payment request item"
    );
    expect(transactions).toHaveLength(1);
  });

  it("shows API error message if payment requests cannot be loaded", async () => {
    server.use(
      http.get(`${backendApiUrl}/api/paymentrequests`, () => {
        return HttpResponse.json(genericApiError, { status: 400 });
      })
    );

    props = createTestProps({});
    render(<PaymentRequestsList {...props} />);

    waitFor(async () => {
      const errorMessage = await screen.findByLabelText("full screen message");
      expect(
        within(errorMessage).getByLabelText("full screen message description")
      ).toHaveTextContent(/^Error loading payment request details$/);
    });
  });

  it("shows empty records message if there are no payment requests", async () => {
    server.use(
      http.get(`${backendApiUrl}/api/paymentrequests`, () => {
        return HttpResponse.json(
          { value: [] },
          {
            status: 200,
            headers: {
              "x-pagination":
                '{"TotalCount":5,"PageSize":10,"CurrentPage":1,"PreviousPage":null,"NextPage":null,"TotalPages":1}',
            },
          }
        );
      })
    );

    props = createTestProps({});
    render(<PaymentRequestsList {...props} />);

    const errorMessage = await screen.findByLabelText("full screen message");

    expect(
      within(errorMessage).getByLabelText("full screen message description")
    ).toHaveTextContent("No payment requests to show");
  });
});
