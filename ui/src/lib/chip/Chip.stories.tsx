import React, { Suspense } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Chip from './Chip';

export default {
  title: 'Molecules/Chip',
  component: Chip,
  argTypes: {
    label: { control: 'text' },
    onDelete: { action: 'deleted' },
  },
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Sample Chip',
};

export const MultipleChips = () => {
  const [chips, setChips] = React.useState([
    { key: 0, label: 'Gluten Free' },
    { key: 1, label: 'Vegetarian' },
    { key: 2, label: 'Vegan' },
  ]);

  const handleDelete = (chipToDelete: any) => () => {
    setChips((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  return (
    <div>
      <Suspense fallback={<div>...loading</div>}>
        {chips.map((chip) => (
          <Chip
            key={chip.key}
            label={chip.label}
            onDelete={handleDelete(chip)}
          />
        ))}
      </Suspense>
    </div>
  );
};
