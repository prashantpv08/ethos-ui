import React from 'react';
import styles from './header.module.scss';
import { useRouter } from 'next/router';
import { Iconbutton } from '@ethos-frontend/ui';
import { Badge, IconButton } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import Image from 'next/image';
import { useCart } from '../../context/cart';

export const Header = ({ logo }: { logo: string }) => {
  const router = useRouter();
  const { cart } = useCart();

  return (
    <div className={styles.AppHeader}>
      <div className={styles.welcome}>
        <div className={styles.welcomeLeft}>
          <IconButton onClick={() => router.back()}>
            <ArrowBackIos sx={{ fontSize: '21px' }} />
          </IconButton>
          {logo ? (
            <Image src={logo} width={100} height={100} alt="Restaurant Logo" />
          ) : null}
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
