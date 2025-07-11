import React from 'react';
import {
  FormControlLabel,
  Radio as BaseRadio,
  RadioGroup,
  FormLabel,
  styled,
  FormGroup,
  Box,
} from '@mui/material';

interface RadioOption {
  label: string;
  value: string;
  price?: number | undefined;
  priceWithSymbol?: string;
}

export interface RadioComponentProps {
  options: RadioOption[];
  label?: string;
  name?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: 'default' | 'tile';
  align?: 'horizontal' | 'vertical';
}

const StyledRadioGroup = styled(RadioGroup, {
  shouldForwardProp: (prop) => prop !== 'align',
})<{ align?: 'horizontal' | 'vertical' }>(({ align }) => ({
  flexDirection: align === 'horizontal' ? 'row' : 'column',
  gap: 12,
}));

const DefaultRadioGroup = styled(RadioGroup, {
  shouldForwardProp: (prop) => prop !== 'align',
})<{ align?: 'horizontal' | 'vertical' }>(({ align }) => ({
  flexDirection: align === 'horizontal' ? 'row' : 'column',
  gap: 12,
}));

const DefaultLabel = styled(FormControlLabel, {
  shouldForwardProp: (props) => props !== 'align',
})<{ align?: 'horizontal' | 'vertical' }>(({ theme, align }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.primary,
    ...theme.typography.subtitle2,
  },
  '&.MuiFormControlLabel-root': {
    borderBottom: align === 'horizontal' ? 'none' : '1px solid #E6E6E6',
    margin: 0,
    padding: align === 'horizontal' ? '0' : '0 0 12px',
    '& .MuiFormControlLabel-label': {
      width: '100%',
    },
    '&:last-child': {
      borderBottom: 'none',
      padding: 0,
    },
  },
  '& .MuiSvgIcon-root': {
    width: '0.7em',
  },
  '& .MuiRadio-root': {
    paddingLeft: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingRight: 5,
  },
}));

const TileLabel = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.primary,
  },
  '&.MuiFormControlLabel-root': {
    margin: 0,
    border: '1px solid #E6E6E6',
    borderRadius: '4px',
    padding: '10px 20px',
    transition: 'border-color 0.3s, color 0.3s',
    '&:has(.Mui-checked)': {
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      '& .MuiFormControlLabel-label': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiRadio-root': {
      display: 'none',
    },
  },
}));

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  color: '#3f3f3f',
  paddingBottom: theme.spacing(1),
}));

const StyledLabel = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
}));

const Radio: React.FC<RadioComponentProps> = ({
  options,
  label,
  name,
  value,
  onChange,
  variant = 'default',
  align = 'vertical',
}) => {
  const LabelComponent = variant === 'tile' ? TileLabel : DefaultLabel;
  const RadioGroupComponent =
    variant === 'tile' ? StyledRadioGroup : DefaultRadioGroup;

  return (
    <FormGroup>
      {label && <StyledFormLabel>{label}</StyledFormLabel>}
      <RadioGroupComponent
        name={name}
        value={value}
        onChange={onChange}
        align={align}
      >
        {options.map((option) => (
          <LabelComponent
            key={option.value}
            value={option.value}
            align={align}
            control={<BaseRadio checked={value === option.value} />}
            label={
              <StyledLabel>
                {option.label}
                {option?.priceWithSymbol ? (
                  <span>+ {option?.priceWithSymbol}</span>
                ) : (
                  option.price && <span>+ {option.price}</span>
                )}
              </StyledLabel>
            }
          />
        ))}
      </RadioGroupComponent>
    </FormGroup>
  );
};

Radio.displayName = 'Radio';
export default Radio;
