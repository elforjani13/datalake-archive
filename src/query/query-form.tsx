import React, { FC, useState, useEffect, useCallback } from "react";
import _ from "lodash";
import {
  Autocomplete,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { QUERY_ARGUMENT } from "~/utils/constants";
import { camelCaseToWords, getComponent } from "~/utils/functions";
import { QueryConfigType, FieldsType, DataSource } from "~/types/query";
import {
  Fieldset,
  OptionalFields,
  Section,
  InfoTooltip,
  FormContainer,
} from "~/features";

import "~/components/components";

type QueryFormProps = {
  query: any;
  defaultQueryArg: typeof QUERY_ARGUMENT;
  updatedSearchQuery: Record<string, unknown>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onReset: React.MouseEventHandler<HTMLButtonElement>;
  onQueryInputValueChange: any;
  onDataSourceChange: (selectedDataSource: DataSource | null) => void;
  isSubmitDisabled: boolean;
  isResetDisabled: boolean;
} & QueryConfigType;

export const QueryForm: FC<QueryFormProps> = ({
  query,
  dataSource,
  dataSources,
  defaultQueryArg,
  updatedSearchQuery,
  requiredFields,
  optionalFields,
  requireDataSource,
  onSubmit,
  onReset,
  onQueryInputValueChange,
  onDataSourceChange,
  isSubmitDisabled,
  isResetDisabled,
}) => {
  const [defaultFields, setDefaultFields] = useState<FieldsType[]>([]);

  // const [defaultFields, setDefaultFields] = useState<FieldsType[] | null>(null);
  const [satisfiedReqGroup, setSatisfiedReqGroup] = useState<{
    fields: FieldsType[];
  }>();
  const [dataSourceFields, setDataSourceFields] = useState<FieldsType[] | null>(
    null
  );
  const [disableFieldsetLabels, setDisableFieldsetLabels] =
    useState<boolean>(false);

  // get all default fields.
  useEffect(() => {
    const requiredFieldValues = requiredFields
      .map((r) => r.fields)
      .flat()
      .filter((field) => field !== undefined) as FieldsType[];

    const optionalFieldValues = (optionalFields ?? [])
      .flatMap((o) => o?.type?.fields)
      .filter((field) => field !== undefined) as FieldsType[];

    setDefaultFields([...requiredFieldValues, ...optionalFieldValues]);
  }, [requiredFields, optionalFields]);

  // we don't have to fill in req section.
  useEffect(() => {
    setDisableFieldsetLabels(!!satisfiedReqGroup);
  }, [satisfiedReqGroup]);

  // update the optional fields , when the data source changes.
  useEffect(() => {
    setDataSourceFields(() => {
      if (!defaultFields) return null;
      return dataSource?.args
        ?.find((arg) => arg.name === defaultQueryArg.name)
        ?.inputFields?.filter(
          (f) => !defaultFields.some((df) => df.name === f.name)
        ) as FieldsType[] | null;
    });
  }, [defaultFields, dataSource, defaultQueryArg.name]);

  const extractFieldValues = (field: FieldsType) => {
    const fieldName = field?.type?.fields ? field.type.fields : [field];
    const values = fieldName.map(
      (subField) => query[defaultQueryArg.name]?.[subField?.name] || ""
    );
    return values;
  };

  const displayQueryField = (
    field: FieldsType,
    isExcludedFromDefaultFields?: boolean
  ): React.ReactNode => {
    if (isExcludedFromDefaultFields) return null;

    const matchingDefaultField = defaultFields?.find(
      (defaultField) => defaultField.name === field.name
    );

    // Determine the appropriate input component based on the field type
    const InputDisplay = getComponent(field) as React.ComponentType<any>;

    const isDisabled = !!matchingDefaultField?.value;

    return (
      <InputDisplay
        key={field.name}
        autoFocus={field.autoFocus}
        label={field.label || camelCaseToWords(field?.name)}
        value={extractFieldValues(field)}
        disabled={isDisabled}
        color={isDisabled ? "info" : undefined}
        onChange={(value: any) => {
          field?.type?.fields
            ? field.type.fields.forEach((subField, index) => {
                onQueryInputValueChange(value[index], subField);
              })
            : onQueryInputValueChange(value, field);
        }}
        {...field?.type}
      />
    );
  };

  const getSatisfiedReqGroup = useCallback(() => {
    const satisfiedGroup = requiredFields.find(
      (g) => g.fields.filter((f) => f.value).length >= g.min
    );

    return (
      satisfiedGroup && { fields: satisfiedGroup.fields.filter((f) => f.value) }
    );
  }, [requiredFields]);

  // check if any of req group has enough values , when arrive
  useEffect(() => {
    setSatisfiedReqGroup(getSatisfiedReqGroup());
  }, [getSatisfiedReqGroup, requiredFields]);

  const hasAutoFocusFields = () =>
    !!getSatisfiedReqGroup() ||
    !requiredFields
      .map((r) => r.fields)
      .flat()
      .some((f) => f.autoFocus);

  const hasNarrowReqFields = () =>
    !!satisfiedReqGroup || (requiredFields?.length ?? 0) === 1;

  const hasNarrowReqSection = () => hasNarrowReqFields() && !requireDataSource;

  const hadReqDataSourceFieldset = () =>
    hasNarrowReqFields() && requireDataSource;

  const hasDataSourceSection = () =>
    !(hasNarrowReqFields() && requireDataSource);

  const hasOptFields = () =>
    (optionalFields?.length ?? 0) > 0 ||
    !requireDataSource ||
    (dataSourceFields?.length ?? 0) > 0;

  const childrenSizes = hasNarrowReqSection()
    ? /* optional section exists and includes dataSource */
      [
        { sm: 12, md: 4 },
        { sm: 12, md: 8 },
      ]
    : hasDataSourceSection()
    ? /* wide required section and separate required data source */
      hasOptFields()
      ? [{ lg: 5 }, { lg: 3 }, { lg: 4 }]
      : [{ lg: 5 }, { lg: 7 }]
    : /* wide required section, NO separate required data source */
    hasOptFields()
    ? [{ lg: 6 }, { lg: 6 }]
    : /* one section, always xs:12 */
      [{}];

  const renderDataSourceSection = () => (
    <Section
      title="Legacy system"
      color={requireDataSource ? "primary" : undefined}
    >
      <Stack spacing={2} sx={{ width: "100%" }}>
        {!disableFieldsetLabels && (
          <Typography variant="subtitle2">
            Select an archived record type:
          </Typography>
        )}
        {renderDataSource()}
      </Stack>
    </Section>
  );

  const renderDataSource = () => {
    const dataSourceArray = _.values(dataSources);
    return (
      <Autocomplete
        sx={{
          width: "100%",
          "&:hover .MuiInputAdornment-root, &.Mui-focused .MuiInputAdornment-root":
            {
              visibility: "visible",
            },
        }}
        autoComplete
        autoHighlight
        autoSelect
        openOnFocus={!hasAutoFocusFields()}
        loading={!dataSources?.length}
        options={dataSourceArray}
        value={dataSource}
        onChange={(_event, value) => onDataSourceChange(value as DataSource)}
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus={hasAutoFocusFields()}
            label="Data source"
            placeholder="Select the data source to query"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  {dataSource && (
                    <InputAdornment
                      position="end"
                      sx={{ visibility: "hidden" }}
                    >
                      <InfoTooltip title={`About ${dataSource.label}`}>
                        {`TO DO ${dataSource?.type?.description}`}
                      </InfoTooltip>
                    </InputAdornment>
                  )}
                </>
              ),
            }}
          />
        )}
      />
    );
  };

  return (
    <FormContainer
      onSubmit={onSubmit}
      onReset={onReset}
      disableSubmit={isSubmitDisabled}
      disableReset={isResetDisabled}
      query={updatedSearchQuery}
      requiredFields={
        (requiredFields ?? []).map((g) => g.fields).flat() ||
        (requireDataSource ? [{ name: "dataSource" }] : [])
      }
      childrenSizes={childrenSizes}
    >
      <Section
        divider={hadReqDataSourceFieldset() ? undefined : "or"}
        title="Required"
        color="primary"
      >
        {satisfiedReqGroup ? (
          <Fieldset
            fieldset={satisfiedReqGroup}
            displayField={displayQueryField}
          />
        ) : (
          requiredFields.map((subset, index) => (
            <Fieldset
              key={index}
              fieldset={subset}
              displayField={displayQueryField}
            />
          ))
        )}
        {hadReqDataSourceFieldset() && renderDataSource()}
      </Section>
      {hasDataSourceSection() && renderDataSourceSection()}
      {hasOptFields() && (
        <Section title="Optional" maxWidth="xl" spacing={6}>
          {/* If the data source is optional, we display two groups in the optional section:
               * data source dropdown and its fields
               * predefined optional fields
               Otherwise we display both data source specific and predefined in one group
             */}

          {!requireDataSource ? (
            <>
              {/* List here any fields that are supported by the selected data source and not
                 already listed in the 'required' or `optional` section: */}
              <OptionalFields
                fields={dataSourceFields ?? []}
                displayField={(f) => displayQueryField(f, true)}
                disableLabel={disableFieldsetLabels}
              >
                {[renderDataSource()]}
              </OptionalFields>
              {/* List predefined optional fields */}
              {(optionalFields?.length ?? 0) > 0 && (
                <OptionalFields
                  withBlankLabel
                  fields={optionalFields}
                  displayField={displayQueryField}
                  disableLabel={disableFieldsetLabels}
                />
              )}
            </>
          ) : (
            <OptionalFields
              fields={[...(dataSourceFields || []), ...(optionalFields || [])]}
              displayField={displayQueryField}
              disableLabel={disableFieldsetLabels}
            />
          )}
        </Section>
      )}
    </FormContainer>
  );
};
