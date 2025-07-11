import React from 'react';
import styles from './complementaryProducts.module.scss';
import Carousel from 'react-multi-carousel';
import { Heading } from '@ethos-frontend/ui';
import { IProductList } from '../../types/product';
import { ComplementaryProductsList } from './complementaryProductList';
import { useTranslation } from 'react-i18next';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 5,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
  },
};

interface IComplementaryProducts {
  product: IProductList[];
}

export function ComplementaryProducts({ product }: IComplementaryProducts) {
  const { t } = useTranslation();
  return (
    <div className={styles.categoriesHolder}>
      <Heading variant="h5" weight="bold" className="mb-4">
        {t('customer.complementYourCard')}
      </Heading>

      <Carousel
        slidesToSlide={1}
        arrows={true}
        minimumTouchDrag={50}
        className={styles.complementarySlider}
        responsive={responsive}
      >
        {product?.map((category: IProductList) => (
          <ComplementaryProductsList key={category.name} {...category} />
        ))}
      </Carousel>
    </div>
  );
}
