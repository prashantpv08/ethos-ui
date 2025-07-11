import { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { DateRangePicker, DateRangePickerProps } from './DateRangePicker';

export default {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  argTypes: {
    dateSeparator: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} as Meta<DateRangePickerProps>;

const Template: Story<DateRangePickerProps> = (args) => {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  return (
    <DateRangePicker {...args} value={value} onChange={setValue} />
  );
};

export const Default = Template.bind({});
Default.args = {
  dateSeparator: 'to',
  disabled: false,
};
