import React from "react";
import DateTimeRangeInput from "./date-time-range-input";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { registerComponent } from "~/utils/functions";
import { TypeDefinition } from "~/types/query";

type DateRangeInputProps = {
  label: string;
  onChange: (value?: [Dayjs | null, Dayjs | null]) => void;
};

// custom to string.
const toString = ((date?: Dayjs | null) =>
  date ? dayjs(date).format().substring(0, 10) : undefined) as (() => string) &
  ((date?: Dayjs | null | undefined) => string | undefined);

const DateRangeInput: React.FC<DateRangeInputProps> = (props) => {
  return (
    <DateTimeRangeInput
      pickerComponent={DatePicker}
      toString={toString}
      dateFormat="YYYY-MM-DD"
      {...props}
    />
  );
};

export default DateRangeInput;

registerComponent((definition: TypeDefinition) =>
  definition?.type?.name === "DateRange" &&
  definition?.type?.fields?.length === 2
    ? ([DateRangeInput, 50] as [React.ComponentType<unknown>, number])
    : null
);
