import React, { useEffect, useState } from 'react';
import styles from './productDetail.module.scss';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_COMBO_DETAIL } from '../../api/Queries/Product';
import { useParams } from 'next/navigation';
import { Iconbutton, Label, Paragraph, Radio } from '@ethos-frontend/ui';
import {
  ICheckboxProducts,
  IComboProducts,
  IExtraProducts,
  IExtras,
  IProductList,
  ISelectedValues,
} from '../../types/product';
import { extrasRadioChangeHandler } from '../../utils';
import { useCart } from '../../context/cart';
import { generateProductKey } from '../../utils/cart';
import { mapExtrasWithProducts, calculateTotalPrice } from '../../utils';
import { ExtrasList } from './extraList';
import { ProductDetailHeader } from './productDetailHeader';
import { ProductDetailFooter } from './productDetailFooter';
import { priceWithSymbol } from '@ethos-frontend/utils';

export function ComboProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { query } = router;

  const { cart, updateCart } = useCart();
  const [count, setCount] = useState<number>(1);
  const [selectedValues, setSelectedValues] = useState<ISelectedValues[]>([]);
  const [selectedComboValues, setSelectedComboValues] = useState<
    ISelectedValues[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [additionalNote, setAdditionalNote] = useState('');
  const [isItemInCart, setIsItemInCart] = useState(false);

  const { data: comboDetail } = useQuery(GET_COMBO_DETAIL, {
    variables: {
      id: params?.id,
    },
  });

  const productData = comboDetail?.customerComboDetail?.data;

  useEffect(() => {
    if (cart.length && !query?.new) {
      let itemInCart;
      if (query?.key) {
        itemInCart = cart.find((item) => item.productKey === query?.key);
      } else {
        itemInCart = cart.find((item) => item._id === productData?._id);
      }

      if (itemInCart) {
        setCount(itemInCart.quantity as number);
        setIsItemInCart(true);
        setAdditionalNote(itemInCart.note as string);
        if (itemInCart.selectedExtras) {
          setSelectedValues(
            itemInCart.selectedExtras.map((extra) => {
              const product = productData?.extrasProducts.find(
                (p: IExtraProducts) =>
                  p.name ===
                  (extra as unknown as Record<string, unknown>).label,
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

        if (itemInCart.selectedComboProducts) {
          setSelectedComboValues(
            itemInCart.selectedComboProducts.map((comboProduct) => {
              const product = productData?.productDetail.find(
                (p: { _id: string }) => p._id === comboProduct.productId,
              );
              return {
                groupName: comboProduct?.name as string,
                label: product?.name as string,
                value: product?._id as string,
                price: product?.price,
              };
            }),
          );
        }
      }
    } else if (query?.new === 'custom') {
      setSelectedValues([]);
      setSelectedComboValues([]);
      setCount(1);
    }
  }, [productData, cart]);

  useEffect(() => {
    const basePrice = productData?.finalPrice
      ? parseFloat(productData.finalPrice)
      : 0;
    const combinedSelectedValues = [...selectedValues, ...selectedComboValues];
    setTotalPrice(calculateTotalPrice(basePrice, combinedSelectedValues));
  }, [selectedValues, selectedComboValues, productData]);

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
    const updatedValuesWithId = updatedValues.map((item: ISelectedValues) => ({
      ...item,
      _id: _id,
    }));

    setSelectedValues(updatedValuesWithId);
  };

  const handleCheckboxChange = (
    newSelectedValues: {
      groupName: string;
      label: string;
      value: string;
      price?: number;
      _id?: string;
    }[],
    groupName: string,
    isCombo: boolean,
  ) => {
    if (isCombo) {
      setSelectedComboValues((prevValues) => {
        const filteredValues = prevValues.filter(
          (value) => value.groupName !== groupName,
        );
        const updatedValues = [...filteredValues, ...newSelectedValues];
        return updatedValues;
      });
    } else {
      setSelectedValues((prevValues) => {
        const filteredValues = prevValues.filter(
          (value) => value.groupName !== groupName,
        );
        const updatedValues = [...filteredValues, ...newSelectedValues];
        return updatedValues;
      });
    }
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

    const selectedComboProducts = selectedComboValues.map((item) => ({
      productId: item.value,
      name: item.groupName,
      label: item.label,
      price: item.price,
    }));

    const newItem: IProductList = {
      ...productData,
      quantity: count,
      selectedExtras: extras,
      selectedComboProducts: selectedComboProducts,
      finalPrice: totalPrice,
      productType: 'combo',
      note: additionalNote,
      productKey: query?.key || generateProductKey(productData),
    };

    const itemInCart = cart.find((item) => item.productKey === query.key);

    if (itemInCart) {
      const updatedItem = {
        ...itemInCart,
        quantity: count,
        selectedExtras: extras,
        note: additionalNote,
        selectedComboProducts: selectedComboProducts,
        finalPrice: totalPrice,
        productType: 'combo',
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

  const comboProductPackage = productData?.products
    .map((product: IComboProducts, index: number) => {
      if (product.type === 'Multiple') {
        const options = product.options
          .filter((option) => option.productId !== null)
          .map((option) => {
            return {
              ...option,
            };
          });

        return {
          ...product,
          options,
          productType: product.type,
          title: product.title,
        };
      }
    })
    .filter((product: IComboProducts) => product !== undefined);

  const renderRadio = (product: ICheckboxProducts) => {
    const options = [
      ...(product.options || [])
        .map((option) => {
          return option
            ? {
                label: option.name,
                value: option.productId,
                price: option.price,
                priceWithSymbol:
                  option?.price !== undefined
                    ? priceWithSymbol(option.price)
                    : priceWithSymbol(0),
              }
            : null;
        })
        .filter(
          (
            option,
          ): option is {
            label: string;
            value: string;
            price: number;
            priceWithSymbol: string;
          } => option !== null,
        ),
    ];

    return (
      <Radio
        name={product.title}
        value={
          selectedComboValues.find((val) => val.groupName === product.title)
            ?.value || ''
        }
        onChange={(e) => {
          const selectedOption = options.find(
            (opt) => opt.value === e.target.value,
          );
          const newSelectedValues = [
            {
              groupName: product.title || product.name,
              label: selectedOption?.label || '',
              value: e.target.value,
              price: selectedOption?.price || 0,
            },
          ];
          handleCheckboxChange(
            newSelectedValues,
            product.title || product.name,
            true,
          );
        }}
        options={options}
      />
    );
  };

  const renderList = () => {
    const singleName = productData?.products
      .map((product: IComboProducts) => {
        if (product.type === 'Single' && product.productId !== null) {
          const productDetail = productData.productDetail.find(
            (productDetail: { _id: string }) =>
              productDetail._id === product.productId,
          );
          return productDetail;
        }
      })
      .filter((productDetail: undefined) => productDetail !== undefined);

    if (!singleName || singleName.length === 0) {
      return null;
    }

    return singleName?.map((ele: { name: string }, index: number) => (
      <ul key={index}>
        <li>
          <Paragraph variant="subtitle2" weight="medium">
            {ele?.name}
          </Paragraph>
        </li>
      </ul>
    ));
  };

  const areAllExtrasSelected = extrasWithProducts?.every(
    (extra) =>
      !extra.isRequired ||
      selectedValues.some((val) => val.groupName === extra.groupName),
  );

  const areAllCombosSelected = comboProductPackage?.every(
    (product: { title: string }) =>
      selectedComboValues.some((val) => val.groupName === product.title),
  );

  const isAddToCartDisabled = !areAllExtrasSelected || !areAllCombosSelected;

  return productData ? (
    <>
      <ProductDetailHeader
        productData={productData}
        characteristicName={characteristicName}
        totalPrice={totalPrice}
        selectedValues={[...selectedComboValues, ...selectedValues]}
      />
      {renderList()?.length ? (
        <div className={styles.foodTopup}>
          <div>{renderList()}</div>
        </div>
      ) : null}

      <div className={styles.productOptions}>
        {comboProductPackage.map((product: ICheckboxProducts) => (
          <div key={product.title} className={styles.foodTopup}>
            <div>
              <div className={styles.radioHeader}>
                <Label variant="h5">{product.title}</Label>
                <Iconbutton
                  className="!p-0"
                  name="check"
                  text="Required"
                  textColor="var(--primary-color)"
                />
              </div>
              {renderRadio(product)}
            </div>
          </div>
        ))}
      </div>

      <ExtrasList
        extras={extrasWithProducts as IExtras[]}
        selectedValues={selectedValues}
        handleRadioChange={handleRadioChange}
        handleCheckboxChange={(newSelectedValues, groupName) =>
          handleCheckboxChange(newSelectedValues, groupName, false)
        }
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
