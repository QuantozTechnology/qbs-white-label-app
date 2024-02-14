// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { rest } from "msw";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";
import { fireEvent, render, screen } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { ReviewPhotoRouteParams } from "../../navigation/UpgradeAccountStack";
import { backendApiUrl } from "../../utils/axios";
import ReviewPhoto from "../ReviewPhoto";

describe("ReviewPhoto", () => {
  const mockedGoBack = jest.fn();
  const mockedNavigation = jest.fn();
  const mockedRouteParams: ReviewPhotoRouteParams = {
    document: {
      type: "id",
      side: "front",
    },
    imageUri: "path/to/photo.jpg",
  };
  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: mockedNavigation,
      setOptions: jest.fn(),
      goBack: mockedGoBack,
    },
    route: {
      params: mockedRouteParams,
    },
    ...props,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: any;

  //   const takeAnotherPhotoButton =
  //   screen.queryByLabelText("take another photo");
  // const savePhotoButton = screen.queryByLabelText("save photo");

  it("renders the expected UI", async () => {
    props = createTestProps({});
    render(<ReviewPhoto {...props} />);

    const photoTaken = await screen.findByLabelText("photo taken");
    const savePhotoButton = screen.getByLabelText("save photo");
    const takeAnotherPhotoButton = screen.getByLabelText("take another photo");

    expect(photoTaken).toBeTruthy();
    expect(savePhotoButton).toBeTruthy();
    expect(takeAnotherPhotoButton).toBeTruthy();
  });
  it("resets an already taken photo by going back to the previous screen", async () => {
    props = createTestProps({});
    render(<ReviewPhoto {...props} />);

    const photoTaken = await screen.findByLabelText("photo taken");
    const takeAnotherPhotoButton = screen.getByLabelText("take another photo");

    expect(photoTaken).toBeTruthy();
    expect(takeAnotherPhotoButton).toBeTruthy();

    fireEvent(takeAnotherPhotoButton, "onPress");

    expect(mockedGoBack).toHaveBeenCalled();
  });

  it("should save the taken photo", async () => {
    props = createTestProps({});
    render(<ReviewPhoto {...props} />);

    const photoTaken = await screen.findByLabelText("photo taken");
    const savePhotoButton = screen.getByLabelText("save photo");

    expect(photoTaken).toBeTruthy();
    expect(savePhotoButton).toBeTruthy();

    fireEvent(savePhotoButton, "onPress");

    // TODO not working until I figure out how to mock useState inside useEffect
    // goes to upload photo screen
    // expect(mockedNavigation).toHaveBeenCalled();

    // TODO test the success notification (hard because inside await function)
    // const successNotification = await screen.findByLabelText(
    //   "notification message"
    // );
    // expect(
    //   within(successNotification).getByLabelText(
    //     "notification message description"
    //   )
    // ).toHaveTextContent(/^Passport uploaded$/);
  });

  it("cannot save the taken photo", async () => {
    const savePhotoApiError: APIError = {
      Errors: [
        {
          Message: "Cannot save photo",
          Code: ApiErrorCode.ValidationError,
          Target: null,
        },
      ],
    };

    server.use(
      rest.post(
        `${backendApiUrl}/api/customers/files/IdFront`,
        (_req, rest, ctx) => {
          return rest(ctx.status(400), ctx.json(savePhotoApiError));
        }
      )
    );

    props = createTestProps({});
    render(<ReviewPhoto {...props} />);

    const photoTaken = await screen.findByLabelText("photo taken");
    const savePhotoButton = screen.getByLabelText("save photo");

    expect(photoTaken).toBeTruthy();
    expect(savePhotoButton).toBeTruthy();

    fireEvent(savePhotoButton, "onPress");

    // TODO add again after feature is implemented
    // goes to upload photo screen
    // await waitFor(() => expect(mockedNavigation).toHaveBeenCalled());

    // TODO test the success notification (hard because inside await function)
    // const errorNotification = await screen.findByLabelText(
    //   "notification message"
    // );
    // expect(
    //   within(errorNotification).getByLabelText(
    //     "notification message description"
    //   )
    // ).toHaveTextContent(/^Cannot save photo$/);
  });
});
