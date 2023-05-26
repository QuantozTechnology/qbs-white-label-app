import { Text } from "native-base";
import { render, screen, within } from "../../jest/test-utils";
import GenericListItem from "../GenericListItem";

describe("GenericListItem", () => {
  it("shows expected values (right content as string)", () => {
    render(<GenericListItem leftContent="Label" rightContent="String" />);

    expect(screen.getByLabelText("label")).toHaveTextContent("Label");
    expect(screen.getByLabelText("content")).toHaveTextContent("String");
  });

  it("shows a component as content", () => {
    render(
      <GenericListItem
        leftContent="Label"
        rightContent={<Text accessibilityLabel="test">Test</Text>}
      />
    );

    expect(
      within(screen.getByLabelText("content")).getByLabelText("test")
    ).toHaveTextContent("Test");
  });
});
