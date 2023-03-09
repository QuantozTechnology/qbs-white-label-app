// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Skeleton } from "native-base";

function DataDisplayFieldSkeleton() {
  return (
    <Skeleton h={"80px"} accessibilityLabel="data display loading skeleton" />
  );
}

export default DataDisplayFieldSkeleton;
