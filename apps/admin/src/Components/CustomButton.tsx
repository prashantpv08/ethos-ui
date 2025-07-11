import { Button, CircularProgress } from '@mui/material';
import React from 'react';

interface Props {
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined' | 'text';
  text: string;
  showIcon: boolean;
  iconPosition?: 'start' | 'end' | undefined;
  icon?: any;
  width?: '100%' | 'auto';
  onClick?: (e?: any) => void;
  type?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  iconType?: 'image' | 'svg';
  dashedBorder?: boolean;
  pressed?: boolean;
  onMouseDown?: () => void;
  isMobileTextVisible?: boolean;
  id: string;
  loading?: boolean;
  className?: string;
  display?: boolean;
}

const CustomButton: React.FC<Props> = (props) => {
  const {
    size,
    variant,
    text,
    showIcon,
    iconPosition,
    icon,
    width,
    onClick,
    type,
    disabled,
    iconType,
    dashedBorder,
    pressed,
    onMouseDown,
    isMobileTextVisible,
    id,
    loading,
    className,
    display,
  } = props;
  const windowWidth = window.innerWidth;
  return showIcon ? (
    iconPosition === 'start' ? (
      // <Box className="customBtn">
      <Button
        type={type}
        disabled={disabled}
        onClick={onClick}
        size={size}
        id={id}
        sx={{
          // width: { width },
          ...(display && { display: 'none' }),
        }}
        // disabled={true}
        className={
          variant === 'contained'
            ? `innerButtonContained ${
                isMobileTextVisible ? 'isMobileTextVisible' : null
              }`
            : `innerButtonOutlined ${dashedBorder ? 'dashedBorder' : ''} ${
                pressed ? 'pressed' : ''
              }
            ${isMobileTextVisible ? 'isMobileTextVisible' : null}
            ${className}
            `
        }
        variant={variant}
        startIcon={
          iconType === 'svg' ? (
            icon
          ) : (
            <img src={icon} alt={text} role="presentation" />
          )
        }
        disableElevation
        disableFocusRipple
      >
        {isMobileTextVisible ? text : <> {windowWidth > 768 ? text : ''}</>}
      </Button>
    ) : (
      // </Box>
      // <Box className="customBtn">
      <Button
        id={id}
        type={type}
        onClick={onClick}
        disabled={disabled}
        size={size}
        className={
          variant === 'contained'
            ? `innerButtonContained ${
                isMobileTextVisible ? 'isMobileTextVisible' : null
              }`
            : `innerButtonOutlined ${dashedBorder ? 'dashedBorder' : ''} ${
                pressed ? 'pressed' : ''
              }
            ${isMobileTextVisible ? 'isMobileTextVisible' : null}  ${className}`
        }
        variant={variant}
        endIcon={
          iconType === 'svg' ? (
            icon
          ) : (
            <img src={icon} alt={text} role="presentation" />
          )
        }
        disableElevation
        disableFocusRipple
      >
        {/* {windowWidth > 768 ? text : ''} */}
        {isMobileTextVisible ? text : <> {windowWidth > 768 ? text : ''}</>}
      </Button>
      // </Box>
    )
  ) : (
    // <Box className="customBtn">
    <Button
      id={id}
      onMouseDown={() => {
        if (onMouseDown) {
          onMouseDown();
        }
      }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      size={size}
      variant={variant}
      className={`customButton ${
        variant === 'contained' ? 'customBtnPrimary' : 'customBtnSecondary'
      } ${dashedBorder ? 'dashedBorder' : ''} ${
        pressed ? 'pressed' : ''
      }  ${className}`}
      sx={{
        width: { width },
        ...(display && { display: 'none' }),
      }}
      disableElevation
      disableFocusRipple
      startIcon={
        loading ? (
          <CircularProgress size={20} sx={{ color: '#ffffff' }} />
        ) : null
      }
    >
      {text}
    </Button>
    // </Box>
  );
};

CustomButton.defaultProps = {
  type: 'button',
};

export default CustomButton;
