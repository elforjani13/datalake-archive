import _ from "lodash";
import { TypeDefinition as FieldDefinition } from "~/types/query";

/**
 * Formats a camelCase string into separate words with initial capital letters
 * @param str - the camelCase string to convert
 * @returns the formatted string
 */
export const camelCaseToWords = (str?: string): string =>
  _.startCase(_.camelCase(str));

// Serialize a query object as a GraphQL query string:
const getQueryAsString = (q: Record<string, any>): string => {
  const queryEntries = _.map(
    q,
    (value, key) => `${key}: ${JSON.stringify(value)}`
  );
  return `(${_.join(queryEntries, ", ")}) `;
};

const getFieldsAsString = (typeDef: FieldDefinition | undefined): string => {
  if (typeDef && typeDef.fields) {
    const fields = typeDef.fields.map(
      (f) => `${f.name} ${getFieldsAsString(f.type)}`
    );
    return fields.length > 0 ? `{ ${fields.join(" ")} }` : "";
  } else {
    return "";
  }
};

export const buildGraphQLQuery = (
  query: Record<string, any>,
  queryDefinition: FieldDefinition
): string => {
  const serializedQuery = `{ ${queryDefinition.name}${getQueryAsString(
    query
  )}${getFieldsAsString(queryDefinition.type)} }`;
  return serializedQuery;
};

type DisplayFunction = (
  fieldDefinition: FieldDefinition
) => [React.ComponentType<unknown>, number] | null;

const registeredComponents: DisplayFunction[] = [];

export const registerComponent = (component: DisplayFunction) => {
  registeredComponents.push(component);
};

export const getComponent = (
  fieldDefinition: FieldDefinition
): React.ComponentType<any> | null => {
  const chosenDisplay = registeredComponents
    .map<[React.ComponentType<any>, number] | null>((component) =>
      component(fieldDefinition)
    )
    .filter<[React.ComponentType<any>, number]>(
      (display): display is [React.ComponentType<any>, number] =>
        display !== null
    )
    .reduce<[React.ComponentType<any>, number] | null>(
      (chosenDisplay, [display, priority]) => {
        if (chosenDisplay === null || priority > chosenDisplay[1]) {
          return [display, priority];
        }
        return chosenDisplay;
      },
      null as [React.ComponentType<any>, number] | null
    );

  return chosenDisplay ? chosenDisplay[0] : null;
};
