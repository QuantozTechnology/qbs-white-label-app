// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { render, screen } from "../../jest/test-utils";
import PortfolioOverview from "../PortfolioOverview";

describe("Portfolio overview screen", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: jest.fn(),
    },
    ...props,
  });

  beforeEach(() => {
    props = createTestProps({});
  });

  it("Loads expected UI", () => {
    render(<PortfolioOverview {...props} />);

    const buttons = screen.getByLabelText("action buttons");
    const loadingBalance = screen.getByLabelText("balance panel");
    const loadingTransactions = screen.getByLabelText("loading transactions");

    expect(buttons).toBeTruthy();
    expect(loadingBalance).toBeTruthy();
    expect(loadingTransactions).toBeTruthy();
  });
});
