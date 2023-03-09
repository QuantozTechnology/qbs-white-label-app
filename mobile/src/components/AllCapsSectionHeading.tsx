// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Text } from "native-base";
import { InterfaceTextProps } from "native-base/lib/typescript/components/primitives/Text/types";

interface IAllCapsSectionHeading extends InterfaceTextProps {
  text: string;
}

function AllCapsSectionHeading({ text, ...other }: IAllCapsSectionHeading) {
  return (
    <Text
      fontSize="xl"
      fontWeight="bold"
      letterSpacing="sm"
      mt={4}
      mb={2}
      accessibilityLabel="section header"
      {...other}
    >
      {text}
    </Text>
  );
}

export default AllCapsSectionHeading;
