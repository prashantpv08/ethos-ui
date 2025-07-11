import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_DETAIL } from '../../api/Queries/Product';
import { useParams } from 'next/navigation';
import {
  IExtraProducts,
  IExtras,
  IProductList,
  ISelectedValues,
} from '../../types/product';
import { useCart } from '../../context/cart';
import { generateProductKey } from '../../utils/cart';
import {
  mapExtrasWithProducts,
  calculateTotalPrice,
  extrasRadioChangeHandler,
} from '../../utils';
import { ExtrasList } from './extraList';
import { ProductDetailHeader } from './productDetailHeader';
import { ProductDetailFooter } from './productDetailFooter';

export function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { query } = router;

  const { cart, updateCart } = useCart();
  const [count, setCount] = useState<number>(1);
  const [selectedValues, setSelectedValues] = useState<ISelectedValues[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [additionalNote, setAdditionalNote] = useState('');
  const [isItemInCart, setIsItemInCart] = useState(false);

  const { data: productDetail } = useQuery(GET_PRODUCT_DETAIL, {
    variables: {
      id: params?.id,
    },
  });

  const productData = productDetail?.customerProductDetail?.data;

  useEffect(() => {
    if (cart.length && !query?.new) {
      let itemInCart;
      if (query?.key) {
        itemInCart = cart.find((item) => item.productKey === query?.key);
      } else {
        itemInCart = cart.find((item) => item._id === productData?._id);
      }

      if (itemInCart) {
        setIsItemInCart(true);
        setAdditionalNote(itemInCart.note as string);
        setCount(itemInCart.quantity as number);
        if (itemInCart.selectedExtras) {
          setSelectedValues(
            itemInCart.selectedExtras.map((extra) => {
              const product = productData?.extrasProducts.find(
                (p: IExtraProducts) => p.name === extra.label,
              );

              return {
                groupName: extra?.groupName,
                label: product?.name as string,
                value: product?._id as string,
                price: product?.price,
                _id: extra._id,
              };
            }),
          );
        }
      }
    } else if (query?.new === 'custom') {
      setSelectedValues([]);
      setCount(1);
    }
  }, [productData, cart]);

  useEffect(() => {
    const basePrice = productData?.finalPrice
      ? parseFloat(productData.finalPrice)
      : 0;
    setTotalPrice(calculateTotalPrice(basePrice, selectedValues));
  }, [selectedValues, productData]);

  const characteristicName = productData?.characteristicsDetail?.map(
    (val: { name: string }) => val?.name,
  );

  const handleRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    groupName: string,
    _id: string,
  ) => {
    const updatedValues = extrasRadioChangeHandler(
      e,
      groupName,
      productData,
      selectedValues,
    );

    const updatedValuesWithId = updatedValues.map((item: ISelectedValues) => {
      if (item.groupName === groupName) {
        return {
          ...item,
          _id: _id,
        };
      }
      return item;
    });

    setSelectedValues(updatedValuesWithId);
  };

  const handleCheckboxChange = (
    newSelectedValues: ISelectedValues[],
    groupName: string,
  ) => {
    setSelectedValues((prevValues) => {
      const filteredValues = prevValues.filter(
        (value) => value.groupName !== groupName,
      );

      const updatedValues = [...filteredValues, ...newSelectedValues];

      return updatedValues;
    });
  };

  const addToCart = () => {
    const extras = selectedValues.map((item) => ({
      groupName: item.groupName,
      label: item.label,
      value: item.value,
      price: item.price,
      productId: item.value,
      _id: item._id,
    }));

    const newItem: IProductList = {
      ...productData,
      quantity: count,
      selectedExtras: extras,
      finalPrice: totalPrice,
      productKey: query?.key || generateProductKey(productData),
      note: additionalNote,
    };

    const itemInCart = cart.find((item) => item.productKey === query.key);

    if (itemInCart) {
      const updatedItem = {
        ...itemInCart,
        quantity: count,
        selectedExtras: extras,
        finalPrice: totalPrice,
        note: additionalNote,
      };
      updateCart(updatedItem, count);
    } else {
      updateCart(newItem, count);
    }
    router.push('/cart');
  };

  const extrasWithProducts =
    productData?.extras && productData?.extrasProducts
      ? mapExtrasWithProducts(productData.extras, productData.extrasProducts)
      : [];

  const isAddToCartDisabled = extrasWithProducts.some(
    (extra) =>
      extra.isRequired &&
      !selectedValues.some((val) => val.groupName === extra.groupName),
  );

  return productData ? (
    <>
      <ProductDetailHeader
        productData={productData}
        characteristicName={characteristicName}
        totalPrice={totalPrice}
        selectedValues={selectedValues}
      />
      <ExtrasList
        extras={extrasWithProducts as IExtras[]}
        selectedValues={selectedValues}
        handleRadioChange={handleRadioChange}
        handleCheckboxChange={handleCheckboxChange}
      />

      <ProductDetailFooter
        setCount={setCount}
        count={count}
        disabled={isAddToCartDisabled}
        addToCart={addToCart}
        setAdditionalNote={setAdditionalNote}
        additionalNote={additionalNote}
        isItemInCart={isItemInCart}
      />
    </>
  ) : null;
}
