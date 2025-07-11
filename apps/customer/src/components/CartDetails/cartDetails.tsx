import React from 'react';
import styles from './cartDetails.module.scss';
import { Heading, Label, PrimaryButton } from '@ethos-frontend/ui';
import { useRouter } from 'next/router';
import { priceWithSymbol } from '@ethos-frontend/utils';
import { useTranslation } from 'react-i18next';

export const CartDetail = ({
  itemTotal,
  tax,
  taxMode,
}: {
  itemTotal: number;
  tax: number;
  taxMode: string;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const formattedItemTotal = Number(itemTotal?.toFixed(2));
  const formattedTax = Number(tax.toFixed(2));
  const subtotal =
    taxMode === 'included'
      ? formattedItemTotal
      : formattedItemTotal + formattedTax;
  const formattedSubtotal = Number(subtotal.toFixed(2));

  return (
    <>
      <div className={styles.card}>
        <Heading variant="h5" className="pb-4" weight="bold">
          {t('customer.details')}
        </Heading>
        <div className={styles.itemTotalCard}>
          <Label variant="subtitle2" className="flex justify-between">
            {t('customer.itemPrice')}{' '}
            <span>{priceWithSymbol(formattedItemTotal)}</span>
          </Label>
          <Label variant="subtitle2" className="flex justify-between">
            {t('customer.tax')} (
            {taxMode === 'included'
              ? t('customer.included')
              : t('customer.excluded')}
            ) <span>{priceWithSymbol(formattedTax)}</span>
          </Label>
          <hr />
          <Label
            variant="subtitle2"
            weight="bold"
            className="flex justify-between"
          >
            {t('customer.subTotal')}
            <span>{priceWithSymbol(formattedSubtotal)}</span>
          </Label>
        </div>
      </div>
      <div className="sticky-footer-container">
        <PrimaryButton
          variant="outlined"
          onClick={() => router.push('/explore')}
          fullWidth
        >
          {t('customer.addMoreItems')}
        </PrimaryButton>
        <PrimaryButton onClick={() => router.push('/confirmation')} fullWidth>
          {t('customer.checkout')}
        </PrimaryButton>
      </div>
    </>
  );
};
