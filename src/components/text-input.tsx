import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { registerComponent } from "~/utils/functions";

interface TextInputProps extends Omit<TextFieldProps, "onChange"> {
  label: string;
  onChange: (value: string | null) => void;
}

const TextInput: React.FC<TextInputProps> = ({ label, onChange, ...rest }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);

  return <TextField {...rest} label={label} onChange={handleChange} />;
};

export default TextInput;

registerComponent(() => {
  return [TextInput as React.ComponentType<unknown>, 0];
});
