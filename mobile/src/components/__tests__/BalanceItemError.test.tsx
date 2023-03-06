import { render, screen } from "../../jest/test-utils";
import BalanceItemError from "../BalanceItemError";

describe("BalanceItemError", () => {
  it("renders correctly", () => {
    render(<BalanceItemError />);
    expect(screen.getByLabelText("balance error")).toHaveTextContent("N/A");
    expect(screen.getByLabelText("token code error")).toHaveTextContent("N/A");
  });
});
