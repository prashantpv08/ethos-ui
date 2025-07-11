import React, { ReactNode } from 'react';
import { Paragraph } from '@ethos-frontend/ui';
import { GridContainer } from '@ethos-frontend/components';

interface ItemsDetail {
  span: number;
  label: string;
  description: string | React.ReactNode;
  tag?: ReactNode;
}

interface ItemsDetailProps {
  details: ItemsDetail[];
  columns?: number;
}

export const ItemsDetail = ({ details, columns = 12 }: ItemsDetailProps) => {
  return (
    <GridContainer columns={columns}>
      {details.map((item, index) => (
        <div
          className="grid gap-y-2 break-words self-start"
          key={index}
          data-item
          data-span={item.span}
        >
          <Paragraph variant="subtitle2" color={'secondary'}>
            {item.label}
            {item?.tag ? item?.tag : ''}
          </Paragraph>
          <Paragraph variant="subtitle1">
            {item.description !== null &&
            item.description !== undefined &&
            item.description !== ''
              ? item.description
              : 'N/A'}
          </Paragraph>
        </div>
      ))}
    </GridContainer>
  );
};
