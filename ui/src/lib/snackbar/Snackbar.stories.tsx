import { Story } from '@storybook/react';
import Snackbar, { SnackbarComponentProps } from './Snackbar';
import { PrimaryButton } from '../primaryButton';
import { useState } from 'react';

export default {
  title: 'Molecules/SnackbarComponent',
  component: Snackbar,
  argTypes: {
    open: { control: 'boolean' },
    onClose: { control: 'function', description: 'for onclose' },
    message: { control: 'text' },
    severity: {
      control: 'select',
      options: ['error', 'warning', 'info', 'success'],
    },
    vertical: {
      control: 'select',
      options: ['top', 'bottom'],
    },
    horizontal: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    transition: {
      control: 'select',
      options: ['Slide', 'Grow', 'Fade'],
    },
  },
};

const Template: Story<SnackbarComponentProps> = (args) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <PrimaryButton variant="outlined" onClick={handleClick}>
        Show Snackbar
      </PrimaryButton>
      <Snackbar {...args} open={open} onClose={handleClose} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  message: 'This is a success message!',
  severity: 'success',
  vertical: 'bottom',
  horizontal: 'left',
};

export const Error = Template.bind({});
Error.args = {
  message: 'This is an error message!',
  severity: 'error',
  vertical: 'bottom',
  horizontal: 'left',
};

export const Warning = Template.bind({});
Warning.args = {
  message: 'This is a warning message!',
  severity: 'warning',
  vertical: 'bottom',
  horizontal: 'left',
};

export const Info = Template.bind({});
Info.args = {
  message: 'This is an info message!',
  severity: 'info',
  vertical: 'bottom',
  horizontal: 'left',
};

export const TopRight = Template.bind({});
TopRight.args = {
  message: 'This is a top-right message!',
  severity: 'info',
  vertical: 'top',
  horizontal: 'right',
};

export const BottomRight = Template.bind({});
BottomRight.args = {
  message: 'This is a bottom-right message!',
  severity: 'info',
  vertical: 'bottom',
  horizontal: 'right',
};
export const WithGrowTransition = Template.bind({});
WithGrowTransition.args = {
  message: 'This is a message with Grow transition!',
  severity: 'info',
  vertical: 'bottom',
  horizontal: 'left',
  transition: 'Grow',
};

export const WithFadeTransition = Template.bind({});
WithFadeTransition.args = {
  message: 'This is a message with Fade transition!',
  severity: 'info',
  vertical: 'bottom',
  horizontal: 'left',
  transition: 'Fade',
};

export const WithSlideTransition = Template.bind({});
WithSlideTransition.args = {
  message: 'This is a message with Slide transition!',
  severity: 'info',
  vertical: 'bottom',
  horizontal: 'left',
  transition: 'Slide',
};
