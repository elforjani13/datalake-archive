import React from "react";
import DateTimeInput from "./date-time-input";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { registerComponent } from "~/utils/functions";
import { TypeDefinition } from "~/types/query";

type DateInputProps = {
  label: string;
  onChange: (value?: string) => void;
};

const DateInput: React.FC<DateInputProps> = (props) => {
  const dateFormat = "YYYY-MM-DD";

  const toString = (date?: Dayjs | undefined) =>
    date ? dayjs(date).format().substring(0, 10) : "";

  return (
    <DateTimeInput
      {...props}
      pickerComponent={DatePicker}
      format={dateFormat}
      toString={toString}
    />
  );
};

export default DateInput;

registerComponent((definition: TypeDefinition) => {
  return definition?.type?.name === "Date"
    ? [DateInput as React.ComponentType<unknown>, 50]
    : null;
});
