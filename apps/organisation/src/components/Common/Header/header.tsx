import { Iconbutton, PrimaryButton, TextField } from '@ethos-frontend/ui';
import styles from './header.module.scss';
import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { ArrowBack, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../../commonUtils/CommonUtils';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  title: string;
  buttonText?: string;
  onClick?: () => void;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  permission?: boolean;
  size?: 'small' | 'medium';
}

export const Header: FC<HeaderProps> = ({
  title,
  buttonText,
  onClick,
  handleChange,
  children,
  permission,
  size = 'medium',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const debouncedHandleChange = debounce((e) => {
    const value = e as ChangeEvent<HTMLInputElement>;
    if (handleChange) {
      handleChange(value);
    }
  }, 100);

  return (
    <div className={styles.header}>
      <Iconbutton
        MuiIcon={ArrowBack}
        size="medium"
        text={title}
        className="pb-5"
        onClick={() => navigate(-1)}
      />
      <div className="justify-end w-full flex-1">
        {children}
        {handleChange ? (
          <TextField
            onChange={debouncedHandleChange}
            placeholder={t('search')}
            label={t('search')}
            leftIcon={<Search />}
            size={size}
            name="search"
          />
        ) : null}
        {buttonText && (
          <PrimaryButton disabled={permission} onClick={onClick}>
            {buttonText}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
};
