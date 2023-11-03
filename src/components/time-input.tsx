import React from "react";
import DateTimeInput from "./date-time-input";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { registerComponent } from "~/utils/functions";
import { TypeDefinition } from "~/types/query";

type TimeInputProps = {
  label: string;
  onChange: (value?: string | null) => void;
};

const TimeInput: React.FC<TimeInputProps> = (props) => {
  const dateFormat = "YYYY-MM-DD hh:mm a";

  const toString = (date?: Dayjs | undefined) =>
    date ? dayjs(date).format().substring(0, 16) : "";

  return (
    <DateTimeInput
      {...props}
      pickerComponent={DateTimePicker}
      format={dateFormat}
      toString={toString}
    />
  );
};

export default TimeInput;

registerComponent((definition: TypeDefinition) =>
  definition?.type?.name === "Time"
    ? [TimeInput as React.ComponentType<unknown>, 50]
    : null
);
