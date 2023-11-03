import {
  FC,
  useEffect,
  useState,
  useMemo,
  MouseEvent,
  useCallback,
} from "react";
import dayjs from "dayjs";
import {
  DataGridPro,
  GridActionsCellItem,
  GridColDef,
  GridRowsProp,
} from "@mui/x-data-grid-pro";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  PlaylistRemove as ClearIcon,
  FindInPage as ViewIcon,
} from "@mui/icons-material";
import { camelCaseToWords, buildGraphQLQuery } from "~/utils/functions";
import { QUERY_ARGUMENT, DATAGRID_TYPE_MAPPING } from "~/utils/constants";
import {
  TypeDefinition,
  DataConfigType,
  DataSource,
  RecordData,
} from "~/types/query";
import { SectionDivider } from "~/features/section-divider";
import { CustomDataGridToolbar } from "./toolbar";
import { RecordViewer } from "./record-viewer";
import DataConfig from "~/config/dataConfig.json";
import QueryConfig from "~/config/queryConfig.json";

type ResultsProps = {
  gqlQuery: any;
  gqlQueryDefinition: DataSource;
  onClear: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
};

const FIELD = QUERY_ARGUMENT.name;

export const Results: FC<ResultsProps> = ({
  gqlQuery,
  gqlQueryDefinition,
  onClear,
}) => {
  const [rows, setRows] = useState<GridRowsProp[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [currentRow, setCurrentRow] = useState<RecordData[]>([]);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>();

  // Define a memoized constant
  const actionsColumn = useMemo(
    () => ({
      field: "actions",
      headerName: "",
      type: "actions",
      width: 30,
      getActions: (params: any) => [
        <GridActionsCellItem
          key={params.id}
          icon={
            <Tooltip title="View record">
              <ViewIcon />
            </Tooltip>
          }
          onClick={() => setCurrentRow(params.row)}
          label="View record"
        />,
      ],
    }),
    []
  );

  // Generates field columns based on field definitions
  const fieldColumns = (fieldDefs: TypeDefinition["fields"] | undefined) => {
    return (
      fieldDefs?.map((f) => {
        const type = DATAGRID_TYPE_MAPPING[f.type.name] || "singleSelect";

        return {
          field: f.name,
          headerName: camelCaseToWords(f.name),
          type,
          valueOptions: (f.type.enumValues || []).map((v) => v.name),
          width: ["String", "Time"].includes(f.type.name) ? 180 : 100,
          valueGetter: ["Date", "Time"].includes(f.type.name)
            ? ({ value }: { value: string }) => value && new Date(value)
            : undefined,
          valueFormatter: ({ value }: { value: string }) => {
            if (f.type.name === "Date")
              return value && dayjs(value).format("YYYY-MM-DD");
            if (f.type.name === "Time")
              return value && dayjs(value).format("YYYY-MM-DD h:mm a");
            return undefined;
          },
        };
      }) || []
    );
  };

  // When we know the query definition, build the column definitions
  useEffect(() => {
    const fieldDefs = gqlQueryDefinition?.type?.fields;
    const columns = [actionsColumn, ...fieldColumns(fieldDefs)];
    setColumns(columns);
  }, [actionsColumn, gqlQueryDefinition]);

  // Define an array of required fields by flattening fields within groups
  const requiredFields = QueryConfig.requiredFields.flatMap(
    (group) => group.fields
  );

  const dataConfig: DataConfigType = DataConfig;
  const identifierFields = dataConfig?.[gqlQueryDefinition?.name]?.id;

  const processResults = useCallback(
    (resultsJson: any) => {
      if (!resultsJson) return;
      const data = resultsJson?.data?.[gqlQueryDefinition?.name];
      setRows(
        data?.map((line: any, index: number) => {
          const id = identifierFields
            ? identifierFields
                .map((fieldName: string) => line?.[fieldName])
                .join(" / ")
            : String(index);

          return {
            id: id,
            ...line,
          };
        }) || []
      );
    },
    [gqlQueryDefinition?.name, identifierFields]
  );

  // Serialize the constructed query and initiate the search
  useEffect(() => {
    if (!gqlQuery) return;

    fetch(QueryConfig.url + buildGraphQLQuery(gqlQuery, gqlQueryDefinition))
      .then((response) => response.json())
      .then((json) => {
        processResults(json);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [gqlQuery, gqlQueryDefinition, processResults]);

  // Create an array of values for required fields from gqlQuery
  const fieldValues = requiredFields
    .map((field) => gqlQuery?.[FIELD][field.name])
    .filter((value) => value);

  // Construct the export file name by joining fieldValues with underscores
  const exportFileName = ["archive_datalake", ...fieldValues].join("_");

  // Define parameters for the record viewer
  const recordViewerParams = {
    fieldsDefinition: columns,
    query: gqlQuery?.[FIELD],
    dataSource: gqlQueryDefinition?.label,
  };

  // Renders a RecordViewer component with the specified parameters.
  // const renderRecordViewer = () => {
  //   if (currentRow.length === 0) {
  //     return null;
  //   }
  //   return (
  //     <RecordViewer
  //       open={true}
  //       onClose={() => setCurrentRow([])}
  //       data={currentRow}
  //       highlightedField={currentField as string}
  //       {...recordViewerParams}
  //     />
  //   );
  // };

  return (
    columns && (
      <>
        <Card>
          <CardActions sx={{ pb: 0 }}>
            <Button
              color="error"
              startIcon={<ClearIcon />}
              sx={{ display: { xs: "none", sm: "inline-flex" }, mb: -2 }}
              onClick={onClear}
            >
              Clear results
            </Button>
            <Tooltip title="Clear results">
              <IconButton
                color="error"
                onClick={onClear}
                sx={{ display: { sm: "none" }, mb: -2 }}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </CardActions>
          <CardHeader
            sx={{ pt: 0 }}
            title={
              <SectionDivider
                color={rows ? (rows.length ? undefined : "error") : "secondary"}
                title={`${rows ? rows.length || "No" : "Fetching"} result${
                  rows?.length === 1 ? "" : "s"
                }`}
              />
            }
          />
          <CardContent>
            {rows?.length ? (
              <Stack spacing={3}>
                <div style={{ height: 600, width: "100%" }}>
                  <DataGridPro
                    initialState={{
                      pinnedColumns: {
                        left: ["__check__"],
                        right: ["actions"],
                      },
                    }}
                    rows={rows}
                    columns={columns}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                      setSelected(newRowSelectionModel);
                    }}
                    rowSelectionModel={selected}
                    autoPageSize
                    onRowClick={(params, event) => {
                      event?.preventDefault();
                      setCurrentRow(params.row);
                    }}
                    onCellClick={(params, event) => {
                      if (params.field !== "__check__") {
                        event.preventDefault();
                        setCurrentRow(params.row);
                        setCurrentField(params.field);
                      }
                    }}
                    sx={{ "& .MuiDataGrid-cell": { cursor: "pointer" } }}
                    slots={{ toolbar: CustomDataGridToolbar }}
                    slotProps={{
                      toolbar: {
                        csvOptions: { fileName: exportFileName },
                        dataGridMeta: {
                          ...recordViewerParams,
                          selected: selected,
                        },
                      },
                    }}
                  />
                </div>
              </Stack>
            ) : (
              !rows && <LinearProgress color="secondary" />
            )}
          </CardContent>
        </Card>
        {/* {renderRecordViewer} */}
      </>
    )
  );
};
