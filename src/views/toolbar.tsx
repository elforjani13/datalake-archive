import React, { FC, useState } from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  GridApi,
  GridToolbarQuickFilter,
  GridToolbarExportProps,
  GridExportMenuItemProps,
  GridPrintExportOptions,
} from "@mui/x-data-grid-pro";
import { MenuItem } from "@mui/material";
import { RecordViewer } from "./record-viewer";
import { FieldDefinition, RecordData } from "~/types/query";

type DataGridMeta = {
  selected: number[];
  fieldsDefinition: FieldDefinition[];
  dataSource: string;
  query: Record<string, any>;
};

type PrintRecordMenuItemProps =
  GridExportMenuItemProps<GridPrintExportOptions> & {
    dataGridMeta: DataGridMeta;
  };

const PrintRecordMenuItem: FC<PrintRecordMenuItemProps> = ({
  hideMenu,
  dataGridMeta,
}) => {
  const apiRef = useGridApiContext();

  const [data, setData] = useState<RecordData[] | undefined>(undefined);
  const [fields, setFields] = useState<FieldDefinition[] | undefined>(
    undefined
  );

  const isDisabled = !dataGridMeta?.selected?.length;

  const getSelection = (apiRef: React.MutableRefObject<GridApi>) => {
    // Select rows and columns
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);

    // Update the displayed fields
    const filteredFields = visibleColumnFields
      .map((vf) => dataGridMeta.fieldsDefinition?.find((f) => f.field === vf))
      .filter((f) => f) as FieldDefinition[];

    setFields(filteredFields);

    const entries = filteredSortedRowIds
      .map((id) => {
        if (!apiRef.current.getCellParams(id, "__check__").value) {
          return null;
        }
        const row: Record<string, any> = {};
        visibleColumnFields.forEach((field) => {
          row[field] =
            apiRef.current.getCellParams(id, field).row[field] ??
            apiRef.current.getCellParams(id, field).value;
        });
        return { id: id, ...row };
      })
      .filter((r): r is RecordData => r !== null);

    setData(entries.length > 0 ? entries : undefined);
  };

  const launchPreview = () => {
    getSelection(apiRef);
  };

  return (
    <>
      <MenuItem disabled={isDisabled} onClick={launchPreview}>
        View / Print selection
      </MenuItem>
      {data && (
        <RecordViewer
          open={true}
          onClose={() => {
            hideMenu?.();
            setData([]);
          }}
          dataSource={dataGridMeta.dataSource}
          data={data}
          fieldsDefinition={fields}
          query={dataGridMeta.query}
        />
      )}
    </>
  );
};

const GridToolbarExport: FC<GridToolbarExportProps> = ({
  csvOptions,
  printOptions,
  dataGridMeta,
}) => (
  <GridToolbarExportContainer>
    <GridCsvExportMenuItem options={csvOptions} />
    <PrintRecordMenuItem options={printOptions} dataGridMeta={dataGridMeta} />
  </GridToolbarExportContainer>
);

export const CustomDataGridToolbar: React.FC<GridToolbarExportProps> = (
  params
) => {
  return (
    <GridToolbarContainer sx={{ p: 2 }}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport {...params} />
      <GridToolbarQuickFilter sx={{ ml: "auto" }} />
    </GridToolbarContainer>
  );
};
