type Field = {
  name: string;
  args?: Argument[];
  type: FieldType;
  label: string;
};

type Argument = {
  name: string;
  type: string;
  inputFields?: Field[];
};

type FieldType = {
  name: string;
  description?: string;
  fields?: FieldsType[];
  enumValues?: EnumValue[];
};

type FieldsType = {
  name: string;
  label: string;
  value?: any;
  type: FieldType;
  autoFocus?: boolean;
  disabled?: boolean;
  color?: string;
  onChange?: (value: any) => void;
};

type QueryType = {
  fields?: Field[];
};

type EnumValue = {
  name: string;
};

type Fieldset = {
  min: number;
  fields: FieldsType[];
};

type DataSource = {
  id: string[];
  label: string;
  name: string;
  args?: Argument[];
  type?: FieldType;
};

type DataSources = (DataSource | { [key: string]: DataSource })[];

type QueryConfigType = {
  requireDataSource: boolean;
  requiredFields: Fieldset[];
  optionalFields?: FieldsType[];
  dataSource?: DataSource | null;
  dataSources?: DataSources;
};

type DataConfigType = {
  [key: string]: {
    id: string[];
    label: string;
  };
};

type RecordData = {
  id: string;
  createdAt?: string;
  [key: string]: any;
};

type TypeDefinition = {
  name: string;
  label?: string;
  args?: Argument[];
  fields?: Field[];
  inputFields?: Field[];
  enumValues?: EnumValue[];
  autoFocus?: boolean;
  type?: {
    description?: string;
    name: string;
    fields?: FieldsType[];
    enumValues?: EnumValue[];
  };
};

type FieldDefinition = {
  field: string;
  headerName: string;
  valueFormatter?: (params: { value: any }) => string;
};

type SchemaJson = {
  types: TypeDefinition[];
  queryType: QueryType;
};

export type {
  SchemaJson,
  TypeDefinition,
  FieldDefinition,
  FieldType,
  FieldsType,
  Field,
  Argument,
  QueryType,
  QueryConfigType,
  DataConfigType,
  Fieldset,
  DataSource,
  DataSources,
  EnumValue,
  RecordData,
};
