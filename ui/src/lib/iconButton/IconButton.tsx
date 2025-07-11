import {
  IconButton as BaseIconButton,
  Box,
  IconButtonProps,
  styled,
} from '@mui/material';
import { FC, ReactNode } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import { IconType } from 'react-icons';

export interface BaseIconButtonProps extends IconButtonProps {
  name?: string;
  MuiIcon?: SvgIconComponent;
  ReactIcon?: IconType;
  variant?: 'primary' | 'secondary';
  text?: string;
  onClick?: (event: React.MouseEvent) => void;
  size?: 'small' | 'medium' | 'large';
  iconColor?: string;
  textColor?: string;
  disabled?: boolean;
}

const SIZE_MAP = {
  small: { icon: 16, text: 12 },
  medium: { icon: 24, text: 14 },
  large: { icon: 28, text: 16 },
};

interface StyledIconButtonProps extends IconButtonProps {
  variant: 'primary' | 'secondary';
  text?: string;
  disabled?: boolean;
}

const StyledIcon = styled(BaseIconButton)<StyledIconButtonProps>(
  ({ theme, variant, text }) => ({
    '&.MuiButtonBase-root': {
      backgroundColor: variant === 'secondary' ? theme.palette.primary.main : '',
      color:
        variant === 'primary'
          ? theme.palette.primary.dark
          : theme.palette.common.white,

      padding: text ? '0 5px 0 0' : 0,
      marginRight: variant === 'secondary' && text ? '10px' : 0,
      borderRadius: '4px',
      '&:disabled': {
        color: theme.palette.action.disabled,
      },
      '&:hover': {
        background: 'none',
        color: theme.palette.primary.main,
      },
    },
  }),
);

const StyledDiv = styled(Box)(({ theme }) => ({
  '&.textadded': {
    display: 'inline-flex',
    alignItems: 'center',
    ...theme.typography.subtitle1,
  },
}));

const Iconbutton: FC<BaseIconButtonProps> = ({
  name,
  MuiIcon,
  ReactIcon,
  text,
  onClick,
  size = 'medium',
  iconColor,
  textColor,
  variant = 'primary',
  disabled,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const renderIcon = (): ReactNode => {
    if (MuiIcon) {
      return <MuiIcon fontSize={size} style={{ color: iconColor, fontSize: SIZE_MAP[size].icon }} />;
    }
    if (ReactIcon) {
      return <ReactIcon size={SIZE_MAP[size].icon} color={iconColor} />;
    }
    if (name) {
      return <span style={{ fontSize: SIZE_MAP[size].icon, color: iconColor }} className={`icon-${name}`} />;
    }
    return null;
  };

  return (
    <StyledDiv
      className={text ? 'textadded' : ''}
      onClick={onClick ? handleClick : undefined}
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        display: 'flex',
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
      }}
    >
      {onClick ? (
        <StyledIcon
          aria-label={name}
          variant={variant}
          disableRipple={!!text}
          size={size}
          disabled={disabled}
          {...props}
        >
          {renderIcon()}
        </StyledIcon>
      ) : (
        renderIcon()
      )}
      {text && (
        <span style={{ color: disabled ? 'inherit' : textColor }}>{text}</span>
      )}
    </StyledDiv>
  );
};

Iconbutton.displayName = 'Iconbutton';
export default Iconbutton;