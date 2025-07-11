import {
  Counter,
  Heading,
  Label,
  PrimaryButton,
  TextField,
} from '@ethos-frontend/ui';
import React, { ChangeEvent } from 'react';
import styles from './productDetail.module.scss';

interface IProductDetailFooter {
  setCount: (val: number) => void;
  count: number;
  disabled: boolean;
  addToCart: () => void;
  setAdditionalNote: (val: string) => void;
  additionalNote: string;
  isItemInCart: boolean;
}

export const ProductDetailFooter = ({
  setCount,
  count,
  disabled,
  addToCart,
  setAdditionalNote,
  additionalNote,
  isItemInCart,
}: IProductDetailFooter) => {
  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <>
      <div className={styles.foodTopup}>
        <Heading variant="h5">
          Additional Request <Label variant="subtitle2"> (optional)</Label>
        </Heading>
        <TextField
          className="mt-2"
          multiline
          rows={3}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAdditionalNote(e.target.value)
          }
          value={additionalNote}
        />
      </div>
      <div className="sticky-footer-container">
        <div className={styles.countHolder}>
          <Counter
            count={count}
            onIncrement={incrementCount}
            onDecrement={decrementCount}
          />
          <div className={styles.addtoCart}>
            <PrimaryButton onClick={addToCart} disabled={disabled}>
              {isItemInCart ? 'Update' : 'Add to'} Cart
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};
