import { Ionicons } from "@expo/vector-icons";
import { Button, Icon, Text } from "native-base";

type CustomButtonSelectProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: Record<string, any> | undefined;
  valueCustomText: string;
  onPressCallback: () => void;
};

function CustomButtonSelect({
  value,
  valueCustomText,
  onPressCallback,
}: CustomButtonSelectProps) {
  return (
    <Button
      onPress={onPressCallback}
      bg="white"
      rounded="md"
      minH="62px"
      borderWidth={1}
      borderColor="text.300"
      justifyContent="space-between"
      rightIcon={<Icon as={Ionicons} name="caret-down" />}
      _stack={{
        flex: 1,
        justifyContent: "space-between",
      }}
      _pressed={{
        bg: "white",
      }}
    >
      {value == null ? (
        <Text color="text.400">Select an asset</Text>
      ) : (
        <Text>{valueCustomText}</Text>
      )}
    </Button>
  );
}

export default CustomButtonSelect;
