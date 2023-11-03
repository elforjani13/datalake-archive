import React from "react";
import { Dayjs } from "dayjs";
import DateTimeRangeInput from "./date-time-range-input";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { registerComponent } from "~/utils/functions";
import { TypeDefinition } from "~/types/query";

type TimeRangeInputProps = {
  label: string;
  onChange: (value?: [Dayjs | null, Dayjs | null]) => void;
  value?: [Dayjs | null, Dayjs | null] | null | undefined;
};

const TimeRangeInput: React.FC<TimeRangeInputProps> = (props) => {
  const { value, label, onChange } = props;
  const dateFormat = "YYYY-MM-DD hh:mm a";

  return (
    <DateTimeRangeInput
      value={value}
      label={label}
      onChange={onChange}
      pickerComponent={DateTimePicker}
      dateFormat={dateFormat}
    />
  );
};

export default TimeRangeInput;

registerComponent((definition: TypeDefinition) =>
  definition?.type?.name === "TimeRange" &&
  definition?.type?.fields?.length === 2
    ? [TimeRangeInput as React.ComponentType<unknown>, 50]
    : null
);
