import { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import Checkbox, { CheckboxComponentProps } from './Checkbox';
import { Iconbutton } from '../iconButton';

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
} as Meta;

const SingleTemplate: Story<CheckboxComponentProps> = (args) => {
  const [checked, setChecked] = useState(args.checked);
  return (
    <Checkbox
      {...args}
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
};

const GroupTemplate: Story<CheckboxComponentProps> = (args) => {
  const [selectedValues, setSelectedValues] = useState<
    { label: string; value: string; price?: number }[]
  >(args.selectedValues || []);
  return (
    <Checkbox
      {...args}
      selectedValues={selectedValues}
      onGroupChange={setSelectedValues}
    />
  );
};

export const Single = SingleTemplate.bind({});
Single.args = {
  variant: 'single',
  label: 'Example Checkbox',
  checked: false,
};

export const Group = GroupTemplate.bind({});
Group.args = {
  variant: 'group',
  options: [
    { label: 'Dairy Free', value: 'dairy_free', price: 1 },
    { label: 'Gluten Free', value: 'gluten_free', price: 2 },
    { label: 'Keto', value: 'keto', price: 3 },
    { label: 'Vegan', value: 'vegan', price: 4 },
    { label: 'Vegetarian', value: 'vegetarian', price: 5 },
  ],
  selectedValues: [],
};

export const Custom = GroupTemplate.bind({});
Custom.args = {
  variant: 'custom',
  options: [
    {
      label: 'Dairy Free',
      value: 'dairy_free',
      icon: <Iconbutton name="email" />,
    },
    { label: 'Gluten Free', value: 'gluten_free' },
    { label: 'Keto', value: 'keto' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Vegetarian', value: 'vegetarian' },
  ],
  selectedValues: [],
};
