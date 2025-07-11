import Tooltip from './Tooltip';
import { Button } from '@mui/material';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    title: { control: 'text' },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    arrow: {
      control: 'boolean',
    },
  },
};

const Template = (args: any) => (
  <Tooltip {...args}>
    <Button variant="contained">Hover over me</Button>
  </Tooltip>
);

export const Default = Template.bind({});
Default.args = {
  title: 'This is a tooltip',
  placement: 'top',
  arrow: true,
};
