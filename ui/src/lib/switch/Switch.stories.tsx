import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Switch, { BaseSwitchProps } from './Switch';

export default {
  title: 'Atoms/Switch',
  component: Switch,
} as Meta;

const Template: Story<BaseSwitchProps> = (args) => {
  const [checked, setChecked] = useState(args.checked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return <Switch {...args} checked={checked} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Enable option',
  checked: true,
};
