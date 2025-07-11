import { Story, Meta } from '@storybook/react';
import TextField, { CustomTextFieldProps } from './textfield';

const Template: Story<CustomTextFieldProps> = (args) => <TextField {...args} />;

const Default = Template.bind({});
Default.args = {
  label: 'Label',
  disabled: false,
  type: 'text',
};

export default {
  title: 'atoms/Forms/TextField',
  component: TextField,
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Indicates if TextField is disabled',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    error: {
      control: 'boolean',
      description: 'Indicates if TextField is disabled',
    },
    multiline: {
      control: 'boolean',
    },
    maxRows: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    fullWidth: {
      control: 'boolean',
    },
    rows: {
      control: 'text',
    },
  },
} as Meta<CustomTextFieldProps>;

export { Default as TextField };
