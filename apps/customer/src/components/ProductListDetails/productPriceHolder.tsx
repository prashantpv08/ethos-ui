import React, { useEffect, useState } from 'react';
import styles from './productListDetails.module.scss';
import {
  Counter,
  Drawer,
  Heading,
  Label,
  PrimaryButton,
} from '@ethos-frontend/ui';
import { Extra, IProductList } from '../../types/product';
import { useCart } from '../../context/cart';
import { handleCustomization } from '../../utils';
import { useRouter } from 'next/router';
import { ItemsList } from '../CartItems/itemsList';
import { DeleteModal } from '../CartItems/deleteModal';
import { generateProductKey } from '../../utils/cart';
import { priceWithSymbol, setStorage } from '@ethos-frontend/utils';

interface IProductPriceHolder {
  data: IProductList;
  description: string;
  finalPrice: number;
  setCartCount: (value: number) => void;
  setShowFloater: (value: boolean) => void;
  setQuantity: (value: number) => void;
  extras: Extra[];
  price?: number;
  discount?: number;
  selectedCategoryType?: string;
  existingProductDrawer: boolean;
  setExistingProductDrawer: (val: boolean) => void;
  existingCartProducts: IProductList[];
  setExistingCartProducts: (products: IProductList[]) => void;
  navigateToProductPage: () => void;
}

