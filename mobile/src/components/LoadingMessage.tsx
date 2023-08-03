import { Heading, HStack, Spinner } from "native-base";

export default function LoadingMessage() {
  return (
    <HStack space={2} justifyContent="center" p={4}>
      <Spinner accessibilityLabel="Loading transactions" />
      <Heading color="primary.500" fontSize="md">
        Loading
      </Heading>
    </HStack>
  );
}
