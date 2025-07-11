import React from 'react';
import { PageHead } from '..';

type PageTemplateProps = {
  children: React.ReactNode | React.ReactNode[];
  title: string;
  restaurantName?: string;
  description?: string;
  keywords?: string;
};

export const PageTemplate = ({
  children,
  title,
  description,
  keywords,
  restaurantName,
}: PageTemplateProps) => {
  return (
    <>
      <PageHead
        title={title}
        description={description}
        keywords={keywords}
        restaurantName={restaurantName}
      />
      {children}
    </>
  );
};
