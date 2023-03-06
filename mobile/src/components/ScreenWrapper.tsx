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
