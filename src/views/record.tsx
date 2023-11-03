import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
} from "@mui/material";
import { PrintViewButton } from "~/utils/print-view-button";
import { ResponsiveDialog } from "~/features/responsive-dialog";
import QueryConfig from "~/config/queryConfig.json";
import { FieldDefinition } from "~/types/query";

type RecordProps = {
  dataSource?: string;
  data: Record<string, any> | Record<string, any>[];
  fieldsDefinition: FieldDefinition[];
  highlightedField?: string;
  query: Record<string, any>;
  open: boolean;
  onClose: () => void;
};

const Record: React.FC<RecordProps> = (props) => {
  const {
    dataSource,
    data,
    fieldsDefinition,
    highlightedField,
    query,
    open,
    onClose,
  } = props;

  const requiredFields = QueryConfig.requiredFields.map((g) => g.fields).flat();
  const title = requiredFields
    .filter((f) => query[f.name])
    .map((f) => `${f.name} : ${query[f.name]}`)
    .join(", ");

  const getFormattedValue = (row: Record<string, any>, field: string) => {
    const fieldDef =
      typeof field === "string"
        ? (fieldsDefinition?.find(
            (f) => f.field === field
          ) as (typeof fieldsDefinition)[number])
        : field;

    return (
      fieldDef?.valueFormatter?.({ value: row[fieldDef.field] }) ??
      row[fieldDef?.field]
    );
  };

  const renderRecord = (recordData: Record<string, any>) => (
    <List disablePadding dense key={recordData.id}>
      <ListSubheader color="primary" sx={{ borderBottom: "1px solid" }}>
        <ListItemText
          primary={`${dataSource || ""} ${recordData.id || ""}`}
          secondary={
            recordData.createdAt &&
            `Created at: ${getFormattedValue(recordData, "createdAt")}`
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
          <ListItem
            key={f.field}
            sx={{
              ...(f.field === highlightedField && {
                backgroundColor: "selected",
              }),
            }}
          >
            <ListItemText
              sx={{ display: "flex" }}
              primary={`${f.headerName}:`}
              secondary={getFormattedValue(recordData, f.field)}
              primaryTypographyProps={{
                variant: "body1",
                sx: { fontWeight: "bold", width: "40%" },
              }}
              secondaryTypographyProps={{
                variant: "body1",
                color: "textPrimary",
                width: "60%",
              }}
            />
          </ListItem>
        ))}
    </List>
  );

  const content = Array.isArray(data) ? (
    <Stack spacing={3}>{data.map(renderRecord)}</Stack>
  ) : (
    renderRecord(data)
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

export default Record;
