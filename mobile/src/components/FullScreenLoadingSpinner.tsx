// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Box, Heading, Image, Link, Spinner, Text, VStack } from "native-base";
import { useAuth } from "../auth/AuthContext";
import { ImageIdentifier, imagesCollection } from "../utils/images";

function FullScreenLoadingSpinner() {
  const auth = useAuth();
  return (
    <VStack
      justifyContent={"center"}
      alignItems={"center"}
      space={16}
      flex={1}
      accessibilityLabel="full screen loading"
      bg="#324658"
    >
      <VStack
        justifyContent="center"
        alignItems="center"
        space={4}
        paddingX={8}
      >
        <Spinner size={"lg"} color="white" />
        <Heading size="xl" color="white">
          Loading...
        </Heading>
        <Heading size="sm" color="white">
          Hang tight, we are getting things ready for you
        </Heading>
      </VStack>
      <Image
        // any needed to cast from string of enum to type requested from source
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        source={imagesCollection[ImageIdentifier.Loading] as any}
        resizeMode="contain"
        alt="illustration"
      />
      <Box alignItems="center">
        <Text color="white">Taking too long?</Text>
        <Link
          _text={{ color: "primary.400", fontSize: "md" }}
          isUnderlined={false}
          onPress={async () => await auth?.logout()}
        >
          Login again
        </Link>
      </Box>
    </VStack>
  );
}

export default FullScreenLoadingSpinner;
