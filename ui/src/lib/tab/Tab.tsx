import React, { ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab, TabsProps, TabProps } from '@mui/material';

export interface TabContentConfig extends Omit<TabProps, 'children'> {
  panelContent: ReactElement;
}

export interface TabsComponentProps extends Omit<TabsProps, 'children'> {
  value: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
  tabs: TabContentConfig[];
}

const StyledTabs = styled(TabList)(({ theme }) => ({
  '&.MuiTabs-root': {
    margin: '0 auto',
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiTab-root': {
    ...theme.typography.subtitle2,
    textTransform: 'capitalize',
    '&:not(.Mui-selected)': {
      color: theme.palette.primary.dark,
    },
  },
}));

const Tabs: React.FC<TabsComponentProps> = ({
  value,
  onChange,
  tabs,
  ...props
}) => {
  return (
    <TabContext value={value}>
      <StyledTabs onChange={onChange} {...props}>
        {tabs.map(({ panelContent, ...tabProps }) => (
          <Tab key={tabProps.value} {...tabProps} />
        ))}
      </StyledTabs>
      {tabs.map(({ value, panelContent }) => (
        <TabPanel key={value} value={value}>
          {panelContent}
        </TabPanel>
      ))}
    </TabContext>
  );
};

Tabs.displayName = 'Tabs';
export default Tabs;
