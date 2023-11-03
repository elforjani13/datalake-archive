import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { registerComponent } from "~/utils/functions";
import { EnumValue, TypeDefinition } from "~/types/query";

type EnumInputProps = {
  value: string | null | undefined;
  enumValues: EnumValue[];
  onChange: (value: string | null | undefined) => void;
};

const EnumInput: React.FC<EnumInputProps> = ({
  value,
  enumValues,
  onChange,
  ...rest
}) => {
  return (
    <Autocomplete
      autoComplete
      autoHighlight
      autoSelect
      openOnFocus
      value={value || null}
      options={enumValues.map((v) => v.name)}
      onChange={(_evt: React.ChangeEvent<any>, val: string | null) =>
        onChange(val || undefined)
      }
      renderInput={(params) => <TextField {...params} {...rest} />}
    />
  );
};

export default EnumInput;

registerComponent((definition: TypeDefinition) => {
  if (
    definition.type &&
    definition.type?.enumValues &&
    definition.type?.enumValues.length > 0
  ) {
    return [EnumInput as React.ComponentType<any>, 50];
  }
  return null;
});
