import React, { useEffect, useMemo, useState } from 'react';
import { CartDetail, ComplementaryProducts } from '..';
import styles from './cartItems.module.scss';
import { Heading } from '@ethos-frontend/ui';
import { calculateTax } from '../../utils';
import { IProductList } from '../../types/product';
import { ItemsList } from './itemsList';
import { useCart } from '../../context/cart';
import { DeleteModal } from './deleteModal';
import { generateProductKey } from '../../utils/cart';
import { getStorage, setStorage } from '@ethos-frontend/utils';
import { useRestQuery } from '@ethos-frontend/hook';
import { useTranslation } from 'react-i18next';

interface CartItemsProps {
  productList: IProductList[];
  setProductList: (value: IProductList[]) => void;
}

export const CartItems: React.FC<CartItemsProps> = ({
  productList,
  setProductList,
}) => {
  const { cart, setCart, updateCart } = useCart();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [productCounts, setProductCounts] = useState<{
    [key: string]: number | undefined;
  }>({});
  const [selectedProductForDeletion, setSelectedProductForDeletion] =
    useState<string>('');
  const [taxMode, setTaxMode] = useState<string>('');
  const [complementaryProductsList, setComplementaryProductsList] = useState<
    IProductList[]
  >([]);

  useRestQuery('fetchComplimentaryProducts', '/customer/complementary', {
    onSuccess: (data: { data: IProductList[] }) => {
      setComplementaryProductsList(data.data);
    },
  });

  useEffect(() => {
    const initialCounts = productList.reduce<{
      [key: string]: number | undefined;
    }>((acc, product) => {
      const itemInCart = cart.find(
        (item) =>
          item._id === product._id && item.productKey === product.productKey,
      );
      acc[product.productKey] = itemInCart ? itemInCart.quantity : 0;
      return acc;
    }, {});
    setProductCounts(initialCounts);

    const { taxMode } = JSON.parse(getStorage('restaurantData') || '{}');
    setTaxMode(taxMode || 'included');
  }, [productList, cart]);

  const handleDelete = (productKey: string) => {
    setSelectedProductForDeletion(productKey);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const totalTax = useMemo(() => {
    const total = productList.reduce((total, product) => {
      const count = productCounts[product.productKey] || 0;
      const { taxValue } = calculateTax(
        product.finalPrice,
        product.taxesDetail,
        taxMode,
      );
      return total + count * taxValue;
    }, 0);

    setStorage('totalTax', total.toFixed(2));

    return parseFloat(total.toFixed(2));
  }, [productCounts, productList, taxMode]);

  const itemTotal = useMemo(() => {
    if (taxMode === 'included') {
      return parseFloat(
        productList
          .reduce((total, product) => {
            const count = productCounts[product.productKey] || 0;
            return total + count * product.finalPrice;
          }, 0)
          .toFixed(2),
      );
    } else {
      return parseFloat(
        productList
          .reduce((total, product) => {
            const count = productCounts[product.productKey] || 0;
            const { baseValue } = calculateTax(
              product.finalPrice,
              product.taxesDetail,
              taxMode,
            );
            return total + count * baseValue;
          }, 0)
          .toFixed(2),
      );
    }
  }, [productCounts, productList, taxMode]);

  useEffect(() => {
    setStorage('subTotal', itemTotal.toString());
  }, [itemTotal]);

  const updateProductCount = (product: IProductList, newCount: number) => {
    const productKey = product.productKey || generateProductKey(product);
    const updatedProduct = { ...product, productKey, quantity: newCount };

    const existingProductIndex = cart.findIndex(
      (item) => item.productKey === productKey && item._id === product._id,
    );

    if (existingProductIndex !== -1) {
      // Update existing product
      cart[existingProductIndex].quantity = newCount;
    } else {
      // Add new product
      const updatedProduct = { ...product, productKey, quantity: newCount };
      cart.push(updatedProduct);
    }

    // Remove product if new count is 0
    const updatedCart = cart.filter((item) => item.quantity > 0);

    setCart(updatedCart);
    updateCart(updatedProduct, newCount);
    const totalProductCount = updatedCart
      .filter(
        (item) => item._id === product._id && item.productKey === productKey,
      )
      .reduce((sum, item) => sum + (item.quantity as number), 0);

    setProductCounts((prev) => ({
      ...prev,
      [product.productKey]: totalProductCount,
    }));
  };

  const onIncrement = (product: IProductList) => {
    const newCount = (productCounts[product.productKey] || 0) + 1;
    updateProductCount(product, newCount);
  };

  const onDecrement = (product: IProductList) => {
    const newCount = (productCounts[product.productKey] || 0) - 1;

    if (newCount === 0) {
      handleDelete(product.productKey);
    } else if (newCount > 0) {
      updateProductCount(product, newCount);
    }
  };

  const removeProductFromCart = (productKey: string) => {
    const currentCart = cart.filter(
      (product) => product.productKey !== productKey,
    );
    setStorage('cart', JSON.stringify(currentCart));
    setProductCounts((prev) => {
      const newCounts = { ...prev };
      delete newCounts[productKey];
      return newCounts;
    });
    setProductList(currentCart);
    setCart(currentCart);
    handleClose();
  };

  return (
    <>
      <div className={`p-6 ${styles.cartProducts}`}>
        <Heading variant="h5" weight="bold">
          {t('customer.yourOrders')}
        </Heading>
        <ItemsList
          productList={productList}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          handleDelete={handleDelete}
        />
      </div>
      {complementaryProductsList?.length ? (
        <ComplementaryProducts product={complementaryProductsList} />
      ) : null}
      <CartDetail itemTotal={itemTotal} tax={totalTax} taxMode={taxMode} />

      <DeleteModal
        open={open}
        onClose={handleClose}
        onSubmit={() => removeProductFromCart(selectedProductForDeletion)}
      />
    </>
  );
};
