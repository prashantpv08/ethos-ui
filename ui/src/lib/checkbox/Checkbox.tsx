import React, { ReactNode } from 'react';
import {
  Checkbox as BaseCheckbox,
  Box,
  FormLabel,
  styled,
} from '@mui/material';
import FormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import { minWidth } from '@mui/system';

export type CheckboxComponentProps = {
  variant: 'single' | 'group' | 'custom';
  label?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options?: {
    label: string;
    value: string;
    price?: number;
    priceWithSymbol?: string;
    icon?: ReactNode;
    disabled?: boolean;
  }[];
  selectedValues?: { label: string; value: string }[];
  onGroupChange?: (
    selectedValues: { label: string; value: string; price?: number }[]
  ) => void;
  disabled?: boolean;
  align?: 'horizontal' | 'vertical';
};

interface StyledLabelProps extends FormControlLabelProps {
  align?: 'horizontal' | 'vertical';
}

const StyledLabel = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== 'align',
})<StyledLabelProps>(({ theme, align }) => ({
  '&.MuiFormControlLabel-root': {
    margin: align === 'horizontal' ? '0 12px 0 0' : '0 0 12px',
    borderBottom: align === 'horizontal' ? 'none' : '1px solid #E6E6E6',
    paddingBottom: align === 'horizontal' ? 0 : 8,
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
      marginBottom: 0,
    },
    '& .MuiFormControlLabel-label': {
      width: '100%',
      ...theme.typography.subtitle2,
      color: '#3f3f3f',
    },
  },
}));

const StyledCheckbox = styled(BaseCheckbox)(({ theme }) => ({
  '&.MuiCheckbox-root': {
    padding: '0 5px 0 0',
    '& .MuiSvgIcon-root': {
      width: 18,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    ...theme.typography.subtitle2,
    padding: '12px 16px',
    color: theme.palette.primary.dark,
    border: '1px solid #e6e6e6',
    borderRadius: '6px',
    textTransform: 'capitalize',
    fontWeight: 500,
    minWidth: 'auto',
  },
  '&.MuiButton-outlined': {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    '& [class*="icon-"]':{
      color: theme.palette.primary.main,
    }
  },
  '&.MuiButton-contained': {
    background: 'transparent',
    boxShadow: 'none',
  },
}));

const StyledPriceLabel = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const Checkbox: React.FC<CheckboxComponentProps> = ({
  variant,
  label,
  checked,
  onChange,
  options = [],
  selectedValues = [],
  onGroupChange,
  disabled,
  align = 'vertical',
}) => {
  const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = options.find((option) => option.value === event.target.value);
    if (value && onGroupChange) {
      const newSelectedValues = selectedValues.some(
        (val) => val.value === value.value
      )
        ? selectedValues.filter((val) => val.value !== value.value)
        : [...selectedValues, value];
      onGroupChange(newSelectedValues);
    }
  };

  if (variant === 'single') {
    return (
      <StyledLabel
        control={
          <StyledCheckbox
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
        }
        label={label || ''}
        align={align}
      />
    );
  }

  if (variant === 'group') {
    return (
      <>
        {label && <FormLabel>{label}</FormLabel>}
        <FormGroup
          style={{ flexDirection: align === 'horizontal' ? 'row' : 'column' }}
        >
          {options.map((option) => (
            <StyledLabel
              key={option.value}
              control={
                <StyledCheckbox
                  checked={selectedValues.some(
                    (val) => val.value === option.value
                  )}
                  onChange={handleGroupChange}
                  value={option.value}
                  disabled={disabled || option.disabled}
                  disableRipple
                />
              }
              label={
                <StyledPriceLabel>
                  {option.label}{' '}
                  {option.priceWithSymbol && (
                    <span style={{ marginLeft: 'auto' }}>
                      + {option.priceWithSymbol}
                    </span>
                  )}
                </StyledPriceLabel>
              }
              align={align}
            />
          ))}
        </FormGroup>
      </>
    );
  }

  if (variant === 'custom') {
    return (
      <>
        {label && <FormLabel>{label}</FormLabel>}
        <Box
          style={{
            display: 'flex',
            flexDirection: align === 'horizontal' ? 'row' : 'column',
            gap: 8,
          }}
        >
          {options.map((option) => (
            <StyledButton
              disabled={disabled || option.disabled}
              key={option.value}
              variant={
                selectedValues.some((val) => val.value === option.value)
                  ? 'outlined'
                  : 'contained'
              }
              onClick={() =>
                handleGroupChange({
                  target: { value: option.value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              {option.icon ? (
                <span style={{ paddingRight: 8 }}>{option.icon}</span>
              ) : null}
              {option.label}
            </StyledButton>
          ))}
        </Box>
      </>
    );
  }

  return null;
};

Checkbox.displayName = 'Checkbox';
export default Checkbox;
