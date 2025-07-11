import React from 'react';
import {
  FormControlLabel,
  Switch as BaseSwitch,
  styled,
  SwitchProps,
} from '@mui/material';

export interface BaseSwitchProps extends SwitchProps {
  label?: string;
}

const StyledLabel = styled(FormControlLabel)(({ theme }) => ({
  ...theme.typography.subtitle2,
}));

const CustomSwitch = styled(BaseSwitch)(({ theme }) => ({
  width: 50,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    top: 8,
    left: 2,
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',

      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.success.main,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#fff',
    width: 16,
    height: 16,
    '&:before': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#bdbdbd',
    borderRadius: 20 / 2,
  },
}));

const Switch: React.FC<BaseSwitchProps> = ({ label, ...props }) => {
  return <StyledLabel control={<CustomSwitch {...props} />} label={label} />;
};

Switch.displayName = 'Switch';
export default Switch;
