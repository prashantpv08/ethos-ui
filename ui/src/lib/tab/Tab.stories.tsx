import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Tabs, { TabContentConfig } from './Tab';
import { Iconbutton } from '../iconButton';
import { ManageAccountsOutlined, QrCode } from '@mui/icons-material';

export default {
  title: 'Components/Tabs',
  component: Tabs,
} as Meta;

const Template: Story = (args) => {
  const [selectedTab, setSelectedTab] = useState('/account/profile');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const tabs: TabContentConfig[] = [
    {
      label: 'Profile',
      value: '/account/profile',
      icon: <Iconbutton name="user" size="small" />,
      panelContent: <p>first</p>,
    },
    {
      label: 'QR Code',
      value: '/account/qr',
      icon: <Iconbutton MuiIcon={QrCode} size="small" />,
      panelContent: <p>Second</p>,
    },
    {
      label: 'Preferences',
      value: '/account/settings',
      icon: <Iconbutton MuiIcon={ManageAccountsOutlined} size="small" />,
      panelContent: <p>Third</p>,
    },
  ];

  return (
    <Tabs
      value={selectedTab}
      onChange={handleTabChange}
      tabs={tabs}
      {...args}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
