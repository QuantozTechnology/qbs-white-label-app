// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Button } from "native-base";
import { fireEvent, render, screen, within } from "../../jest/test-utils";
import TierOverview, { ITierStatus } from "../TierOverview";

describe("Tier overview", () => {
  const mockTierPress = jest.fn();
  afterEach(() => mockTierPress.mockReset());

  it("renders the tier component filled with the passed data", async () => {
    render(
      <TierOverview
        isCurrent={true}
        description={["test 1", "test 2", "test 3"]}
        fundingLimit={100}
        heading="Test title"
        tierStatus={ITierStatus.Active}
        withdrawLimit={50}
      />
    );

    const tier = screen.getByLabelText("tier");
    const title = screen.getByLabelText("tier heading");
    const icon = await screen.findByLabelText("active tier icon");
    const currentTierLabel = screen.getByLabelText("current tier");
    const withdrawLimits = screen.getByLabelText("tier withdraw limits");
    const fundingLimits = screen.getByLabelText("tier funding limits");
    const descriptionItems = screen.getAllByLabelText("description item");

    const descriptionItemsIcons = await screen.findAllByLabelText(
      "active tier description icon"
    );
    const upgradeActions = screen.queryByLabelText("tier upgrade actions");

    expect(tier).toBeTruthy();
    expect(title).toHaveTextContent(/^Test title$/);
    expect(icon).toBeTruthy();
    expect(currentTierLabel).toBeTruthy();
    expect(fundingLimits).toHaveTextContent(/^Funding: EUR 100.00$/);
    expect(withdrawLimits).toHaveTextContent(/^Withdraw: EUR 50.00$/);
    expect(descriptionItems).toHaveLength(3);
    expect(
      within(descriptionItems[0]).getByLabelText("description item text")
    ).toHaveTextContent(/^test 1$/);
    expect(
      within(descriptionItems[1]).getByLabelText("description item text")
    ).toHaveTextContent(/^test 2$/);
    expect(
      within(descriptionItems[2]).getByLabelText("description item text")
    ).toHaveTextContent(/^test 3$/);
    expect(descriptionItemsIcons).toHaveLength(3);
    expect(upgradeActions).toBeFalsy();
  });

  it("shows upgrade tier actions and can click on the button passed as ReactElement", async () => {
    render(
      <TierOverview
        isCurrent={false}
        description={["test 1", "test 2", "test 3"]}
        fundingLimit={100}
        heading="Test title"
        tierStatus={ITierStatus.Inactive}
        withdrawLimit={50}
        tierUpgradeActions={
          <Button accessibilityLabel="test button" onPress={mockTierPress}>
            Press
          </Button>
        }
      />
    );

    const testButton = await screen.findByLabelText("test button");

    fireEvent(testButton, "onPress");

    expect(mockTierPress).toHaveBeenCalled();
  });

  it("renders inactive tier UI correctly", async () => {
    render(
      <TierOverview
        isCurrent={false}
        description={["test description"]}
        fundingLimit={100}
        heading="Test title"
        tierStatus={ITierStatus.Inactive}
        withdrawLimit={50}
      />
    );

    const icon = await screen.findByLabelText("not active tier icon");
    const currentTierLabel = screen.queryByLabelText("current tier");
    const descriptionItemsIcons = await screen.findAllByLabelText(
      "not active tier description icon"
    );

    expect(icon).toBeTruthy();
    expect(currentTierLabel).toBeFalsy();
    expect(descriptionItemsIcons).toBeTruthy();
  });

  it("does not render upgrade actions for a disabled tier", async () => {
    render(
      <TierOverview
        isCurrent={false}
        description={["test description"]}
        fundingLimit={100}
        heading="Test title"
        tierStatus={ITierStatus.Disabled}
        withdrawLimit={50}
        tierUpgradeActions={
          <Button accessibilityLabel="test button" onPress={mockTierPress}>
            Press
          </Button>
        }
      />
    );

    const upgradeActions = screen.queryByLabelText("tier upgrade actions");
    expect(upgradeActions).toBeFalsy();
  });
});
