// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Box, Stack, Text } from "native-base";

type NoMoreButtonProps = {
  entityName?: string;
};

function NoMoreButton({ entityName }: NoMoreButtonProps) {
  return (
    <Stack alignItems="center" py={2}>
      <Box bg="text.200" p={1} rounded="full" px={2}>
        <Text
          textAlign="center"
          color="gray.400"
          fontWeight="bold"
          fontSize="xs"
        >
          No more {entityName ?? "entries"} to show
        </Text>
      </Box>
    </Stack>
  );
}

export default NoMoreButton;
