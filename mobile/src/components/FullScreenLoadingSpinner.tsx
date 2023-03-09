// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
