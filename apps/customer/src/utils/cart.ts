import { getStorage, setStorage } from '@ethos-frontend/utils';
import { IProductList } from '../types/product';

interface UpdateCartParams {
  data: IProductList;
  newCount: number;
}

export const getCart = (): IProductList[] => {
  return JSON.parse(getStorage('cart') || '[]');
};

let indexCounter = 0;

export const generateProductKey = (product: IProductList): string => {
  return `${product._id}-${indexCounter++}`;
};

export const updateCart = ({
  data,
  newCount,
}: UpdateCartParams): IProductList[] => {
  const currentCart = getCart();

  const productKey = data.productKey;
  const mutableData = { ...data, productKey };

  const itemIndex = currentCart.findIndex(
    (item) => item.productKey === productKey
  );

  if (newCount > 0) {
    if (itemIndex > -1) {
      currentCart[itemIndex] = {
        ...currentCart[itemIndex],
        quantity: newCount,
        selectedExtras: mutableData.selectedExtras,
        selectedComboProducts: mutableData.selectedComboProducts,
        finalPrice: mutableData.finalPrice,
        note: mutableData.note,
        productKey,
      };
    } else {
      currentCart.push({ ...mutableData, quantity: newCount });
    }
  } else if (itemIndex > -1) {
    currentCart.splice(itemIndex, 1);
  }
  setStorage('cart', JSON.stringify(currentCart));
  return currentCart;
};
