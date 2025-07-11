import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Radio, { RadioComponentProps } from './Radio';

export default {
  title: 'Atoms/Radio',
  component: Radio,
} as Meta;

const Template: Story<RadioComponentProps> = (args) => {
  const [value, setValue] = useState(args.value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return <Radio {...args} value={value} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Select an option',
  name: 'options',
  value: 'option1',
  options: [
    { label: 'Option 1', value: 'option1', price: '$10' },
    { label: 'Option 2', value: 'option2', price: '$20' },
    { label: 'Option 3', value: 'option3' },
  ],
  variant: 'default',
};

export const Tile = Template.bind({});
Tile.args = {
  label: 'Select an option',
  name: 'options',
  value: 'notip',
  options: [
    { label: 'No Tip', value: 'notip' },
    { label: '5%', value: '5%' },
    { label: '10%', value: '10%' },
    { label: '20%', value: '20%' },
  ],
  variant: 'tile',
};
