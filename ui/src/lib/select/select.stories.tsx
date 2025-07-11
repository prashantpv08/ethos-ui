import { useState } from 'react';
import Select from './select';
import { SelectChangeEvent } from '@mui/material';

export default {
  title: 'atoms/Forms/Select',
  component: Select,
  argTypes: {
    onChange: { action: 'onChange' },
  },
};

export const DefaultSelect = (args) => {
  const [value, setValue] = useState('');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setValue(event.target.value as string);
    args.onChange(event); // If you want to log this action
  };

  return <Select {...args} value={value} onChange={handleChange} />;
};

DefaultSelect.args = {
  id: 'default-select',
  items: [
    { value: '1', label: 'value one' },
    { value: '2', label: 'value two' },
    { value: '3', label: 'value three' },
  ],
  label: 'Default Select',
};

export const MultipleSelect = (args) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;
    setSelectedValues(typeof value === 'string' ? value.split(',') : value);
    args.onChange(event);
  };

  const handleDelete = (deletedValue: string) => {
    setSelectedValues((currentValues) =>
      currentValues.filter((value) => value !== deletedValue)
    );
  };

  return (
    <Select
      {...args}
      value={selectedValues}
      onChange={handleChange}
      handleDelete={handleDelete}
      multiple
    />
  );
};

MultipleSelect.args = {
  id: 'multi-select',
  items: [
    { value: '1', label: 'value one' },
    { value: '2', label: 'value two' },
    { value: '3', label: 'value three' },
  ],
  label: 'Multiple Select',
  multiple: true,
};

DefaultSelect.storyName = 'Default Select';
MultipleSelect.storyName = 'Multiple Select';
