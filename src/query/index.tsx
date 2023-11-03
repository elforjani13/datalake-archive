import React, { FC, useEffect, useState, useCallback } from "react";
import deepEqual from "deep-equal";
import { QueryForm } from "./query-form";
import { CircularProgress, Grid } from "@mui/material";
import {
  Fieldset,
  FieldsType,
  DataSource,
  DataSources,
} from "~/types/query";
import { QUERY_ARGUMENT } from "~/utils/constants";
import QueryConfig from "~/config/queryConfig.json";

type QueryProps = {
  dataSources: DataSources;
  onSearch: (dataSource: DataSource, query: any) => void;
  resultsVisible?: boolean;
};

const defaultQueryArg = QUERY_ARGUMENT;

export const Query: FC<QueryProps> = ({
  dataSources,
  onSearch,
  resultsVisible,
}) => {
  const [requiredFields, setRequiredFields] = useState<Fieldset[]>([]);
  const [optionalFields, setOptionalFields] = useState<FieldsType[]>([]);
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [queryData, setQueryData] = useState<Record<string, any>>({});
  const [queryDataFromURL, setQueryDataFromURL] = useState<Record<string, any>>(
    {}
  );
  const [searchLaunched, setSearchLaunched] = useState<boolean>(false);
  const [updatedSearchQuery, setUpdatedSearchQuery] = useState<
    Record<string, unknown>
  >({} as Record<string, unknown>);

  const loadFieldsConfig = useCallback(
    (
      config: FieldsType[],
      urlSearchParams: URLSearchParams,
      autoFocus: Record<string, string>
    ): FieldsType[] => {
      const fields = config?.slice() || [];
      fields.forEach((f) => {
        if (f.type?.fields) {
          f.type.fields = loadFieldsConfig(
            f.type.fields,
            urlSearchParams,
            autoFocus
          );
          return;
        }
        f.value = urlSearchParams.get(f?.name) || null;
        if (f.value) {
          onQueryInputValueChange(f.value, f);
          setQueryDataFromURL((q) => ({ ...q, [f.name]: f.value }));
        } else if (!autoFocus.field) {
          f.autoFocus = true;
          autoFocus.field = f.name;
        }
      });
      return fields;
    },
    []
  );

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const autoFocus = {};

    const updatedRequiredFields = QueryConfig.requiredFields.map((subset) => ({
      ...subset,
      fields: loadFieldsConfig(
        subset.fields as FieldsType[],
        urlSearchParams,
        autoFocus
      ),
    }));

    setRequiredFields(updatedRequiredFields);
    setOptionalFields(
      loadFieldsConfig(
        QueryConfig.optionalFields as FieldsType[],
        urlSearchParams,
        autoFocus
      )
    );
  }, [loadFieldsConfig]);

  // update the query object when an input value changes
  const onQueryInputValueChange = (
    newValue: any,
    field: FieldsType,
    arg = defaultQueryArg
  ) => {
    // update the specific field in the query
    setQueryData((q) => ({
      ...q,
      [arg.name]: {
        ...q[arg.name],
        [field.name]: newValue,
      },
    }));

    setSearchLaunched(false);
  };

  // Reset searchLaunched to `false` when the data source changes to indicate that the displayed data (if any) no longer matches the current query
  useEffect(() => {
    setSearchLaunched(false);
  }, [dataSource?.name]);

  // Reset the search query and mark it as not launched when the results visibility changes
  useEffect(() => {
    if (!resultsVisible) {
      setUpdatedSearchQuery({});
      setSearchLaunched(false);
    }
  }, [resultsVisible]);

  // Verify if the required fields are adequately provided for initiating the search.
  const shouldLaunchSearch = () => {
    return (
      dataSource &&
      requiredFields.some((group) => {
        return (
          group.fields.filter((rf) => {
            return queryData?.[defaultQueryArg.name]?.[rf.name];
          })?.length >= group.min
        );
      })
    );
  };

  const handleSearch = (event: React.FormEvent) => {
    if (event) {
      event.preventDefault();

      if (dataSource) {
        setSearchLaunched(true);
        const updatedQuery = {
          ...queryData?.[defaultQueryArg?.name],
          dataSource: dataSource?.label,
        };
        setUpdatedSearchQuery(updatedQuery);
        onSearch(dataSource, queryData);
      }
    }
  };

  const shouldClearForm = () =>
    !dataSource &&
    deepEqual(queryData, { [defaultQueryArg.name]: queryDataFromURL });

  const resetSearchForm = () => {
    setQueryData({ [defaultQueryArg.name]: queryDataFromURL });
    setDataSource(null);
  };

  // Don't render the form until we know which input has the autofocus
  if (!requiredFields || !optionalFields || !dataSources) {
    return (
      <Grid container justifyContent="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  // Render the form fields in the following order:
  // 1. Required default query fields as specified by queryConfig
  // 2. Optional default query fields as specified by queryConfig
  // 3. The data source dropdown
  // 4. All other fields supported by the selected data source
  // 5. The search button, which is disabled if:
  //    - None of the required query fields have a value specified
  //    - The data source, also required for now, hasn't been selected yet
  //    - The search has been just launched, and the results currently reflect the query
  // Once a search is launched, render the used query
  return (
    <QueryForm
      requiredFields={requiredFields}
      optionalFields={optionalFields}
      requireDataSource={QueryConfig?.requireDataSource}
      dataSources={dataSources}
      dataSource={dataSource}
      onDataSourceChange={setDataSource}
      query={queryData}
      defaultQueryArg={defaultQueryArg}
      onQueryInputValueChange={onQueryInputValueChange}
      onSubmit={handleSearch}
      isSubmitDisabled={!shouldLaunchSearch() || searchLaunched}
      updatedSearchQuery={updatedSearchQuery}
      onReset={resetSearchForm}
      isResetDisabled={shouldClearForm()}
    />
  );
};
