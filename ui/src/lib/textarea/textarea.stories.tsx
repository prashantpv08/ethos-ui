import { ComponentMeta, ComponentStory } from '@storybook/react';
import TextareaAutosize from './Textarea';

export default {
  title: 'Components/TextareaAutosize',
  component: TextareaAutosize,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    minRows: { control: 'number' },
    maxRows: { control: 'number' },
    disabled: { control: 'boolean' },
  },
} as ComponentMeta<typeof TextareaAutosize>;

const Template: ComponentStory<typeof TextareaAutosize> = (args) => (
  <TextareaAutosize {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: 'Description',
  placeholder: 'Enter your text...',
  minRows: 3,
  maxRows: 6,
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Description',
  placeholder: 'This textarea is disabled...',
  minRows: 3,
  maxRows: 6,
  disabled: true,
};
