import { useState } from 'react';
import { Meta } from '@storybook/react';
import Modal, { BaseModalProps } from './Modal';
import PrimaryButton from '../primaryButton/PrimaryButton';

const Template = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <PrimaryButton onClick={() => setIsOpen(true)}>Open Modal</PrimaryButton>
      <Modal
        {...args}
        open={isOpen}
        size="xs"
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <div>Title</div>
      <div>Content</div>
    </>
  ),
};

export default {
  title: 'Components/Modal',
  component: Modal,
} as Meta<BaseModalProps>;

export { Default as Modal };
