import { FC } from "react";
import { flatMap, entries, some } from "lodash";
import { Chip, Grid } from "@mui/material";
import { camelCaseToWords } from "~/utils/functions";

export type SummaryProps = {
  requiredFields: Array<{ name: string; label?: string }>;
  query: Record<string, unknown>;
};

/**
 * display the required and optional query values in a easy to read form
 * @param param0
 * @returns
 */
export const Summary: FC<SummaryProps> = ({ requiredFields, query }) => {
  const fields = flatMap([
    requiredFields
      .filter((f) => query?.[f.name])
      .map((f) => `${f.label || camelCaseToWords(f.name)}:${query?.[f.name]}`)
      .map((label, index) => (
        <Chip key={index} label={label} color="primary" />
      )),
    entries(query || {})
      .filter(([k, v]) => v && some(requiredFields, (rf) => rf.name == k))
      .map(([k, v]) => `${camelCaseToWords(k)}:${v}`)
      .map((label, index) => <Chip key={index} label={label} />),
  ]);

  return (
    <Grid container justifyContent="center" spacing={1}>
      {fields.map((f, index) => (
        <Grid item key={index}>
          {f}
        </Grid>
      ))}
    </Grid>
  );
};