export function ProductPriceHolder({
  data,
  description,
  finalPrice,
  setCartCount,
  setShowFloater,
  setQuantity,
  price,
  discount,
  extras,
  selectedCategoryType,
  setExistingProductDrawer,
  existingProductDrawer,
  existingCartProducts,
  setExistingCartProducts,
  navigateToProductPage,
}: IProductPriceHolder) {
  const router = useRouter();
  const requiredExtra = extras?.filter((val) => val?.isRequired);

  const [count, setCount] = useState<number>(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProductForDeletion, setSelectedProductForDeletion] =
    useState<string>('');

  const { cart, setCart, updateCart } = useCart();

  useEffect(() => {
    const totalProductCount = getTotalProductCount(cart, data._id);
    const totalItemCount = getTotalItemCount(cart);

    setCount(totalProductCount);
    setQuantity(totalItemCount);
    setCartCount(cart.length);
    setShowFloater(cart.length > 0);
  }, [data._id, cart]);

  const updateCartState = (product: IProductList, newCount: number) => {
    const productKey = product.productKey || generateProductKey(product);
    const updatedProduct = { ...product, productKey, quantity: newCount };

    let updatedCart = cart.map((item) =>
      item.productKey === productKey ? updatedProduct : item
    );

    if (newCount === 0) {
      updatedCart = updatedCart.filter(
        (item) => item.productKey !== productKey
      );
    } else if (!updatedCart.some((item) => item.productKey === productKey)) {
      updatedCart.push(updatedProduct);
    }

    setCart(updatedCart);
    syncCartState(updatedCart);
    updateCart(updatedProduct, newCount);
  };

  const onIncrement = () => {
    const existingCartProduct = cart.find((item) => item._id === data._id);

    if (
      !handleCustomization(
        cart,
        data,
        selectedCategoryType,
        requiredExtra,
        navigateToProductPage,
        setExistingCartProducts,
        setExistingProductDrawer
      )
    ) {
      const newCount = count + 1;
      setCount(newCount);
      updateCartState(
        {
          ...data,
          productKey:
            existingCartProduct?.productKey || generateProductKey(data),
        },
        newCount
      );
    }
  };

  const onDecrement = () => {
    if (count > 0) {
      const existingCartProduct = cart.find((item) => item._id === data._id);
      if (
        !handleCustomization(
          cart,
          data,
          selectedCategoryType,
          requiredExtra,
          navigateToProductPage,
          setExistingCartProducts,
          setExistingProductDrawer
        )
      ) {
        const newCount = count - 1;
        setCount(newCount);
        updateCartState(
          {
            ...data,
            productKey:
              existingCartProduct?.productKey || generateProductKey(data),
          },
          newCount
        );
      }
    }
  };

  const onIncrementOfExistingProduct = (product: IProductList) => {
    const newCount = (product.quantity as number) + 1;
    updateCartState(product, newCount);
    updateExistingCartProducts(product, newCount);
  };

  const onDecrementOfExistingProduct = (product: IProductList) => {
    const newCount = (product.quantity as number) - 1;

    if (newCount > 0) {
      updateCartState(product, newCount);
      updateExistingCartProducts(product, newCount);
    } else {
      handleDelete(product.productKey);
    }
  };

  const handleDelete = (productKey: string) => {
    setSelectedProductForDeletion(productKey);
    setDeleteModal(true);
  };

  const removeProductFromCart = (productKey: string) => {
    const updatedCart = cart.filter((item) => item.productKey !== productKey);
    setStorage('cart', JSON.stringify(updatedCart));
    setExistingCartProducts(
      existingCartProducts.filter((item) => item.productKey !== productKey)
    );
    setCart(updatedCart);
    setDeleteModal(false);
    if (!existingCartProducts.length) setExistingProductDrawer(false);
  };

  useEffect(() => {
    if (existingCartProducts.length === 0) {
      setExistingProductDrawer(false);
    }
  }, [existingCartProducts]);

  const updateExistingCartProducts = (
    product: IProductList,
    newCount: number
  ) => {
    const updatedProducts = existingCartProducts
      .map((item) =>
        item.productKey === product.productKey
          ? { ...item, quantity: newCount }
          : item
      )
      .filter((item) => item?.quantity > 0);
    setExistingCartProducts(updatedProducts);
  };

  const syncCartState = (updatedCart: IProductList[]) => {
    const totalItemCount = getTotalItemCount(updatedCart);
    setCartCount(updatedCart.length);
    setShowFloater(updatedCart.length > 0);
    setQuantity(totalItemCount);
  };

  const getTotalProductCount = (cart: IProductList[], productId: number) => {
    return cart
      .filter((item) => item._id === productId)
      .reduce((sum, item) => sum + (item.quantity as number), 0);
  };

  const getTotalItemCount = (cart: IProductList[]) => {
    return cart.reduce((sum, item) => sum + (item.quantity as number), 0);
  };

  return (
    <>
      <div className={styles.description}>
        <Label variant="body1" className="pb-2">
          {description}
        </Label>
      </div>

      <div className="flex justify-between items-center">
        <div className={styles.price}>
          <Label variant="subtitle2">{priceWithSymbol(finalPrice)}</Label>
          {discount!==0 && <Label variant="body1" className={styles.discount}>
            {priceWithSymbol(price || 0)}
          </Label>}
        </div>

        <Counter
          count={count}
          setCount={setCount}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </div>
      <Drawer
        anchor="bottom"
        open={existingProductDrawer}
        onClose={() => setExistingProductDrawer(false)}
        onOpen={() => setExistingProductDrawer(true)}
      >
        <div className={styles.drawerHeader}>
          <Heading className={styles.title} variant="h5" weight="semibold">
            Repeat last used customization?
          </Heading>
          <div className={styles.existingList}>
            <ItemsList
              productList={existingCartProducts}
              onIncrement={onIncrementOfExistingProduct}
              onDecrement={onDecrementOfExistingProduct}
              handleDelete={handleDelete}
            />
          </div>
          <PrimaryButton
            variant="text"
            className={styles.newBtn}
            onClick={() =>
              router.push(
                selectedCategoryType === 'combo'
                  ? `/combo/${data._id}?new=custom`
                  : `/product/${data._id}?new=custom`
              )
            }
          >
            + Add new customization
          </PrimaryButton>
        </div>
      </Drawer>
      <DeleteModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onSubmit={() => removeProductFromCart(selectedProductForDeletion)}
      />
    </>
  );
}
