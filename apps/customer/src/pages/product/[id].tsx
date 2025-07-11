import React from 'react';
import { PageTemplate, ProductDetail } from '../../components';
import { NextPage } from 'next';
import withCommonHeader from '../../hoc/withCommonHeader';
import { getStorage } from '@ethos-frontend/utils';
import { useTranslation } from 'react-i18next';

const Product: NextPage = () => {
  const productName = getStorage('productName');
  const { t } = useTranslation();

  return (
    <PageTemplate
      title={t('customer.pageTitles.productDetail', { productName })}
      description="customer.pageDescriptions.productDetail"
    >
      <div className="sticky-footer">
        <ProductDetail />
      </div>
    </PageTemplate>
  );
};

const product = withCommonHeader(Product);

export default product;
