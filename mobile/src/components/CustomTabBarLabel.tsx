// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Text } from "native-base";
import { customTheme } from "../theme/theme";

type CustomTabBarLabelProps = {
  focused: boolean;
  label: string;
};

function CustomTabBarLabel({ focused, label }: CustomTabBarLabelProps) {
  return (
    <Text
      fontSize="xs"
      color={focused ? customTheme.colors.primary[500] : "muted.500"}
    >
      {label}
    </Text>
  );
}

export default CustomTabBarLabel;
