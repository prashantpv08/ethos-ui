import React, { useState } from 'react';
import { DateTimeRangePicker as MuiDateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { styled } from '@mui/material';
import { renderDigitalClockTimeView } from '@mui/x-date-pickers';

export interface DateTimeRangePickerComponentProps {
  label?: string;
  initialValue?: DateRange<Dayjs | Date>;
  onChange?: (newValue: DateRange<Dayjs | Date>) => void;
  size?: 'small' | 'medium';
}

const StyledPicker = styled(MuiDateTimeRangePicker)(({ theme }) => ({
  '& .MuiList-root': {
    width: '100px',
  },
}));

const DateTimeRangePicker: React.FC<DateTimeRangePickerComponentProps> = ({
  label,
  initialValue = [null, null],
  onChange,
  size = 'medium',
}) => {
  const [value, setValue] = useState<DateRange<Dayjs | Date>>(initialValue);
  const [currentRangePosition, setCurrentRangePosition] = useState<
    'start' | 'end'
  >('start');

  const handlePickerChange = (newValue: DateRange<Dayjs | Date>) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    const start = newValue[0];
    if (
      start &&
      dayjs.isDayjs(start) &&
      start.hour() !== 0 &&
      start.minute() !== 0 &&
      !newValue[1]
    ) {
      setCurrentRangePosition('end');
    }
  };

  const handleRangePositionChange = (newRangePosition: 'start' | 'end') => {
    setCurrentRangePosition(newRangePosition);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledPicker
        value={value}
        views={['day', 'hours', 'minutes']}
        timeSteps={{ minutes: 30 }}
        onChange={handlePickerChange}
        label={label}
        onRangePositionChange={handleRangePositionChange}
        viewRenderers={{
          hours: renderDigitalClockTimeView,
          minutes: null,
        }}
        rangePosition={currentRangePosition}
        slotProps={{
          textField: { size },
          field: { clearable: true },
        }}
        localeText={{ start: 'From', end: 'To' }}
      />
    </LocalizationProvider>
  );
};

DateTimeRangePicker.displayName = 'DateTimeRangePicker';
export default DateTimeRangePicker;
