// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Box } from "native-base";
import { Dispatch, SetStateAction } from "react";
import { AccessibilityProps } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { customTheme } from "../theme/theme";
import { countries } from "../utils/world";

type CustomCountrySelectProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  country: string | undefined;
  setCountry: Dispatch<SetStateAction<string | undefined>>;
  hasValidationError: boolean;
};

interface Props extends CustomCountrySelectProps, AccessibilityProps {}

function CustomCountrySelect({
  open,
  setOpen,
  country,
  setCountry,
  hasValidationError,
  ...rest
}: Props) {
  // need to do this to avoid a typescript error from DropDownPicker
  const dropdownCountries = countries.map(({ name, testID }) => ({
    label: name,
    value: name,
    testID,
  }));

  return (
    <Box {...rest}>
      <DropDownPicker
        placeholder="Select a country"
        open={open}
        value={country || null}
        items={dropdownCountries}
        setOpen={setOpen}
        onPress={setOpen}
        setValue={setCountry}
        testID="country dropdown"
        style={{
          height: 62,
          borderColor: hasValidationError
            ? customTheme.colors.error[500]
            : customTheme.colors.gray[300],
        }}
        dropDownContainerStyle={{
          borderColor: customTheme.colors.gray[300],
        }}
        listMode="SCROLLVIEW"
        labelStyle={{
          fontSize: customTheme.fontSizes.xs,
        }}
        textStyle={{
          fontSize: customTheme.fontSizes.xs,
        }}
        placeholderStyle={{
          color: customTheme.colors.text[500],
        }}
      />
    </Box>
  );
}

export default CustomCountrySelect;
