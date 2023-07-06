import { Heading, VStack } from "native-base";

type LargeHeaderCardProps = {
  primaryText: string;
  secondaryText: string;
};

function LargeHeaderCard({ primaryText, secondaryText }: LargeHeaderCardProps) {
  return (
    <VStack
      space={3}
      bg="white"
      rounded="md"
      justifyContent="center"
      alignItems="center"
      px={4}
      py={6}
    >
      <Heading size="lg" accessibilityLabel="primary text">
        {primaryText}
      </Heading>
      <Heading size="2xl" accessibilityLabel="secondary text">
        {secondaryText}
      </Heading>
    </VStack>
  );
}

export default LargeHeaderCard;
