// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { LinearGradient } from "expo-linear-gradient";
import { Box, Heading, Image, Link, Spinner, Text, VStack } from "native-base";
import { useWindowDimensions } from "react-native";
import { useAuth } from "../auth/AuthContext";

function FullScreenLoadingSpinner() {
  const auth = useAuth();
  const { height } = useWindowDimensions();
  return (
    <VStack
      justifyContent="space-evenly"
      alignItems={"center"}
      flex={1}
      accessibilityLabel="full screen loading"
    >
      <LinearGradient
        colors={["#324658", "#030C0C"]}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          height: height * 1.5,
        }}
      />
      <Image
        // any needed to cast from string of enum to type requested from source
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        source={require("../../assets/qbs_logo_light.png")}
        size="lg"
        resizeMode="contain"
        alt="logo"
      />
      <VStack
        justifyContent="center"
        alignItems="center"
        space={4}
        paddingX={20}
      >
        <Spinner size={"lg"} color="white" />
        <Heading size="md" color="white" textAlign="center">
          Hang tight, we are getting things ready for you
        </Heading>
      </VStack>
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
