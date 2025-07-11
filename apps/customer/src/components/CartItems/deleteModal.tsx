import { Heading, Modal, PrimaryButton } from '@ethos-frontend/ui';
import { useTranslation } from 'react-i18next';

type DeleteModal = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export const DeleteModal = ({ open, onClose, onSubmit }: DeleteModal) => {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('customer.deleteProduct')}
      size="xs"
    >
      <div className="flex flex-col gap-6 text-center">
        <Heading variant="h5" weight="semibold">
          {t('customer.deleteTitle')}
        </Heading>
        <div className="flex gap-x-4 justify-center">
          <PrimaryButton variant="text" onClick={onClose}>
            {t('cancel')}
          </PrimaryButton>
          <PrimaryButton color="error" onClick={onSubmit}>
            {t('customer.deleteSuccess')}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};
