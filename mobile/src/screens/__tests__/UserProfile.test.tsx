// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import UserProfile from "../UserProfile";
import { customerMocksDefaultResponse } from "../../api/customer/customer.mocks";
import { mockClipboardCopy } from "../../jest/jest.setup";

describe("UserProfile screen", () => {
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: jest.fn(),
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;
  it("shows the expected UI elements", async () => {
    props = createTestProps({});
    render(<UserProfile {...props} />);

    const userProfileInfo = await screen.findByLabelText("user profile info");
    const accountCode = await screen.findByLabelText("account code");
    const upgradeAccountButton = screen.getByLabelText("upgrade account");
    const signOutButton = screen.getByLabelText("sign out");

    expect(userProfileInfo).toBeTruthy();
    expect(accountCode).toBeTruthy();
    expect(upgradeAccountButton).toBeTruthy();
    expect(signOutButton).toBeTruthy();
  });

  it("copies the account code in the clipboard", async () => {
    props = createTestProps({});
    render(<UserProfile {...props} />);
    const copyAccountCode = await screen.findByLabelText("copy account code");

    fireEvent(copyAccountCode, "onPress");

    // account code copied and notification shown
    expect(mockClipboardCopy).toHaveBeenCalledWith("test-account-code");
    expect(
      await screen.findAllByLabelText("notification message")
    ).toBeTruthy();
  });

  it("shows bank info if bank account is not null", async () => {
    server.use(
      rest.get(`${backendApiUrl}/api/customers`, (_req, rest, ctx) => {
        return rest(
          ctx.status(200),
          ctx.json({
            value: {
              ...customerMocksDefaultResponse.value,
              bankAccountNumber: "NL123456",
            },
          })
        );
      })
    );

    props = createTestProps({});
    render(<UserProfile {...props} />);

    const bankAccount = await screen.findByLabelText("bank account");

    expect(within(bankAccount).getByLabelText("label")).toHaveTextContent(
      /^Bank account number$/
    );
    expect(within(bankAccount).getByLabelText("value")).toHaveTextContent(
      /^NL123456$/
    );
  });
});
