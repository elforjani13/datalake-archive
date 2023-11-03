import { FC, ReactNode } from "react";
import { Fieldset, FieldsetProps } from "./fieldset";
import { FieldsType } from "~/types/query";

type OptionalFieldsProps = {
  withBlankLabel?: boolean;
  children?: ReactNode[];
  fields: FieldsType[] | undefined;
} & Omit<FieldsetProps, "fieldset">;

/**
 * fills in the label prop of fieldset for use in the optional section
 * @param param0
 * @returns
 */
export const OptionalFields: FC<OptionalFieldsProps> = ({
  withBlankLabel = false,
  fields,
  children,
  ...fieldsetProps
}) => {
  return (
    <Fieldset
      {...fieldsetProps}
      fieldset={{
        label: withBlankLabel ? `\u00A0` : "Refine your search:",
        fields: fields,
      }}
    >
      {children}
    </Fieldset>
  );
};
