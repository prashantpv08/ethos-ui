import { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import DateTimeRangePicker, {
  DateTimeRangePickerComponentProps,
} from './DateTimeRangePicker';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro/models';

export default {
  title: 'Components/DateTimeRangePicker',
  component: DateTimeRangePicker,
} as Meta;

const Template: Story<DateTimeRangePickerComponentProps> = (args) => {
  const [value, setValue] = useState<DateRange<Dayjs>>([
    dayjs(),
    dayjs().add(1, 'hour'),
  ]);

  const handleChange = (newValue: DateRange<any>) => {
    setValue(newValue);
  };

  return (
    <DateTimeRangePicker
      {...args}
      initialValue={value}
      onChange={handleChange}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Select Date Range',
};

export const CustomTimeSteps = Template.bind({});
CustomTimeSteps.args = {
  label: 'Custom Time Steps',
  initialValue: [dayjs(), dayjs().add(2, 'hour')],
};

export const CustomViews = Template.bind({});
CustomViews.args = {
  label: 'Custom Views (Day and Hours)',
  initialValue: [dayjs(), dayjs().add(1, 'day')],
};
