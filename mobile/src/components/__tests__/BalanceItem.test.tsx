import BalanceItem from "../BalanceItem";
import { render, screen } from "../../jest/test-utils";

describe("BalanceItem", () => {
  it("renders correctly", () => {
    render(<BalanceItem balance={10} tokenCode="SCEUR" />);

    expect(screen.getByLabelText("balance")).toHaveTextContent(/^10.00$/);
    expect(screen.getByLabelText("token code")).toHaveTextContent(/^SCEUR$/);
  });
});
