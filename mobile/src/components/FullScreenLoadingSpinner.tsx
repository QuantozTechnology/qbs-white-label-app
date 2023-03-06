import { Spinner, View } from "native-base";

function FullScreenLoadingSpinner() {
  return (
    <View
      justifyContent={"center"}
      alignItems={"center"}
      height="full"
      accessibilityLabel="full screen loading"
    >
      <Spinner size={"lg"} />
    </View>
  );
}

export default FullScreenLoadingSpinner;
