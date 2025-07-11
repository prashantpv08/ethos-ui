import React from 'react';
import {
  Snackbar as BasicSnackbar,
  Alert,
  AlertColor,
  SlideProps,
  Slide,
  Grow,
  Fade,
} from '@mui/material';

export interface SnackbarComponentProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: AlertColor;
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
  transition?: 'Slide' | 'Grow' | 'Fade';
}

const Snackbar: React.FC<SnackbarComponentProps> = ({
  message,
  open,
  onClose,
  severity = 'info',
  vertical = 'top',
  horizontal = 'center',
  transition = 'Slide',
}) => {
  const TransitionComponent = (props: SlideProps) => {
    switch (transition) {
      case 'Slide':
        return <Slide {...props} direction="up" />;
      case 'Grow':
        return <Grow {...props} />;
      case 'Fade':
        return <Fade {...props} />;
      default:
        return <Slide {...props} direction="up" />;
    }
  };

  return (
    <BasicSnackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical, horizontal }}
      TransitionComponent={TransitionComponent}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </BasicSnackbar>
  );
};
Snackbar.displayName = 'Snackbar';
export default Snackbar;
