import { Modal, Paragraph, PrimaryButton } from '@ethos-frontend/ui';
import { useTranslation } from 'react-i18next';

interface IDeleteModal {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
}

export const DeleteModal = ({
  open,
  onClose,
  onSubmit,
  loading,
}: IDeleteModal) => {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('deleteModalTitle')}
      size="md"
    >
      <div>
        <Paragraph variant="subtitle1">{t('deleteModalDescription')}</Paragraph>
        <div className="flex justify-end gap-4 pt-5">
          <PrimaryButton variant="outlined" onClick={onClose}>
            {t('cancel')}
          </PrimaryButton>
          <PrimaryButton onClick={onSubmit} loading={loading}>
            {t('delete')}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};
