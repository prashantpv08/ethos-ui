import { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Drawer, { DrawerComponentProps } from './Drawer';
import { Button, FormControl, FormLabel } from '@mui/material';

export default {
  title: 'Components/Drawer',
  component: Drawer,
} as Meta;

const Template: Story<DrawerComponentProps> = (args) => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setFilterOpen(true)}>
        Open Drawer
      </Button>
      <Drawer
        anchor="bottom"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onOpen={() => setFilterOpen(true)}
        {...args}
      >
        <FormControl>
          <FormLabel
            id="filter-selector"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px',
            }}
          >
            Filters
            <Button variant="text" onClick={() => setFilterOpen(false)}>
              Done
            </Button>
          </FormLabel>
          <div style={{ padding: '16px' }}>
            <p>Custom content goes here.</p>
            {/* Add more custom content as needed */}
          </div>
        </FormControl>
      </Drawer>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
