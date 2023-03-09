// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { FontAwesome5 } from "@expo/vector-icons";
import { Icon } from "native-base";
import { customTheme } from "../theme/theme";

type CustomTabBarIconProps = {
  focused: boolean;
  iconName: string;
  onPressCallback?: () => void;
};

function CustomTabBarIcon({
  focused,
  iconName,
  onPressCallback,
}: CustomTabBarIconProps) {
  return (
    <Icon
      as={FontAwesome5}
      name={iconName}
      size="md"
      color={focused ? customTheme.colors.primary[500] : "muted.500"}
      onPress={onPressCallback}
    />
  );
}

export default CustomTabBarIcon;
