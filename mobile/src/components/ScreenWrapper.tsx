// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { VStack } from "native-base";
import { InterfaceVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";
import { ReactNode } from "react";

type ScreenWrapperProps = {
  children: ReactNode | null;
};

function ScreenWrapper(props: ScreenWrapperProps & InterfaceVStackProps) {
  const { children, ...rest } = props;
  return (
    <VStack p={4} background="primary.100" {...rest}>
      {children}
    </VStack>
  );
}

export default ScreenWrapper;
