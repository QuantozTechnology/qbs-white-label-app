// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { AntDesign } from "@expo/vector-icons";
import { HStack, Pressable, Icon, Text } from "native-base";
import { Dispatch, SetStateAction } from "react";

type DocumentTypeOptionProps = {
  id: "id" | "passport";
  label: string;
  selected: "id" | "passport";
  setSelected: Dispatch<SetStateAction<"id" | "passport">>;
};

function DocumentTypeOption({
  id,
  label,
  selected,
  setSelected,
}: DocumentTypeOptionProps) {
  return (
    <Pressable
      onPress={() => setSelected(id)}
      accessibilityLabel="document type option"
    >
      <HStack
        alignItems="center"
        bg="white"
        rounded="md"
        p={4}
        space={4}
        borderWidth={1}
        borderColor={selected === id ? "primary.500" : "gray.300"}
      >
        <Icon
          as={AntDesign}
          name={selected === id ? "checkcircle" : "checkcircleo"}
          size="lg"
          color={selected === id ? "primary.500" : "gray.300"}
          accessibilityLabel={`${
            selected === id ? "selected" : "not selected"
          } option icon`}
        />
        <Text accessibilityLabel="label">{label}</Text>
      </HStack>
    </Pressable>
  );
}

export default DocumentTypeOption;
