import React from 'react';
import {
  Drawer,
  Checkbox,
  Heading,
  PrimaryButton,
  Label,
} from '@ethos-frontend/ui';
import { FormControl, FormLabel, styled } from '@mui/material';
import styles from './productList.module.scss';
import { Characteristics } from './productList.model';
import { useTranslation } from 'react-i18next';

const StyledLabel = styled(FormLabel)(() => ({
  '&.MuiFormLabel-root': {
    borderBottom: '1px solid #e6e6e6',
  },
}));

interface FiltersProps {
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  characteristics: Characteristics[];
  selectedValues: Characteristics[];
  setSelectedValues: (values: Characteristics[]) => void;
  applyFilters: () => void;
}

export function Filters({
  filterOpen,
  setFilterOpen,
  characteristics,
  selectedValues,
  setSelectedValues,
  applyFilters,
}: FiltersProps) {
  const {t} = useTranslation();
  return (
    <Drawer
      anchor="bottom"
      open={filterOpen}
      onClose={() => setFilterOpen(false)}
      onOpen={() => setFilterOpen(true)}
    >
      <FormControl>
        <StyledLabel
          className={`flex justify-between p-4 ${styles.selectorHeader} items-center`}
        >
          <Heading variant="h5" weight="semibold">
            {t('customer.filter')}
          </Heading>
          <PrimaryButton variant="text" onClick={applyFilters}>
            <Label variant="subtitle1" weight="medium">
              {t('done')}
            </Label>
          </PrimaryButton>
        </StyledLabel>
        <div className="gap-3 mx-3 mt-4 overflow-y-auto">
          <Checkbox
            align="horizontal"
            variant="custom"
            options={characteristics}
            selectedValues={selectedValues}
            onGroupChange={(e) => setSelectedValues(e)}
          />
        </div>
      </FormControl>
    </Drawer>
  );
}
