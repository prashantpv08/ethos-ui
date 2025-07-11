import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './productListDetails.module.scss';
import { Iconbutton, Label } from '@ethos-frontend/ui';
import { PRODUCT_TYPE } from '../../constant';
import { ProductPriceHolder } from './productPriceHolder';
import { IProductList } from '../../types/product';
import { useCart } from '../../context/cart';
import { handleCustomization } from '../../utils';
import { useRouter } from 'next/router';
import { setStorage } from '@ethos-frontend/utils';

interface IProductListDetail {
  product: IProductList;
  setCartCount: (value: number) => void;
  setShowFloater: (value: boolean) => void;
  setQuantity: (value: number) => void;
  selectedCategoryType: string;
}
export function ProductListDetails({
  product,
  setShowFloater,
  setCartCount,
  setQuantity,
  selectedCategoryType,
}: IProductListDetail) {
  const {
    name,
    description,
    price,
    finalPrice,
    imgUrl,
    _id,
    type,
    characteristicsDetail,
    calory,
    extras,
    comboPrice,
    discount,
  } = product;

  const { cart } = useCart();
  const router = useRouter();
  const [existingProductDrawer, setExistingProductDrawer] = useState(false);
  const [existingCartProducts, setExistingCartProducts] = useState<
    IProductList[]
  >([]);

  const characteristics = characteristicsDetail?.map((val) => ({
    name: val.name,
  }));

  const requiredExtra = extras?.filter((val) => val?.isRequired);

  const navigateToProductPage = () => {
    setStorage('productName', name)
    router.push(
      selectedCategoryType === 'combo' ? `/combo/${_id}` : `/product/${_id}`
    );
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const customized = handleCustomization(
      cart,
      product,
      selectedCategoryType,
      requiredExtra,
      navigateToProductPage,
      setExistingCartProducts,
      setExistingProductDrawer
    );
    if (customized) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.itemList}>
      <Link
        href={
          selectedCategoryType === 'combo' ? `/combo/${_id}` : `/product/${_id}`
        }
        className={styles.thumbnail}
        onClick={handleLinkClick}
      >
        <Image
          src={`${imgUrl[0]}`}
          width={336}
          height={176}
          alt={name}
          loading="lazy"
        />
      </Link>
      <div className={styles.itemDetailsHolder}>
        <Iconbutton
          className="!p-0 !min-h-min !min-w-min"
          name={type === PRODUCT_TYPE.VEG ? 'veg' : 'non-veg'}
        />

        <Link href={`/product/${_id}`}>
          <Label variant="subtitle2" weight="bold" className="pb-2">
            {name}
          </Label>
        </Link>
        <Label variant="body1" className="ml-2">
          {calory ? `${calory} cal` : null}
        </Label>
        <div className={styles.characters}>
          {characteristics?.map((val, i) => (
            <div key={i} className={styles.charBtn}>
              <Label variant="body1"> {val.name}</Label>
            </div>
          ))}
        </div>

        <ProductPriceHolder
          description={description}
          finalPrice={finalPrice}
          price={price || comboPrice}
          discount={discount}
          data={product}
          setShowFloater={setShowFloater}
          setCartCount={setCartCount}
          setQuantity={setQuantity}
          extras={extras}
          selectedCategoryType={selectedCategoryType}
          setExistingProductDrawer={setExistingProductDrawer}
          existingProductDrawer={existingProductDrawer}
          existingCartProducts={existingCartProducts}
          setExistingCartProducts={setExistingCartProducts}
          navigateToProductPage={navigateToProductPage}
        />
      </div>
    </div>
  );
}
