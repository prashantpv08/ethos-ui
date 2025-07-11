import {
  Button as BaseButton,
  ButtonProps,
  CircularProgress,
  Theme,
  styled,
} from '@mui/material';
import { ReactNode } from 'react';
import { Tooltip } from '../tooltip';

export interface PrimaryButtonProps extends ButtonProps {
  children: ReactNode;
  variant?: 'text' | 'contained' | 'outlined';
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  tooltip?: string;
  loading?: boolean;
}

const getButtonStyles = (
  theme: Theme,
  variant: string | undefined,
  color:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning',
) => {
  if (color === 'inherit') {
    return {
      ...(variant === 'contained' && {
        color: 'inherit',
        backgroundColor: 'inherit',
      }),
      ...(variant === 'text' && {
        color: 'inherit',
      }),
      ...(variant === 'outlined' && {
        color: 'inherit',
        borderColor: 'inherit',
      }),
    };
  }

  const paletteColor = theme.palette[color];

  return {
    ...(variant === 'contained' && {
      color: '#fff',
      backgroundColor: `${paletteColor.main} !important`,
      '&:hover': {
        backgroundColor: `${paletteColor.main} !important`,
      },
    }),
    ...(variant === 'text' && {
      color: paletteColor.main,
      '&:hover': {
        backgroundColor: `${theme.palette.action.hover} !important`,
      },
    }),
    ...(variant === 'outlined' && {
      color: paletteColor.main,
      borderColor: paletteColor.main,
      '&:hover': {
        borderColor: paletteColor.dark,
        backgroundColor: `${theme.palette.action.hover} !important`,
      },
    }),
  };
};

const StyledButton = styled(
  BaseButton,
  {},
)(({ theme, variant, size, color = 'primary' }) => ({
  minWidth: variant === 'text' ? 'auto' : 132,
  textTransform: 'capitalize',
  fontWeight: 500,
  padding: variant === 'text' ? '5px' : '15px 16px',
  borderRadius: 5,

  ...theme.typography.subtitle1,
  [theme.breakpoints.down(350)]: {
    ...theme.typography.subtitle1,
  },
  ...getButtonStyles(
    theme,
    variant,
    color as
      | 'inherit'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning',
  ),
  '&.Mui-disabled': {
    backgroundColor:
      variant === 'text'
        ? 'transparent'
        : `${theme.palette.action.disabledBackground} !important`,
    color: theme.palette.action.disabled,
  },
  ...(size === 'small' && {
    padding: variant === 'text' ? '3px 5px' : '8px 12px',
    ...theme.typography.subtitle1,
  }),
  ...(size === 'large' && {
    padding: variant === 'text' ? '7px 10px' : '18px 22px',
    ...theme.typography.subtitle1,
  }),
}));

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  tooltip,
  fullWidth,
  loading,
  disabled,
  ...props
}) => {
  const isDisabled = loading || disabled;
  return (
    <Tooltip title={tooltip || ''} arrow placement="top">
      <span style={{ width: fullWidth ? '100%' : 'auto', display: 'flex' }}>
        <StyledButton
          variant={variant}
          size={size}
          color={color}
          fullWidth={fullWidth}
          disabled={isDisabled}
          {...props}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ ml: 2 }} color="inherit" />
          ) : (
            children
          )}
        </StyledButton>
      </span>
    </Tooltip>
  );
};

PrimaryButton.displayName = 'PrimaryButton';
export default PrimaryButton;
