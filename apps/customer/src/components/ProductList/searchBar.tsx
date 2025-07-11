import React, { ChangeEvent, useState, useCallback } from 'react';
import styles from './productList.module.scss';
import { Iconbutton, TextField } from '@ethos-frontend/ui';
import { debounce } from '@ethos-frontend/utils';
import { useTranslation } from 'react-i18next';

interface PageProps {
  onSearchSubmit: (data: string) => void;
}

export function SearchBar({ onSearchSubmit }: PageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const debouncedSearchSubmit = useCallback(
    debounce((query: string) => {
      onSearchSubmit(query);
    }, 500),
    [onSearchSubmit],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearchSubmit(query);
  };

  return (
    <div className={styles.search_bar}>
      <TextField
        placeholder={`${t('search')}...`}
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        fullWidth
        rightIcon={
          searchQuery.length ? (
            <Iconbutton
              name="close"
              onClick={() => {
                setSearchQuery('');
                debouncedSearchSubmit('');
              }}
            />
          ) : (
            <Iconbutton name="search" iconColor="#3F3F3F" />
          )
        }
      />
    </div>
  );
}
