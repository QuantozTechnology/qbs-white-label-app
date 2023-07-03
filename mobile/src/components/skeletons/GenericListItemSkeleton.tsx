// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { HStack, Skeleton } from "native-base";
import { getRandomMultipleOfFour } from "../../utils/numbers";

function GenericListItemSkeleton() {
  return (
    <HStack
      bg="white"
      justifyContent="space-between"
      alignItems="center"
      p={4}
      h={16}
      rounded="md"
    >
      <Skeleton w={getRandomMultipleOfFour({ max: 24 })} h={3} rounded="md" />
      <Skeleton w={getRandomMultipleOfFour({ max: 24 })} h={3} rounded="md" />
    </HStack>
  );
}

export default GenericListItemSkeleton;
