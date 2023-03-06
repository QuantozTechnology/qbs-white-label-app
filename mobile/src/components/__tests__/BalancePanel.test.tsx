import { render, screen } from "../../jest/test-utils";
import BalancePanel from "../BalancePanel";

describe("Balances panel", () => {
  it("shows the correct values on first load", async () => {
    render(
      <BalancePanel selectedToken={undefined} setSelectedToken={jest.fn()} />
    );

    expect(screen.getByLabelText("balance panel")).toBeTruthy();
    expect(await screen.findByLabelText("balances list")).toBeTruthy();
    expect(await screen.findByLabelText("tokens list")).toBeTruthy();
  });
});
