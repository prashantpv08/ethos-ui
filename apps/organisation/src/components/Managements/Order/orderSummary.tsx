import styles from './order.module.scss';
import { Card } from '@ethos-frontend/components';
import { Label, Paragraph } from '@ethos-frontend/ui';
import { IOrderDetails } from './payCounter';
import { useTranslation } from 'react-i18next';

interface IOrderSummary {
  orderDetailsData: IOrderDetails;
}

export const OrderSummary = ({ orderDetailsData }: IOrderSummary) => {
  const { t } = useTranslation();
  return (
    <Card title={t('order.summary')}>
      <div className="ml-auto pt-5 grid gap-2">
        <div className={styles.orderPrices}>
          <Label variant="subtitle2" color="secondary">
            {t('order.subtotal')}
          </Label>
          <Paragraph variant="subtitle2">
            {orderDetailsData?.subTotal || 0}
          </Paragraph>
        </div>
        <div className={styles.orderPrices}>
          <Label variant="subtitle2" color="secondary">
            {t('order.taxes')}
          </Label>
          <Paragraph variant="subtitle2">
            {orderDetailsData?.totalTax || 0}
          </Paragraph>
        </div>
        <div className={styles.orderPrices}>
          <Label variant="subtitle2" color="secondary">
            {t('order.tip')}
          </Label>
          <Paragraph variant="subtitle2">
            {orderDetailsData?.tip || 0}
          </Paragraph>
        </div>
        <div className={styles.orderPrices}>
          <Label variant="subtitle2" color="secondary">
            {t('order.serviceFee')}
          </Label>
          <Paragraph variant="subtitle2">
            {orderDetailsData?.serviceTax || 0}
          </Paragraph>
        </div>

        <div className={styles.orderPrices}>
          <Label variant="subtitle2" color="secondary" weight="bold">
            {t('total')}
          </Label>
          <Paragraph variant="subtitle2" weight="bold">
            {orderDetailsData?.total || 0}
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};
