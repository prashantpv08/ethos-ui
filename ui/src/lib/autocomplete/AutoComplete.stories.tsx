import { SyntheticEvent, useState } from 'react';
import AutoComplete, { ItemProps } from './AutoComplete';

export default {
  title: 'atoms/Forms/AutoComplete',
  component: AutoComplete,
  argTypes: {
    onChange: { action: 'onChange' },
  },
};

export const GroupedOptionsMultiSelect = (args) => {
  const [selectedValues, setSelectedValues] = useState<ItemProps[]>([]);

  const handleChange = (event: SyntheticEvent, newValue: ItemProps[]) => {
    setSelectedValues(newValue);
    args.onChange(newValue);
  };

  const handleDelete = (deletedValue: string) => {
    setSelectedValues((currentValues) =>
      currentValues.filter((value) => value.value !== deletedValue)
    );
  };

  return (
    <AutoComplete
      {...args}
      value={selectedValues}
      onChange={handleChange}
      handleDelete={handleDelete}
      multiple
      fullWidth={true}
    />
  );
};

GroupedOptionsMultiSelect.args = {
  id: 'grouped-options-multi-select',
  options: [
    { value: 'apple', label: 'Apple', group: 'Fruits' },
    { value: 'banana', label: 'Banana', group: 'Fruits' },
    { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
    { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
    { value: 'chicken', label: 'Chicken', group: 'Meats' },
    { value: 'beef', label: 'Beef', group: 'Meats' },
  ],
  label: 'Grouped Options Multi Select',
  multiple: true,
};

GroupedOptionsMultiSelect.storyName = 'Grouped Options Multi Select';

export const GroupedOptions = (args) => {
  const [value, setValue] = useState<ItemProps | null>();

  const handleChange = (event: SyntheticEvent, newValue: ItemProps | null) => {
    setValue(newValue);
    args.onChange(newValue);
  };

  return (
    <AutoComplete
      {...args}
      value={value}
      onChange={handleChange}
      fullWidth={true}
    />
  );
};

GroupedOptions.args = {
  id: 'grouped-options-select',
  options: [
    { value: 'apple', label: 'Apple', group: 'Fruits' },
    { value: 'banana', label: 'Banana', group: 'Fruits' },
    { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
    { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
    { value: 'chicken', label: 'Chicken', group: 'Meats' },
    { value: 'beef', label: 'Beef', group: 'Meats' },
  ],
  label: 'Grouped Options Select',
};

GroupedOptions.storyName = 'Grouped Options Select';

export const DefaultSelect = (args) => {
  const [value, setValue] = useState<ItemProps | null>();

  const handleChange = (event: SyntheticEvent, newValue: ItemProps | null) => {
    setValue(newValue);
    args.onChange(newValue);
  };

  return (
    <AutoComplete
      {...args}
      value={value}
      onChange={handleChange}
      fullWidth={true}
    />
  );
};

DefaultSelect.args = {
  id: 'default-select',
  options: [
    { value: 'value one', label: 'value one' },
    { value: 'value two', label: 'value two' },
    { value: 'value three', label: 'value three' },
  ],
  label: 'Default Select',
};

export const MultiSelect = (args) => {
  const [selectedValues, setSelectedValues] = useState<ItemProps[]>([]);

  const handleChange = (event: SyntheticEvent, newValue: ItemProps[]) => {
    setSelectedValues(newValue);
    args.onChange(newValue);
  };

  const handleDelete = (deletedValue: string) => {
    setSelectedValues((currentValues) =>
      currentValues.filter((value) => value.value !== deletedValue)
    );
  };

  return (
    <AutoComplete
      {...args}
      value={selectedValues}
      onChange={handleChange}
      handleDelete={handleDelete}
      multiple
      fullWidth={true}
    />
  );
};

MultiSelect.args = {
  id: 'multi-select',
  options: [
    { value: 'value one', label: 'value one' },
    { value: 'value two', label: 'value two' },
    { value: 'value three', label: 'value three' },
  ],
  label: 'Multiple Select',
  multiple: true,
};

export const DefaultValueSelectSingle = (args) => {
  const [value, setValue] = useState<ItemProps | null>({
    value: 'value two',
    label: 'value two',
  });

  const handleChange = (event: SyntheticEvent, newValue: ItemProps | null) => {
    setValue(newValue);
    args.onChange(newValue);
  };

  return (
    <AutoComplete
      {...args}
      value={value}
      onChange={handleChange}
      fullWidth={true}
    />
  );
};

DefaultValueSelectSingle.args = {
  id: 'default-value-select-single',
  options: [
    { value: 'value one', label: 'value one' },
    { value: 'value two', label: 'value two' },
    { value: 'value three', label: 'value three' },
  ],
  label: 'Default Value Single Select',
};

export const DefaultValueSelectMultiple = (args) => {
  const [selectedValues, setSelectedValues] = useState<ItemProps[]>([
    { value: 'value one', label: 'value one' },
    { value: 'value three', label: 'value three' },
  ]);

  const handleChange = (event: SyntheticEvent, newValue: ItemProps[]) => {
    setSelectedValues(newValue);
    args.onChange(newValue);
  };

  const handleDelete = (deletedValue: string) => {
    setSelectedValues((currentValues) =>
      currentValues.filter((value) => value.value !== deletedValue)
    );
  };

  return (
    <AutoComplete
      {...args}
      value={selectedValues}
      onChange={handleChange}
      handleDelete={handleDelete}
      multiple
      fullWidth={true}
    />
  );
};

DefaultValueSelectMultiple.args = {
  id: 'default-value-select-multiple',
  options: [
    { value: 'value one', label: 'value one' },
    { value: 'value two', label: 'value two' },
    { value: 'value three', label: 'value three' },
  ],
  label: 'Default Value Multiple Select',
  multiple: true,
};

DefaultSelect.storyName = 'Default Select';
MultiSelect.storyName = 'MultiSelect';
DefaultValueSelectSingle.storyName = 'Default Value Single Select';
DefaultValueSelectMultiple.storyName = 'Default Value Multiple Select';
