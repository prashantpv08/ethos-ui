import { GridProps } from '@mui/material';
import React, { FC, ReactNode, ReactElement } from 'react';

interface GridContainerProps extends Omit<GridProps, 'color'> {
  columns: number;
  children: ReactNode;
  columnGap?: string;
  rowGap?: string;
}

export const GridContainer: FC<GridContainerProps> = ({
  columns,
  columnGap = '16px',
  rowGap = '16px',
  children,
  ...props
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    columnGap: columnGap,
    rowGap: rowGap,
  };

  return (
    <div style={gridStyle} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const element = child as ReactElement<{
            'data-span'?: number;
            style?: React.CSSProperties;
          }>;
          if (element.props['data-span']) {
            const span = element.props['data-span'];
            const itemStyle = {
              gridColumn: `span ${span}`,
              ...element.props.style,
            };
            return React.cloneElement(element, { style: itemStyle });
          }
          return element;
        }
        return child;
      })}
    </div>
  );
};
