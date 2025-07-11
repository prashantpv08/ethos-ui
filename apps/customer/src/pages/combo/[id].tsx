import React from 'react';
import { PageTemplate } from '../../components';
import { NextPage } from 'next';
import withCommonHeader from '../../hoc/withCommonHeader';
import { ComboProductDetail } from '../../components/ProductDetail/comboProductDetail';
import { getStorage } from '@ethos-frontend/utils';
import { useTranslation } from 'react-i18next';

const ComboProduct: NextPage = () => {
  const productName = getStorage('productName');
  const {t} = useTranslation();
  return (
    <PageTemplate
      title={t('customer.pageTitles.productDetail', { productName })}
      description="customer.pageDescriptions.productDetail"
    >
      <ComboProductDetail />
    </PageTemplate>
  );
};

const comboProduct = withCommonHeader(ComboProduct);

export default comboProduct;
