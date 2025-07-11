import { Meta } from '@storybook/react';
import Counter from './Counter';
import { useState } from 'react';

const Template = (args) => {
  const [count, setCount] = useState(0);

  return <Counter {...args} count={count} setCount={setCount} />;
};

const Default = Template.bind({});

Default.args = {};

export default {
  title: 'Atoms/Counter',
  component: Counter,
  argTypes: {},
} as Meta;

export { Default as Counter };
