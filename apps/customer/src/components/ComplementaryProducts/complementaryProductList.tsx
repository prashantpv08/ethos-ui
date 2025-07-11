import React from 'react';
import Link from 'next/link';
import styles from './complementaryProducts.module.scss';
import Image from 'next/image';
import { IProductList } from '../../types/product';
import { Iconbutton, Label } from '@ethos-frontend/ui';
import { priceWithSymbol } from '@ethos-frontend/utils';
import { useCart } from '../../context/cart';
import { generateProductKey } from '../../utils/cart';

export function ComplementaryProductsList(product: IProductList) {
  const { _id, name, finalPrice, imgUrl } = product;
  const { updateCart, cart } = useCart();

  const handleAddToCart = () => {
    const existingProduct = cart.find((item) => item._id === _id);
    const productKey =
      existingProduct?.productKey || generateProductKey(product);
    updateCart({ ...product, productKey }, 1);
  };

  return (
    <div className={styles.slider}>
      <div className="relative">
        <Link href={`/product/${_id}`} passHref>
          <div className={styles.cardImage}>
            <Image
              src={imgUrl?.[0]}
              width={96}
              height={96}
              alt={name}
              loading="lazy"
            />
          </div>
        </Link>
        <div className={styles.icon}>
          <Iconbutton name="cart" onClick={handleAddToCart} />
        </div>
      </div>
      <Link href={`/product/${_id}`} passHref>
        <div className="flex flex-col gap-1 pt-2">
          <Label variant="body1">{name}</Label>
          <Label variant="body1" weight="semibold">
            {priceWithSymbol(finalPrice)}
          </Label>
        </div>
      </Link>
    </div>
  );
}
