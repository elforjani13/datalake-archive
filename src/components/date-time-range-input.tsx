import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Grid } from "@mui/material";
import { camelCaseToWords } from "~/utils/functions";
import { FieldsType } from "~/types/query";

type DateTimeRangeInputProps = {
  pickerComponent: React.ComponentType<any>;
  dateFormat: string;
  value?: [Dayjs | null, Dayjs | null] | null | undefined;
  label: string;
  onChange: (val?: [Dayjs | null, Dayjs | null]) => void;
  // toString: (date?: Dayjs | null) => string | undefined;
  toString: (() => string) &
    ((date?: Dayjs | null | undefined) => string | undefined);
  fields?: FieldsType[];
};

const DateTimeRangeInput: React.FC<DateTimeRangeInputProps> = ({
  pickerComponent: PickerComponent,
  dateFormat,
  label,
  value,
  fields = [],
  onChange,
}) => {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);

  // load initial value
  useEffect(() => {
    loadDateValue(fields?.[0]?.value, setStartValue);
    loadDateValue(fields?.[1]?.value, setEndValue);
  }, [fields]);

  useEffect(() => {
    loadDateValue(value?.[0]?.toString(), setStartValue);
    loadDateValue(value?.[1]?.toString(), setEndValue);
  }, [value]);

  const loadDateValue = (
    value: string | null | undefined,
    setter: React.Dispatch<React.SetStateAction<Dayjs | null>>
  ) => {
    value && dayjs(value).isValid() ? setter(dayjs(value)) : setter(null);
  };

  const handleChange = (
    value: Dayjs | null,
    setter: React.Dispatch<React.SetStateAction<Dayjs | null>>,
    getRangeLimits: (date: Dayjs | null) => [Dayjs | null, Dayjs | null]
  ) => {
    const newValue = value && value.isValid() ? value : null;
    setter(newValue);

    const [startLimit, endLimit] = getRangeLimits(newValue || null);
    onChange([startLimit, endLimit]);
  };

  const handleStarChange = (value: Dayjs | null) =>
    handleChange(value, setStartValue, (v) => [v, endValue]);

  const handleEndChange = (value: Dayjs | null) =>
    handleChange(value, setEndValue, (v) => [startValue, v]);

  const commonPickerProps = {
    sx: { width: 150, minWidth: "100%" },
    format: dateFormat,
    disableFuture: true,
  };

  return (
    <div>
      <Grid
        container
        alignItems="center"
        direction="row"
        spacing={1}
        rowSpacing={2}
        wrap="wrap"
      >
        <Grid item xs={true}>
          <PickerComponent
            label={camelCaseToWords(fields[0]?.name || label)}
            value={startValue}
            onChange={handleStarChange}
            maxDate={endValue}
            {...commonPickerProps}
          />
        </Grid>
      </Grid>
      <Grid item sx={{ marginTop: "16px" }} />
      <Grid item xs={true}>
        <PickerComponent
          label={camelCaseToWords(fields?.[1].name || label)}
          value={endValue}
          onChange={handleEndChange}
          minDate={startValue}
          {...commonPickerProps}
        />
      </Grid>
    </div>
  );
};

export default DateTimeRangeInput;
