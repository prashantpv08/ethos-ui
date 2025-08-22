import { Dailog as Dialog } from "@ethos-frontend/ui";

interface Props {
  open: boolean;
  handleClose: () => void;
  title: string;
  description?: string;
  type: "success" | "warning" | "delete";
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
      title={title}
    >
      {description}
    </Dialog>
  );
}
