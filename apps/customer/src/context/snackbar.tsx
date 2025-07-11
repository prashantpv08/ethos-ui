// SnackbarContext.tsx
import { Snackbar } from '@ethos-frontend/ui';
import { AlertColor } from '@mui/material';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

interface SnackbarContextProps {
  showSnackbar: (message: string, severity: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: AlertColor;
    open: boolean;
  }>({
    message: '',
    severity: 'info',
    open: false,
  });

  const showSnackbar = useCallback(
    (message: string, severity: AlertColor) => {
      setSnackbar({ message, severity, open: true });
    },
    [open]
  );

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        onClose={handleClose}
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextProps => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
