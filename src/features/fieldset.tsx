import { FC, Fragment, ReactNode } from "react";
import { Stack, Typography, StackProps } from "@mui/material";
import { FieldsType } from "~/types/query";

export type FieldsetProps = {
  fieldset: {
    label?: string;
    min?: number;
    fields?: FieldsType[];
  };
  displayField: (field: FieldsType) => ReactNode;
  disableLabel?: boolean;
} & StackProps;

/**
 * displays a list of fields grouped under an optional label
 * @param param0
 * @returns
 */
export const Fieldset: FC<FieldsetProps> = ({
  fieldset,
  displayField,
  direction = "column",
  spacing = 2,
  disableLabel = false,
  children,
}) => {
  const label =
    !disableLabel &&
    (fieldset?.label ||
      (fieldset.min &&
        fieldset.min <= (fieldset?.fields?.length ?? 0) &&
        `Minimum ${fieldset.min} of:`) ||
      (fieldset.fields?.length === 1 && "One of:") ||
      (fieldset.fields?.length ?? (0 > 1 && "All of:")));

  return children || (fieldset?.fields?.length ?? 0) > 0 ? (
    <Stack direction={direction} spacing={spacing} sx={{ width: "100%" }}>
      {label && <Typography variant="subtitle2">{label}</Typography>}
      {children}
      {fieldset.fields?.map((f, i) => (
        <Fragment key={i}>{displayField(f)}</Fragment>
      ))}
    </Stack>
  ) : null;
};
