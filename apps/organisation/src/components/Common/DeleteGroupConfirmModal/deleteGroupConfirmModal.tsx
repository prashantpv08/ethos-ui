import React from "react";
import { Dailog} from '@ethos-frontend/ui';
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: (deleteIndex: number) => void;
  deleteIndex: number | null;
}

export const DeleteGroupConfirmModal: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onDelete,
  deleteIndex,
}) => {
  const {t} =useTranslation();
  const handleConfirm = () => {
    if (deleteIndex !== null) {
      onDelete(deleteIndex);
    }
    onClose();
  };

  return (
    <Dailog
      open={open}
      onCancel={onClose}
      onConfirm={handleConfirm}
      title="Delete Group"
      confirmText="Yes"
      cancelText="No"
      size="md"
    >
      {t('deleteGroup')}
    </Dailog>
  );
};


