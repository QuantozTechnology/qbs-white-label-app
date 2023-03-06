import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Heading, HStack, Icon, Pressable } from "native-base";
import { getHeaderTitle } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { ReactElement } from "react";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CustomNavigationHeaderProps = {
  customIcon?: ReactElement;
  onPressCallback?: () => void;
  rightHeaderIcons?: ReactElement;
};
function CustomNavigationHeader(
  props: CustomNavigationHeaderProps &
    (BottomTabHeaderProps | NativeStackHeaderProps)
) {
  const insets = useSafeAreaInsets();
  const {
    navigation,
    options,
    route,
    customIcon,
    onPressCallback,
    rightHeaderIcons,
  } = props;
  const title = getHeaderTitle(options, route.name);

  return (
    <HStack
      p={4}
      pt={`${insets.top}px`}
      pb={2}
      bg="white"
      justifyContent="space-between"
      alignItems="center"
    >
      {(onPressCallback != null || ("back" in props && props.back)) && (
        <Pressable
          onPress={
            props.onPressCallback
              ? props.onPressCallback
              : "back" in props && props.back
              ? () => {
                  navigation.goBack();
                }
              : undefined
          }
          py={2}
        >
          {customIcon ?? (
            <Icon
              as={Ionicons}
              name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
              size="xl"
              color="primary.500"
            />
          )}
        </Pressable>
      )}
      <Heading fontWeight="black" letterSpacing="sm" flex={1} pl={4}>
        {title}
      </Heading>
      {rightHeaderIcons}
    </HStack>
  );
}

export default CustomNavigationHeader;
