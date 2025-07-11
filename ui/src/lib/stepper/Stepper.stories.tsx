import { Meta, Story } from '@storybook/react';
import Stepper, { CustomStepperProps } from './Stepper';

export default {
  title: 'Components/Stepper',
  component: Stepper,
  argTypes: {
    activeStep: {
      control: { type: 'number' },
    },
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
  },
} as Meta;

const Template: Story<CustomStepperProps> = (args) => <Stepper {...args} />;

export const HorizontalStepper = Template.bind({});
HorizontalStepper.args = {
  steps: [
    {
      label: (
        <div>
          Step 1: <strong>Introduction</strong>
        </div>
      ),
      description: 'This is the introduction step.',
    },
    {
      label: (
        <div>
          Step 2: <em>Details</em>
        </div>
      ),
      description: 'Here are some detailed instructions.',
    },
    {
      label: (
        <div>
          Step 3: <u>Summary</u>
        </div>
      ),
      description: 'This is the final summary step.',
    },
  ],
  activeStep: 1,
  orientation: 'horizontal',
};

export const VerticalStepper = Template.bind({});
VerticalStepper.args = {
  steps: [
    {
      label: (
        <div>
          Step 1: <strong>Introduction</strong>
        </div>
      ),
      description: 'This is the introduction step.',
    },
    {
      label: (
        <div>
          Step 2: <em>Details</em>
        </div>
      ),
      description: 'Here are some detailed instructions.',
    },
    {
      label: (
        <div>
          Step 3: <u>Summary</u>
        </div>
      ),
      description: 'This is the final summary step.',
    },
  ],
  activeStep: 2,
  orientation: 'vertical',
};
