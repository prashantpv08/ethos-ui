import { Meta } from '@storybook/react';
import Iconbutton, { BaseIconButtonProps } from './IconButton';

const Template = (args) => <Iconbutton {...args} />;

const iconNames = [
  'email',
  'sms',
  'message',
  'non-veg',
  'veg',
  'delete',
  'move',
  'product',
  'tax',
  'user',
  'close',
  'dashboard',
  'edit',
  'expand',
  'down-arrow',
  'inventory',
  'invoice',
  'offers',
  'orders',
  'payment',
  'cart',
  'filter',
  'scan',
  'search',
  'line',
];
const Default = Template.bind({});

Default.args = {
  name: 'payment',
  text: 'text',
};

export default {
  title: 'Atoms/Button/Iconbutton',
  component: Iconbutton,
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
    },
    text: {
      control: 'text',
    },
  },
} as Meta<BaseIconButtonProps>;

export { Default as Iconbutton };
