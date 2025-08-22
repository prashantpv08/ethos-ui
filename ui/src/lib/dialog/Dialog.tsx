import React from 'react';
import {
  Dialog as BaseDialog,
  styled,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { PrimaryButton } from '../primaryButton';
import { Iconbutton } from '../iconButton';
import { Heading } from '../typography';

export interface IDialogProps {
  open: boolean;
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  size?: 'xs' | 'md' | 'lg' | 'xl';
  confirmDisabled?: boolean;
}

const Title = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  borderBottom: '1px solid #e6e6e6',
  ...theme.typography.subtitle1,
  fontWeight: 600
}));

const StyledContent = styled(DialogContent)(({ theme }) => ({
  overflowY: 'auto',
  flexGrow: 1,
  padding: '20px !important',
}));

const getDialogWidth = (size?: 'xs' | 'md' | 'lg' | 'xl'): string => {
  switch (size) {
    case 'xs':
      return '300px';
    case 'md':
      return '550px';
    case 'lg':
      return '800px';
    case 'xl':
      return '1200px';
    default:
      return '400px';
  }
};

const DialogContainer = styled(BaseDialog)<{
  size?: 'xs' | 'md' | 'lg' | 'xl';
}>(({ size }) => ({
  '& .MuiDialog-paper': {
    width: getDialogWidth(size),
    maxWidth: '100%',
  },
}));

const StyledAction = styled(DialogActions)(({ theme }) => ({
  padding: '20px',
  paddingTop: 0,
}));

const Dialog: React.FC<IDialogProps> = ({
  open,
  title,
  confirmText = 'Submit',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  children,
  size = 'xs',
  confirmDisabled = false,
}) => {
  return (
    <DialogContainer open={open} onClose={onCancel} size={size}>
      <Title>
        {title &&  title }
        <Iconbutton name="close" onClick={onCancel} />
      </Title>
      <StyledContent>{children}</StyledContent>
      <StyledAction>
        {cancelText && (
          <PrimaryButton variant="outlined" onClick={onCancel}>
            {cancelText}
          </PrimaryButton>
        )}
        {confirmText && (
          <PrimaryButton
            variant="contained"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmText}
          </PrimaryButton>
        )}
      </StyledAction>
    </DialogContainer>
  );
};

Dialog.displayName = 'Dialog';
export default Dialog;
