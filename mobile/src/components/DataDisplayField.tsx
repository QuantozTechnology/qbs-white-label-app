// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { VStack, Text, View, HStack } from "native-base";
import { InterfaceHStackProps } from "native-base/lib/typescript/components/primitives/Stack/HStack";
import { ReactElement, ReactNode } from "react";
import { AccessibilityProps } from "react-native";

interface IDataDisplayField extends AccessibilityProps, InterfaceHStackProps {
  label: string;
  value: string | ReactNode;
  children?: ReactNode;
  action?: ReactElement;
}

function DataDisplayField({
  label,
  children,
  value,
  action,
  bg,
  ...other
}: IDataDisplayField) {
  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      bgColor="warmGray.50"
      shadow="0"
      mb={0.3}
      bg={bg}
    >
      <VStack space={0} p={4} {...other}>
        <Text fontSize="sm" color="gray.400" accessibilityLabel="label">
          {label}
        </Text>
        {typeof value === "string" ? (
          <Text fontSize="md" accessibilityLabel="value">
            {value}
          </Text>
        ) : (
          <View>{value}</View>
        )}
        {children}
      </VStack>
      {action}
    </HStack>
  );
}

export default DataDisplayField;
