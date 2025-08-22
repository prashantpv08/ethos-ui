import React from 'react';
import { Dailog as Dialog } from '@ethos-frontend/ui';
import Images from '../Utils/images';

interface Props {
  open: boolean;
  handleClose: () => void;
  title?: string;
  description?: string;
  type: 'success' | 'warning' | 'delete';
  onClick: (e?: any) => void;
  cancelBtnText: string;
  confirmBtnText: string;
}

export default function WarningDialog({
  title,
  description,
  type,
  open,
  cancelBtnText,
  confirmBtnText,
  handleClose,
  onClick,
}: Props) {
  return (
    <Dialog
      open={open}
      onCancel={handleClose}
      onConfirm={onClick}
      cancelText={cancelBtnText}
      confirmText={confirmBtnText}
      title={
        <div className="flex items-center gap-2">
          <img
            src={
              type === 'success'
                ? Images.SUCCESS_IC
                : type === 'warning'
                ? Images.WARNING
                : type === 'delete'
                ? Images.ERROR_IC
                : Images.WARNING
            }
            alt=""
          />
          {title}
        </div>
      }
    >
      {description}
    </Dialog>
  );
}
