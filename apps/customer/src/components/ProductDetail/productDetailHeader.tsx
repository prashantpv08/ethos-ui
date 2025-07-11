import React from 'react';
import { priceWithSymbol } from '@ethos-frontend/utils';
import { PRODUCT_TYPE } from '../../constant';
import Carousel from 'react-multi-carousel';
import { Heading, Iconbutton, Label } from '@ethos-frontend/ui';
import Image from 'next/image';
import styles from './productDetail.module.scss';
import { IProductList, ISelectedValues } from '../../types/product';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

interface IProductDetailHeader {
  productData: IProductList;
  characteristicName: string[];
  totalPrice: number;
  selectedValues: ISelectedValues[];
}

export const ProductDetailHeader = ({
  productData,
  characteristicName,
  totalPrice,
  selectedValues,
}: IProductDetailHeader) => {
  return (
    <div className={styles.header}>
      <div className={styles.productImg}>
        <Carousel
          slidesToSlide={1}
          arrows={true}
          minimumTouchDrag={50}
          className={styles.complementarySlider}
          responsive={responsive}
        >
          {productData?.imgUrl?.map((img: string, i: number) => (
            <div key={i} className={styles.sliderImg}>
              <Image src={img} alt="Product-details" fill objectFit="cover" />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="flex justify-between px-6 pb-6">
        <div className="left flex flex-col gap-2 flex-1">
          <div className={styles.details}>
            <Heading variant="h4" weight="bold">
              {productData?.name}
            </Heading>
            <Iconbutton
              size="small"
              className="!p-0 !min-h-min !min-w-min"
              name={productData?.type === PRODUCT_TYPE.VEG ? 'veg' : 'non-veg'}
            />
          </div>
          <Label variant="body1">
            {characteristicName?.join(' | ')}
            {productData?.calory ? ` | ${productData.calory} cal` : null}
          </Label>

          <Label variant="subtitle2">{productData?.description}</Label>
        </div>
        <div className="right">
          <div className="flex flex-col items-end">
            <Label variant="h4" weight="bold">
              {priceWithSymbol(totalPrice)}
            </Label>
            {selectedValues.length && totalPrice > productData.finalPrice ? (
              <Label variant="subtitle2" weight="medium" className="text-right">
                Before Add ons <br />
                {priceWithSymbol(productData.finalPrice)}
              </Label>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
