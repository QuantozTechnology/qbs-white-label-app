// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

/* eslint-disable  @typescript-eslint/no-explicit-any */
import { rest } from "msw";
import { APIError, ApiErrorCode } from "../../api/generic/error.interface";
import { fireEvent, render, screen, waitFor } from "../../jest/test-utils";
import { server } from "../../mocks/server";
import { backendApiUrl } from "../../utils/axios";
import ConsumerRegistration from "../ConsumerRegistration";
import { mockRefresh } from "../../jest/jest.setup";

describe("ConsumerRegistration", () => {
  const mockNavigate = jest.fn();

  const createTestProps = (props: Record<string, unknown>) => ({
    navigation: {
      navigate: mockNavigate,
    },
    ...props,
  });

  let props: any;

  test("renders form fields", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);

    expect(await screen.findByLabelText("first name")).toBeTruthy();
    expect(screen.getByLabelText("last name")).toBeTruthy();
    expect(screen.getByLabelText("date of birth")).toBeTruthy();
    expect(screen.getByLabelText("country of residence")).toBeTruthy();
    expect(screen.getByLabelText("terms checkbox")).toBeTruthy();
  });

  it("displays the form fields with expected initial values", () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);

    const firstName = screen.getByLabelText("first name");
    const lastName = screen.getByLabelText("last name");
    const dateOfBirth = screen.getByLabelText("date of birth");
    const countryField = screen.getByLabelText("country of residence");
    const terms = screen.getByLabelText("terms checkbox");
    const createAccountButton = screen.getByLabelText("create account");

    expect(firstName.props.value).toBeUndefined();
    expect(lastName.props.value).toBeUndefined();
    expect(dateOfBirth.props.value).toBe("");
    expect(countryField).toHaveTextContent("");
    expect(terms.props.checked).toBeFalsy();
    expect(createAccountButton).toBeTruthy();
  });

  it("Fills in the form and creates the user", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);

    const firstName = screen.getByLabelText("first name");
    const lastName = screen.getByLabelText("last name");
    const dateOfBirth = screen.getByLabelText("date of birth");
    const country = screen.getByLabelText("country of residence");
    const terms = screen.getByLabelText("terms checkbox");
    const createAccountButton = screen.getByLabelText("create account");

    fireEvent(firstName, "onChangeText", "John");
    expect(firstName.props.value).toBe("John");

    fireEvent(lastName, "onChangeText", "Doe");
    expect(lastName.props.value).toBe("Doe");

    fireEvent(dateOfBirth, "onChangeText", "30012000");
    expect(dateOfBirth.props.value).toBe("30/01/2000");

    expect(country.props.value).toBeUndefined();
    fireEvent(country, "onValueChange", "Austria");

    const updatedCountry = await screen.findByPlaceholderText(
      "Select your country"
    );
    expect(updatedCountry.props.value).toBe("Austria");

    fireEvent(terms, "onChange");

    fireEvent(createAccountButton, "onPress");

    // refreshes customer context and goes back to main navigator
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
  });

  it("updates the navigator screens if an API error of InvalidStatus occurs during account creation", async () => {
    // mock POST api/accounts to return 400 with Code = InvalidStatus
    const mockedError: APIError = {
      Errors: [
        {
          Code: ApiErrorCode.InvalidStatus,
          Message: "Customer not valid",
          Target: "Nexus",
        },
      ],
    };

    server.use(
      rest.post(`${backendApiUrl}/api/accounts`, (_req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json(mockedError));
      })
    );

    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);

    const firstName = screen.getByLabelText("first name");
    const lastName = screen.getByLabelText("last name");
    const dateOfBirth = screen.getByLabelText("date of birth");
    const country = screen.getByLabelText("country of residence");
    const terms = screen.getByLabelText("terms checkbox");
    const createAccountButton = screen.getByLabelText("create account");

    fireEvent(firstName, "onChangeText", "John");
    expect(firstName.props.value).toBe("John");

    fireEvent(lastName, "onChangeText", "Doe");
    expect(lastName.props.value).toBe("Doe");

    fireEvent(dateOfBirth, "onChangeText", "30012000");
    expect(dateOfBirth.props.value).toBe("30/01/2000");

    expect(country.props.value).toBeUndefined();
    fireEvent(country, "onValueChange", "Austria");

    const updatedCountry = await screen.findByPlaceholderText(
      "Select your country"
    );
    expect(updatedCountry.props.value).toBe("Austria");

    fireEvent(terms, "onChange");

    fireEvent(createAccountButton, "onPress");

    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
  });

  it("updates the navigator screens if an API error of CustomerNotActive occurs during account creation", async () => {
    const mockedError: APIError = {
      Errors: [
        {
          Code: ApiErrorCode.CustomerNotActive,
          Message: "Customer not active",
          Target: "Nexus",
        },
      ],
    };

    server.use(
      rest.post(`${backendApiUrl}/api/accounts`, (_req, rest, ctx) => {
        return rest(ctx.status(400), ctx.json(mockedError));
      })
    );

    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);

    const firstName = screen.getByLabelText("first name");
    const lastName = screen.getByLabelText("last name");
    const dateOfBirth = screen.getByLabelText("date of birth");
    const country = screen.getByLabelText("country of residence");
    const terms = screen.getByLabelText("terms checkbox");
    const createAccountButton = screen.getByLabelText("create account");

    fireEvent(firstName, "onChangeText", "John");
    expect(firstName.props.value).toBe("John");

    fireEvent(lastName, "onChangeText", "Doe");
    expect(lastName.props.value).toBe("Doe");

    fireEvent(dateOfBirth, "onChangeText", "30012000");
    expect(dateOfBirth.props.value).toBe("30/01/2000");

    expect(country.props.value).toBeUndefined();
    fireEvent(country, "onValueChange", "Austria");

    const updatedCountry = await screen.findByPlaceholderText(
      "Select your country"
    );
    expect(updatedCountry.props.value).toBe("Austria");

    fireEvent(terms, "onChange");

    fireEvent(createAccountButton, "onPress");

    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
  });

  it("should return error if firstName is undefined or an empty string", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);

    const firstName = await screen.findByLabelText("first name");
    const createAccountButton = screen.getByLabelText("create account");

    fireEvent(createAccountButton, "onPress");
    const firstNameError = await screen.findByLabelText("first name error");

    expect(firstNameError).toHaveTextContent(/^First name must be specified$/);

    fireEvent(firstName, "onChangeText", "");
    fireEvent(createAccountButton, "onPress");
    const firstNameErrorEmptyString = await screen.findByLabelText(
      "first name error"
    );

    expect(firstNameErrorEmptyString).toHaveTextContent(
      /^First name must be longer than 1 character$/
    );
  });

  it("should return error if last name is undefined or an empty string", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);

    const firstName = await screen.findByLabelText("first name");
    const lastName = await screen.findByLabelText("last name");
    const createAccountButton = screen.getByLabelText("create account");

    fireEvent(firstName, "onChangeText", "John");
    fireEvent(createAccountButton, "onPress");
    const lastNameError = await screen.findByLabelText("last name error");

    expect(lastNameError).toHaveTextContent(/^Last name must be specified$/);

    fireEvent(lastName, "onChangeText", "");
    fireEvent(createAccountButton, "onPress");
    const lastNameErrorEmptyString = await screen.findByLabelText(
      "last name error"
    );

    expect(lastNameErrorEmptyString).toHaveTextContent(
      /^Last name must be longer than 1 character$/
    );
  });

  it("should return error if the birth date is not valid", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);

    const firstName = screen.getByLabelText("first name");
    const lastName = screen.getByLabelText("last name");
    const dateOfBirth = screen.getByLabelText("date of birth");
    const createAccountButton = screen.getByLabelText("create account");

    fireEvent(firstName, "onChangeText", "John");
    expect(firstName.props.value).toBe("John");

    fireEvent(lastName, "onChangeText", "Doe");
    expect(lastName.props.value).toBe("Doe");

    fireEvent(dateOfBirth, "onChangeText", "010112");
    fireEvent(createAccountButton, "onPress");

    const dateOfBirthError = await screen.findByLabelText(
      "date of birth error"
    );

    expect(dateOfBirthError).toHaveTextContent(
      /^A valid date of birth must be specified$/
    );
  });

  it("should return error if the birth date is in the future", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);

    const firstName = screen.getByLabelText("first name");
    const lastName = screen.getByLabelText("last name");
    const dateOfBirth = screen.getByLabelText("date of birth");
    const createAccountButton = screen.getByLabelText("create account");

    fireEvent(firstName, "onChangeText", "John");
    expect(firstName.props.value).toBe("John");

    fireEvent(lastName, "onChangeText", "Doe");
    expect(lastName.props.value).toBe("Doe");

    fireEvent(dateOfBirth, "onChangeText", "01012099");
    fireEvent(createAccountButton, "onPress");

    const dateOfBirthError = await screen.findByLabelText(
      "date of birth error"
    );

    expect(dateOfBirthError).toHaveTextContent(
      /^Date of birth cannot be in the future$/
    );
  });

  it("should return error if the country has not been selected", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);

    const firstName = screen.getByLabelText("first name");
    const lastName = screen.getByLabelText("last name");
    const dateOfBirth = screen.getByLabelText("date of birth");
    const createAccountButton = screen.getByLabelText("create account");

    fireEvent(firstName, "onChangeText", "John");
    expect(firstName.props.value).toBe("John");

    fireEvent(lastName, "onChangeText", "Doe");
    expect(lastName.props.value).toBe("Doe");

    fireEvent(dateOfBirth, "onChangeText", "01012020");
    fireEvent(createAccountButton, "onPress");

    const dateOfBirthError = await screen.findByLabelText("country error");

    expect(dateOfBirthError).toHaveTextContent(/^Country must be specified$/);
  });
});
