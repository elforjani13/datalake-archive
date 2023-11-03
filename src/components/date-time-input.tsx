import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";

type DateTimeInputProps = {
  pickerComponent: React.ComponentType<any>;
  format: string;
  value?: string | null | undefined;
  sx?: React.CSSProperties;
  toString: (() => string) | ((val: Dayjs | undefined) => string);
  label: string;
  onChange: (value?: string) => void;
};

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  pickerComponent: PickerComponent,
  value,
  format,
  toString,
  onChange,
  ...rest
}) => {
  const [date, setDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const parsedDate = dayjs(value);
    setDate(parsedDate?.isValid() ? parsedDate : null);
  }, [value]);

  const handleChange = (selectedDate: Dayjs | null) => {
    const isValidDate = selectedDate?.isValid();

    setDate(isValidDate ? selectedDate : null);
    onChange(isValidDate ? toString(selectedDate!) : undefined);
  };

  return (
    <PickerComponent
      value={date}
      format={format}
      onChange={handleChange}
      disableFuture
      {...rest}
    />
  );
};

export default DateTimeInput;
