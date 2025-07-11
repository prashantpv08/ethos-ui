import React from 'react';
import styles from './orderReceived.module.scss';
import { Heading, Label } from '@ethos-frontend/ui';

export const OrderReceivedWrapper = () => {
  return (
    <div>
      <Heading variant="h4" weight="semibold" className="mb-3">
        Order Received
      </Heading>
      <Label variant="subtitle2">The order will be ready soon.</Label>
      <div className={styles.orderbox}>
        <Label variant="h1" weight="semibold" className={styles.orderNo}>
          #234
        </Label>
        <Label variant="body1" className={styles.orderNo}>
          Order number
        </Label>
      </div>
      <div className={styles.thankyou}>
        <Label variant="h5" weight="semibold" className="mb-3">
          Thank you for your order!
        </Label>
        <Label variant="subtitle2" className="pb-4">
          How would you like your receipt?
        </Label>
      </div>
    </div>
  );
};
