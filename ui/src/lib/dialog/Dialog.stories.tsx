import { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Dialog, { IDialogProps } from './Dialog';
import Button from '@mui/material/Button';

export default {
  title: 'Molecules/Dialog',
  component: Dialog,
  argTypes: {
    title: { control: 'text' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
    onConfirm: { action: 'confirmed' },
    onCancel: { action: 'canceled' },
    size: {
      control: 'select',
      options: ['xs', 'md', 'lg', 'xl'],
    },
  },
} as Meta;

const Template: Story<IDialogProps> = (args) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Dialog
      </Button>
      <Dialog {...args} open={open} onCancel={handleClose} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Enter your details',
  confirmText: 'Submit',
  cancelText: 'Cancel',
  size: 'md',
  children: <input placeholder="Email address" />,
};
