import { useEffect, useState } from 'react';
import { calculatedFinalPrice } from '../utils/productUtil';

interface PriceParams {
  price: number;
  discount: number;
}

export const useFinalPrice = ({ price, discount }: PriceParams) => {
  const [finalPrice, setFinalPrice] = useState<number>(0);

  useEffect(() => {
    setFinalPrice(calculatedFinalPrice({ watchPrice: price, watchDiscount: discount }));
  }, [price, discount]);

  return finalPrice;
};
