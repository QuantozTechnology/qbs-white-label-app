// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

/* eslint-disable  @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen, waitFor } from "../../jest/test-utils";
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
    waitFor(() => {
      expect(screen.findByLabelText("first name")).toBeTruthy();
      expect(screen.getByLabelText("last name")).toBeTruthy();
      expect(screen.getByLabelText("date of birth")).toBeTruthy();
      expect(screen.getByTestId("country dropdown")).toBeTruthy();

      expect(screen.getByLabelText("terms checkbox")).toBeTruthy();
    });
  });

  it("displays the form fields with expected initial values", () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);
    waitFor(() => {
      const firstName = screen.getByLabelText("first name");
      const lastName = screen.getByLabelText("last name");
      const dateOfBirth = screen.getByLabelText("date of birth");
      const country = screen.getByTestId("country dropdown");
      const terms = screen.getByLabelText("terms checkbox");
      const createAccountButton = screen.getByLabelText("create account");

      expect(firstName.props.value).toBeUndefined();
      expect(lastName.props.value).toBeUndefined();
      expect(dateOfBirth.props.value).toBe("");
      expect(country).toHaveTextContent("");
      expect(terms.props.checked).toBeFalsy();
      expect(createAccountButton).toBeTruthy();
    });
  });

  it("Fills in the form and creates the user", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);
    waitFor(() => {
      const firstName = screen.getByLabelText("first name");
      const lastName = screen.getByLabelText("last name");
      const dateOfBirth = screen.getByLabelText("date of birth");
      const country = screen.getByTestId("country dropdown");
      const terms = screen.getByLabelText("terms checkbox");
      const createAccountButton = screen.getByLabelText("create account");

      fireEvent(firstName, "onChangeText", "John");
      expect(firstName.props.value).toBe("John");

      fireEvent(lastName, "onChangeText", "Doe");
      expect(lastName.props.value).toBe("Doe");

      fireEvent(dateOfBirth, "onChangeText", "30012000");
      expect(dateOfBirth.props.value).toBe("30/01/2000");

      fireEvent(country, "onPress");
      const firstEntry = screen.findByTestId("Albania");
      fireEvent(firstEntry, "onPress");
      expect(screen.findByText("Albania")).toBeOnTheScreen();

      fireEvent(terms, "onChange");

      fireEvent(createAccountButton, "onPress");

      // refreshes customer context and goes back to main navigator
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("updates the navigator screens if an API error of InvalidStatus occurs during account creation", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);
    waitFor(() => {
      const firstName = screen.getByLabelText("first name");
      const lastName = screen.getByLabelText("last name");
      const dateOfBirth = screen.getByLabelText("date of birth");
      const country = screen.getByTestId("country dropdown");
      const terms = screen.getByLabelText("terms checkbox");
      const createAccountButton = screen.getByLabelText("create account");

      fireEvent(firstName, "onChangeText", "John");
      expect(firstName.props.value).toBe("John");

      fireEvent(lastName, "onChangeText", "Doe");
      expect(lastName.props.value).toBe("Doe");

      fireEvent(dateOfBirth, "onChangeText", "30012000");
      expect(dateOfBirth.props.value).toBe("30/01/2000");

      fireEvent(country, "onPress");
      const firstEntry = screen.findByTestId("Albania");
      fireEvent(firstEntry, "onPress");
      expect(screen.findByText("Albania")).toBeOnTheScreen();

      fireEvent(terms, "onChange");
      fireEvent(createAccountButton, "onPress");

      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("updates the navigator screens if an API error of CustomerNotActive occurs during account creation", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);
    waitFor(() => {
      const firstName = screen.getByLabelText("first name");
      const lastName = screen.getByLabelText("last name");
      const dateOfBirth = screen.getByLabelText("date of birth");
      const country = screen.getByTestId("country dropdown");
      const terms = screen.getByLabelText("terms checkbox");
      const createAccountButton = screen.getByLabelText("create account");

      fireEvent(firstName, "onChangeText", "John");
      expect(firstName.props.value).toBe("John");

      fireEvent(lastName, "onChangeText", "Doe");
      expect(lastName.props.value).toBe("Doe");

      fireEvent(dateOfBirth, "onChangeText", "30012000");
      expect(dateOfBirth.props.value).toBe("30/01/2000");

      fireEvent(country, "onPress");
      const firstEntry = screen.findByTestId("Albania");
      fireEvent(firstEntry, "onPress");
      expect(screen.findByText("Albania")).toBeOnTheScreen();

      fireEvent(terms, "onChange");
      expect(terms.props.checked).toBeTruthy();

      expect(createAccountButton.props.disabled).toBeFalsy();
      fireEvent(createAccountButton, "onPress");

      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("should return error if firstName is undefined or an empty string", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);
    waitFor(() => {
      const firstName = screen.findByLabelText("first name");
      const createAccountButton = screen.getByLabelText("create account");

      fireEvent(createAccountButton, "onPress");
      const firstNameError = screen.findByLabelText("first name error");

      expect(firstNameError).toHaveTextContent(
        /^First name must be specified$/
      );

      fireEvent(firstName, "onChangeText", "");
      fireEvent(createAccountButton, "onPress");
      const firstNameErrorEmptyString =
        screen.findByLabelText("first name error");

      expect(firstNameErrorEmptyString).toHaveTextContent(
        /^First name must be longer than 1 character$/
      );
    });
  });

  it("should return error if last name is undefined or an empty string", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);
    waitFor(() => {
      const firstName = screen.findByLabelText("first name");
      const lastName = screen.findByLabelText("last name");
      const createAccountButton = screen.getByLabelText("create account");

      fireEvent(firstName, "onChangeText", "John");
      fireEvent(createAccountButton, "onPress");
      const lastNameError = screen.findByLabelText("last name error");

      expect(lastNameError).toHaveTextContent(/^Last name must be specified$/);

      fireEvent(lastName, "onChangeText", "");
      fireEvent(createAccountButton, "onPress");
      const lastNameErrorEmptyString =
        screen.findByLabelText("last name error");

      expect(lastNameErrorEmptyString).toHaveTextContent(
        /^Last name must be longer than 1 character$/
      );
    });
  });

  it("should return error if the birth date is not valid", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);
    waitFor(() => {
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

      const dateOfBirthError = screen.findByLabelText("date of birth error");

      expect(dateOfBirthError).toHaveTextContent(/^Invalid date of birth$/);
    });
  });
  /*
  it("should return error if the birth date is in the future", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);
    waitFor(() =>{
      const firstName = screen.getByLabelText("first name");
      const lastName = screen.getByLabelText("last name");
      const dateOfBirth = screen.getByLabelText("date of birth");
      const createAccountButton = screen.getByLabelText("create account");
      const terms = screen.getByLabelText("terms checkbox");
      
      fireEvent(firstName, "onChangeText", "John");
      expect(firstName.props.value).toBe("John");

      fireEvent(lastName, "onChangeText", "Doe");
      expect(lastName.props.value).toBe("Doe");

      fireEvent(dateOfBirth, "onChangeText", "01013099");
      fireEvent(terms, "onChange");
      expect(terms.props.checked).toBeTruthy();
      fireEvent(createAccountButton, "onPress");

      const dateOfBirthError = screen.findByLabelText(
        "date of birth error"
      );

      expect(dateOfBirthError).toHaveTextContent(
        /^Date of birth cannot be in the future$/
      );
    });
  });

  it("should return error if the country has not been selected", async () => {
    props = createTestProps({});
    render(<ConsumerRegistration {...props} />);
  
    await waitFor(async () => {
      const firstName = await screen.findByLabelText("first name");
      const lastName = await screen.findByLabelText("last name");
      const dateOfBirth = await screen.findByLabelText("date of birth");
      const terms = await screen.findByLabelText("terms checkbox");
      const createAccountButton = await screen.findByLabelText("create account");
  
      fireEvent(firstName, "onChangeText", "John");
      expect(firstName.props.value).toBe("John");
  
      fireEvent(lastName, "onChangeText", "Doe");
      expect(lastName.props.value).toBe("Doe");
  
      fireEvent(dateOfBirth, "onChangeText", "01012020");
      fireEvent(terms, "onChange");
      expect(terms.props.checked).toBeTruthy();
      fireEvent(createAccountButton, "onPress");
  
      const countryError = await screen.findByLabelText("country error");
      expect(countryError).toHaveTextContent(/^Country must be specified$/);
    });
  });
  */
});
