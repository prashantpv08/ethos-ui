import {
  TextField as BaseTextField,
  InputAdornment,
  TextFieldProps,
  styled,
} from '@mui/material';
import { FC, forwardRef, ReactNode } from 'react';

interface CustomProps {
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export type CustomTextFieldProps = CustomProps & TextFieldProps;

const getPaddingBySize = (size: string) => {
  switch (size) {
    case 'small':
      return '8px 12px';
    case 'large':
      return '16px 20px';
    case 'medium':
    default:
      return '14px 16px';
  }
};

const getIconSizeByVariant = (size: string) => {
  switch (size) {
    case 'small':
      return 20;
    case 'large':
      return 28;
    case 'medium':
    default:
      return 24;
  }
};

const getTypographyByVariant = (size: string) => {
  switch (size) {
    case 'small':
      return 'body1';
    case 'large':
      return 'subtitle1';
    case 'medium':
    default:
      return 'subtitle2';
  }
};

const StyledTextField = styled(BaseTextField)<{ sizevariant: string }>(
  ({ theme, sizevariant }) => ({
    '&.lefticon': {
      '& .MuiInputLabel-formControl': {
        left: '28px',
      },
      '& .MuiOutlinedInput-input': {
        paddingLeft: '10px',
      },
    },
    '& .MuiOutlinedInput-input': {
      ...theme.typography[getTypographyByVariant(sizevariant)],
      padding: getPaddingBySize(sizevariant),
      '&.MuiInputBase-inputMultiline': {
        padding: 0,
      },
    },
    '& .MuiInputLabel-formControl': {
      color: theme.palette.secondary.main,
      top: sizevariant === 'small' ? '-8px' : '-2px',
      fontSize: sizevariant === 'small' ? 12 : 14,

      '&.MuiInputLabel-shrink': {
        top: 0,
        left: 0,
      },
    },
    '& .MuiOutlinedInput-root': {
      fontSize: 14,
      '&.Mui-focused': {
        borderColor: theme.palette.secondary.light,
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.secondary.light,
        borderRadius: 5,
        '& legend': {
          color: theme.palette.secondary.light,
        },
      },
    },
    '& .MuiInputAdornment-root': {
      '& svg': {
        fontSize: getIconSizeByVariant(sizevariant),
      },
    },
  })
);
const TextField = forwardRef<HTMLInputElement, CustomTextFieldProps>(
  (
    {
      id,
      type = 'text',
      name,
      label,
      fullWidth = false,
      helperText,
      error,
      disabled = false,
      onChange,
      value,
      required,
      multiline,
      leftIcon,
      rightIcon,
      readOnly,
      size = 'medium',
      ...props
    },
    ref
  ) => {
    return (
      <StyledTextField
        id={name}
        aria-label={`text-${name}`}
        type={type}
        name={name}
        label={label}
        fullWidth={fullWidth}
        helperText={helperText}
        error={error}
        disabled={disabled}
        onChange={onChange}
        value={value}
        sizevariant={size}
        required={required}
        multiline={multiline}
        InputLabelProps={{
          error: error,
        }}
        className={leftIcon ? 'lefticon' : ''}
        InputProps={{
          startAdornment: leftIcon ? (
            <InputAdornment position="start">{leftIcon}</InputAdornment>
          ) : null,
          endAdornment: rightIcon ? (
            <InputAdornment position="end">{rightIcon}</InputAdornment>
          ) : null,
          readOnly: readOnly,
        }}
        inputRef={ref}
        {...props}
      />
    );
  }
);

TextField.displayName = 'TextField';
export default TextField;
