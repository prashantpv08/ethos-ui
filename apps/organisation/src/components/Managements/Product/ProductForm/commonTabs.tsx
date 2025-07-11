import React, { ReactElement } from 'react';
import { Tabs } from '@ethos-frontend/ui';
import { TabProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CommonTabsProps {
  tabValue: string;
  setTabValue: (value: string) => void;
  basicContent: React.ReactNode;
  extrasContent: React.ReactNode;
}

export interface TabContentConfig extends Omit<TabProps, 'children'> {
  panelContent: ReactElement;
}

export const CommonTabs = ({
  tabValue,
  setTabValue,
  basicContent,
  extrasContent,
}: CommonTabsProps) => {
  const {t} = useTranslation();
  const tabs: TabContentConfig[] = [
    { label: t('product.basicDetails'), value: '1', panelContent: <>{basicContent}</> },
    { label: t('product.extras'), value: '2', panelContent: <>{extrasContent}</> },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return <Tabs value={tabValue} onChange={handleTabChange} tabs={tabs} />;
};
