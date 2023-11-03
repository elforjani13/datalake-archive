import { FC } from "react";
import {
  Stack,
  Button,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { ResponsiveDialog } from "~/features/responsive-dialog";
import QueryConfig from "~/config/queryConfig.json";
import { PrintViewButton } from "~/utils/print-view-button";
import { FieldDefinition, RecordData } from "~/types/query";

type RecordViewerProps = {
  dataSource?: string;
  data?: RecordData | RecordData[];
  fieldsDefinition?: FieldDefinition[];
  highlightedField?: string;
  query?: Record<string, any>;
  open: boolean;
  onClose: () => void;
};

export const RecordViewer: FC<RecordViewerProps> = ({
  data,
  dataSource,
  fieldsDefinition,
  highlightedField,
  query,
  open,
  onClose,
}) => {
  const requiredFields = QueryConfig.requiredFields
    .map((group) => group.fields)
    .flat();

  const title = requiredFields
    .map((f) => {
      if ("label" in f && f.label) {
        const value = query?.[f.name];
        return value ? `${f.label}: ${value}` : null;
      }
      return null;
    })
    .filter((value) => value !== null)
    .join(", ");

  const formatValue = (row: RecordData, field: FieldDefinition | string) => {
    const fieldDef =
      typeof field === "string"
        ? fieldsDefinition?.find((f) => f.field === field)
        : field;

    if (!fieldDef) return "";
    const value = row[fieldDef.field];
    return fieldDef.valueFormatter?.({ value }) || value;
  };

  const renderRecord = (recordData: RecordData) => {
    if (!fieldsDefinition) {
      return null;
    }

    return (
      <List disablePadding dense key={recordData.id}>
        <ListSubheader color="primary" sx={{ borderBottom: "1px solid" }}>
          <ListItemText
            primary={`${dataSource || ""} ${recordData.id || ""}`}
            secondary={
              recordData.createdAt &&
              `Created at: ${formatValue(recordData, "createdAt")}`
            }
            primaryTypographyProps={{
              variant: "body1",
              sx: { fontWeight: "bold" },
            }}
          />
        </ListSubheader>
        {fieldsDefinition
          .filter(
            (f) =>
              !["id", "actions", "createdAt"].includes(f.field) &&
              recordData?.[f.field]
          )
          .map((f) => (
            <ListItem key={f.field} selected={f.field === highlightedField}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={`${f.headerName}:`}
                secondary={formatValue(recordData, f)}
                primaryTypographyProps={{
                  variant: "body1",
                  sx: { fontWeight: "bold", width: "40%" },
                }}
                secondaryTypographyProps={{
                  variant: "body1",
                  width: "60%",
                }}
              />
            </ListItem>
          ))}
      </List>
    );
  };

  const content = data && (
    <Stack spacing={3}>
      {Array.isArray(data) ? data.map(renderRecord) : renderRecord(data)}
    </Stack>
  );

  return (
    <ResponsiveDialog title={title} open={open} width="md" onClose={onClose}>
      <DialogContent sx={{ pt: 0, px: 1 }}>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <PrintViewButton title={title} content={content} />
      </DialogActions>
    </ResponsiveDialog>
  );
};
