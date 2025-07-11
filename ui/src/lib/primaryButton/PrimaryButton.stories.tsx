import { Story, Meta } from '@storybook/react';
import PrimaryButton, { PrimaryButtonProps } from './PrimaryButton';

const Template: Story<PrimaryButtonProps> = (args) => (
  <PrimaryButton {...args} />
);

const Default = Template.bind({});
Default.args = {
  children: 'Click Me',
  variant: 'contained',
  tooltip: 'This is a tooltip',
};

const DisabledWithTooltip = Template.bind({});
DisabledWithTooltip.args = {
  children: 'Disabled',
  variant: 'contained',
  disabled: true,
  tooltip: "This button is disabled and can't be clicked",
};

export default {
  title: 'Atoms/Button/PrimaryButton',
  component: PrimaryButton,
  argTypes: {},
} as Meta<PrimaryButtonProps>;

export { Default as PrimaryButton, DisabledWithTooltip };
