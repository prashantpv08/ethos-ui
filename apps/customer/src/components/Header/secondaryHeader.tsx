import React, { useEffect, useState } from 'react';
import styles from './header.module.scss';
import { useRouter } from 'next/router';
import { ORDER_TYPE } from '../../constant';
import { Iconbutton } from '@ethos-frontend/ui';
import Image from 'next/image';
import { Badge } from '@mui/material';
import { useCart } from '../../context/cart';
import { getStorage } from '@ethos-frontend/utils';
import { useTranslation } from 'react-i18next';

export const SecondaryHeader = ({ logo }: { logo: string }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { cart } = useCart();
  const [tableNumber, setTableNumber] = useState<string | null>('');
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [orderType, setOrderType] = useState<string | null>('');
  const [type, setType] = useState<string | null>('');
  const [roomNumber, setRoomNumber] = useState<string>('');

  useEffect(() => {
    const tableNo = getStorage('tableNumber');
    const roomNo = getStorage('roomNo');
    setRoomNumber(roomNo);
    setTableNumber(tableNo);
    const type = getStorage('orderType');
    setOrderType(type);
    const { restaurantName, restaurantType } = JSON.parse(
      getStorage('restaurantData') || '{}',
    );
    setType(restaurantType);
    setRestaurantName(restaurantName);
  }, []);

  const getHeaderLabel = () => {
    if (tableNumber) {
      return t('customer.tableNumber', { tableNumber });
    }
    if (orderType === ORDER_TYPE.roomService) {
      return t('customer.roomNumber', {roomNumber});
    }
    if (orderType === ORDER_TYPE.dine && type === 'fast_casual') {
      return t('dineIn');
    }
    return t('takeAway');
  };

  return (
    <div className={styles.AppHeader}>
      <div className={styles.welcome}>
        <div className={styles.welcomeRight}>
          <span className={styles.tabelNumber}>{getHeaderLabel()}</span>
          {logo ? (
            <Image src={logo} width={100} height={100} alt="Restaurant Logo" />
          ) : null}
        </div>
        <div className={styles.welcomeLeft}>
          {t('customer.welcomeTo')} {restaurantName}
          <span className={styles.cart}>
            <Badge badgeContent={cart?.length} className={styles.badge}>
              <Iconbutton
                className="ml-auto"
                onClick={() => router.push('/cart')}
                name="cart"
              />
            </Badge>
          </span>
        </div>
      </div>
    </div>
  );
};
