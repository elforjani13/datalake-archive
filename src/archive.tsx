import React, { useState } from "react";
import { Stack } from "@mui/material";
import {
  Field,
  SchemaJson,
  DataSource,
  TypeDefinition,
  DataConfigType,
} from "~/types/query";
import { Results } from "~/views/results";
import { Query } from "~/query";
import { INTROSPECTION_QUERY } from "~/utils/constants";
import { camelCaseToWords } from "~/utils/functions";
import QueryConfig from "~/config/queryConfig.json";

type ArchiveProps = {
  dataConfig?: DataConfigType;
};

async function getQueryData(processSchema: (schemaJson: SchemaJson) => void) {
  await fetch(QueryConfig.url + INTROSPECTION_QUERY)
    .then((response) => response.json())
    .then((json) => processSchema(json?.data?.__schema));
}

/**
 * Archive component provides a user interface for querying data.
 *
 */
const Archive: React.FC<ArchiveProps> = ({ dataConfig }) => {
  const [queryDefinitions, setQueryDefinitions] = useState<DataSource[]>([]);
  const [currentQueryDefinition, setCurrentQueryDefinition] = useState<
    DataSource | undefined
  >(undefined);
  const [currentQuery, setCurrentQuery] = useState<any[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  /**
   * Process the schema data.
   * @param schemaJson The schema data to process.
   */
  const processSchema = (schemaJson: SchemaJson) => {
    if (!schemaJson) return;

    const allTypes = schemaJson.types;
    const queryType = schemaJson.queryType;

    const getLabel = (typeName: string) =>
      dataConfig?.[typeName]?.label || camelCaseToWords(typeName);

    const filterValidQueryFields = (field: Field) =>
      (field.args?.length ?? 0) > 0 && field.type.name.match(/^\[.+\]$/);

    const mapQueryField = (field: Field) => ({
      id: [field.name],
      ...field,
      label: getLabel(field.name),
      args: (field.args || []).map((arg) => ({
        ...arg,
        inputFields: allTypes.find((type) => type.name === arg.type)
          ?.inputFields,
      })),
    });

    const qDefs = (queryType.fields || [])
      .filter(filterValidQueryFields)
      .map(mapQueryField);

    qDefs.forEach((q) => {
      expandType(q.type, allTypes);
    });

    setQueryDefinitions(qDefs);
  };

  /**
   * Expand the type definition.
   * @param typeDef The type definition to expand.
   * @param allTypes All available types.
   */
  const expandType = (typeDef: TypeDefinition, allTypes: TypeDefinition[]) => {
    const typeName = typeDef.name.replace(/[[\]!]/g, "");
    const type = allTypes.find((t) => t.name === typeName);

    if (type) {
      typeDef.fields = (type.fields || []).map((field) => {
        return {
          ...field,
          type: field.type || { name: "", description: "", fields: [] },
        };
      });

      typeDef.enumValues = type.enumValues;
    }
  };

  getQueryData(processSchema);

  return (
    <Stack spacing={2} direction="column">
      <Query
        dataSources={queryDefinitions}
        onSearch={(dataSource, query) => {
          setCurrentQueryDefinition(dataSource);
          setCurrentQuery(query);
          setShowResults(true)
        }}
        resultsVisible={showResults}
      />
      {showResults && currentQueryDefinition && currentQuery && (
        <Results
          gqlQueryDefinition={currentQueryDefinition}
          gqlQuery={currentQuery}
          onClear={() => setShowResults(false)}
        />
      )}
    </Stack>
  );
};

export default Archive;
