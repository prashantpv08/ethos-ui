import React from 'react';
import { TabPanel } from '@mui/lab';
import styles from './productList.module.scss';
import { IProductList } from '../../types/product';
import { ProductListDetails } from '../ProductListDetails';
import { useTranslation } from 'react-i18next';

interface CategoryDetailsWrapperProps {
  productList: IProductList[];
  selectedCategory: string;
  setShowFloater: (value: boolean) => void;
  setCartCount: (count: number) => void;
  setQuantity: (quantity: number) => void;
  selectedCategoryType: string;
}

export function CategoryDetailsWrapper({
  productList,
  selectedCategory,
  setShowFloater,
  setCartCount,
  setQuantity,
  selectedCategoryType,
}: CategoryDetailsWrapperProps) {
  const {t} = useTranslation();
  return productList?.length ? (
    productList.map((product: IProductList, i: number) => (
      <TabPanel key={i} value={selectedCategory} className={styles.tabpanel}>
        <ProductListDetails
          product={product}
          setShowFloater={setShowFloater}
          setCartCount={setCartCount}
          setQuantity={setQuantity}
          selectedCategoryType={selectedCategoryType}
        />
      </TabPanel>
    ))
  ) : (
    <p className="text-center text-base h-96 flex items-center justify-center">
      {t('customer.noProducts')}
    </p>
  );
}
