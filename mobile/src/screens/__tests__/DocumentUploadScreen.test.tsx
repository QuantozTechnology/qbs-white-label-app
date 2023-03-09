// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { fireEvent, render, screen } from "../../jest/test-utils";
import DocumentUploadScreen from "../DocumentUploadScreen";

describe("Document upload selection screen", () => {
  const mockNavigation = jest.fn();
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: mockNavigation,
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

  it("displays the expected UI elements", async () => {
    props = createTestProps({});
    render(<DocumentUploadScreen {...props} />);

    const documentTypeOptions = await screen.findAllByLabelText(
      "document type option"
    );
    const screenDescription = screen.getByLabelText("screen description");
    const continueButton = screen.getByLabelText("continue");

    expect(documentTypeOptions).toHaveLength(2);
    expect(screenDescription).toHaveTextContent(/^Explanation of screen$/);
    expect(continueButton).toBeTruthy();
  });

  it("should go to the screen to take a photo when the button is pressed", async () => {
    props = createTestProps({});
    render(<DocumentUploadScreen {...props} />);

    const continueButton = screen.getByLabelText("continue");
    fireEvent(continueButton, "onPress");

    expect(mockNavigation).toHaveBeenCalled();
  });
});
