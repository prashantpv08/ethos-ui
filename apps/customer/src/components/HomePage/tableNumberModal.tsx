import React, { memo } from 'react';
import { Modal, PrimaryButton } from '@ethos-frontend/ui';
import { ControlledInput } from '@ethos-frontend/components';
import { Control, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ORDER_TYPE } from '../../constant';

interface TableNumberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isMobile: boolean;
  control: Control<any>;
  errors: FieldErrors<any>;
  setCustomerNumber: (value: string) => void;
  orderType?: ORDER_TYPE;
}

export const TableNumberModal: React.FC<TableNumberModalProps> = memo(
  ({
    open,
    onClose,
    onSubmit,
    isMobile,
    control,
    errors,
    setCustomerNumber,
    orderType,
  }) => {
    const { t } = useTranslation();
    const content =
      orderType === ORDER_TYPE.roomService
        ? t('customer.enterYourRoomNumber')
        : t('customer.enterYourTableNumber');
    return (
      <Modal
        open={open}
        title={content}
        onClose={onClose}
        size={isMobile ? 'xs' : 'md'}
      >
        <form onSubmit={onSubmit} noValidate>
          <ControlledInput
            name="tableNumber"
            type="number"
            errors={errors}
            control={control}
            label={content}
            fullWidth
            required
            onChange={(e) => setCustomerNumber(e)}
          />
          <div className="mt-5">
            <PrimaryButton fullWidth type="submit">
              {t('customer.viewMenu')}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    );
  },
);

TableNumberModal.displayName = 'TableNumberModal';
