import React from 'react';
import styles from './productDetail.module.scss';

interface CounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const Counter: React.FC<CounterProps> = ({
  count,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className={styles.counter}>
      <button onClick={onDecrement}>-</button>
      <div>{count}</div>
      <button onClick={onIncrement}>+</button>
    </div>
  );
};
