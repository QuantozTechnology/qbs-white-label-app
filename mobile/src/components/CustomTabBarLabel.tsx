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
