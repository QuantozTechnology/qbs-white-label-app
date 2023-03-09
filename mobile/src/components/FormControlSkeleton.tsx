// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Skeleton, VStack } from "native-base";

function FormControlSkeleton() {
  return (
    <VStack space={1} mb={1}>
      <Skeleton height={3} w={16} borderRadius="md" />
      <Skeleton height={12} borderRadius="md" />
    </VStack>
  );
}

export default FormControlSkeleton;
