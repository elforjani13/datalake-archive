/**
 * GraphQL introspection query
 */
export const INTROSPECTION_QUERY = `
{
  __schema {
    queryType {
      name
      fields {
        name
        args { name type { name } }
        type { name description }
      }
    }
    types {
      name
      inputFields { name type { name } }
      fields { name type { name } }
      enumValues {name}
    }
  }
}`;

/**
 * GraphQL query param
 */
export const QUERY_ARGUMENT = { name: "query" } as const;

/**
 * Type mapping between GraphQL and DataGrid.
 */
export const DATAGRID_TYPE_MAPPING: Record<string, string> = {
  Int: "number",
  Int64: "number",
  Float: "number",
  Float64: "number",
  String: "string",
  Boolean: "boolean",
  Date: "date",
  Time: "dateTime",
};
