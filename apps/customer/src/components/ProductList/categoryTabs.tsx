import React from 'react';
import { TabList } from '@mui/lab';
import { Tab, styled } from '@mui/material';
import styles from './productList.module.scss';

const StylesTabs = styled(TabList)(() => ({
  '&.MuiTabs-root': {
    margin: '0 auto',
  },
}));

interface CategoryTabsProps {
  categories: { name: string; _id: string }[] | undefined;
  handleTabChange: (value: string) => void;
}

export function CategoryTabs({
  categories,
  handleTabChange,
}: CategoryTabsProps) {
  return (
    <StylesTabs
      onChange={(_e, value) => handleTabChange(value)}
      aria-label="Categories"
      scrollButtons="auto"
      variant="scrollable"
    >
      {categories?.map((val, i) => (
        <Tab label={val.name} value={val._id} key={i} className={styles.tabs} />
      ))}
    </StylesTabs>
  );
}
