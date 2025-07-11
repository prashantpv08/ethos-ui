import React from 'react';
import { Label, PrimaryButton } from '@ethos-frontend/ui';
import styles from './productList.module.scss';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface CountFloaterProps {
  counterRef: React.RefObject<HTMLDivElement | null>;
  cartCount: number;
  quantity: number;
  showFloater: boolean;
}

export function CountFloater({
  counterRef,
  cartCount,
  quantity,
  showFloater,
}: CountFloaterProps) {
  const router = useRouter();
  const { t } = useTranslation();
  if (!showFloater) return null;

  const productLabel =
    cartCount > 1 ? t('customer.products') : t('customer.product');
  const itemLabel = quantity > 1 ? t('customer.items') : t('customer.item');

  return (
    showFloater && (
      <div className={styles.addtoCart} ref={counterRef}>
        <div className={styles.addtoCartItem}>
          <Label variant="body1">{t('customer.youAdded')}</Label>
          <Label variant="subtitle2" weight="bold">
            {`${cartCount} ${productLabel} ${t('and')} ${quantity} ${itemLabel} ${t('customer.inYourCart')}`}
          </Label>
        </div>
        <div className={styles.addtoCartButton}>
          <PrimaryButton
            onClick={() => router.push('/cart')}
            className={styles.buttonWhite}
          >
            {t('customer.viewCart')}
          </PrimaryButton>
        </div>
      </div>
    )
  );
}
