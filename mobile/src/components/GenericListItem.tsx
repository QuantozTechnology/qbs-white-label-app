import { Box, HStack, Text } from "native-base";
import { ReactNode } from "react";
import { AccessibilityProps } from "react-native";

type Props = {
  leftContent: string;
  rightContent: ReactNode;
  bold?: boolean;
};

interface GenericListItemProps extends Props, AccessibilityProps {}

function GenericListItem({
  leftContent,
  rightContent,
  bold,
  ...other
}: GenericListItemProps & AccessibilityProps) {
  return (
    <HStack
      bg="white"
      justifyContent="space-between"
      alignItems="center"
      p={4}
      minH={16}
      rounded="md"
      {...other}
    >
      <Text
        fontSize={bold ? "xl" : "md"}
        fontWeight={bold ? 600 : 400}
        accessibilityLabel="label"
      >
        {leftContent}
      </Text>
      {typeof rightContent === "string" ? (
        <Text
          fontSize={bold ? "xl" : "lg"}
          fontWeight={bold ? 600 : 400}
          accessibilityLabel="content"
        >
          {rightContent}
        </Text>
      ) : (
        <Box accessibilityLabel="content">{rightContent}</Box>
      )}
    </HStack>
  );
}

export default GenericListItem;
