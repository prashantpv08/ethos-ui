import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { GET_PRODUCT_DETAIL } from '@organisation/api/queries/ProductManagement';
import { t } from 'i18next';
import { CommonDetailView, ExtraGroup } from './commonDetailsView';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { ExtraProducts, GroupName } from './types';
import { CircularProgress } from '@mui/material';

export const ProductView = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery(GET_PRODUCT_DETAIL, {
    variables: { productId: id },
  });
  const product = data?.product.data;

  const { isMobile, isDesktop } = useResponsive();

  const characteristics = useMemo(
    () =>
      (product?.characteristicsDetail || [])
        .map((c: { name: any; code: any }) => c.name || c.code)
        .join(', '),
    [product],
  );

  const basicDetails = [
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('category.title'),
      description: product?.categoryDetail?.name,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.productCode'),
      description: product?.code,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.productType'),
      description: product?.type,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.totalCalories'),
      description: `${product?.calory} cal`,
    },

    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('characteristics.title'),
      description: characteristics || '—',
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('tax.title'),
      description: (product?.taxesDetail || [])
        .map(
          (tax: { code: string; value: string }) =>
            `${tax.code} (${tax.value}%)`,
        )
        .join(', '),
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.productPrice'),
      description: `$${product?.price.toFixed(2)}`,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.discount'),
      description: `${product?.discount}%`,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.finalPrice'),
      description: `$${product?.finalPrice.toFixed(2)}`,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.availableTimes'),
      description: (product?.availability || []).join(', '),
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 12 }),
      label: t('tableData.description'),
      description: product?.description,
    },
  ];

  const extras: ExtraGroup[] = useMemo(() => {
    return (product?.extras || []).map(
      (grp: GroupName) => ({
        groupName: grp.groupName,
        isRequired: grp.isRequired,
        isMultiple: grp.isMultiple,
        products: (grp.products || [])
          .map((pid: string) =>
            product?.extrasProducts.find(
              (ep: { _id: string }) => ep._id === pid,
            ),
          )
          .filter(Boolean)
          .map(
            (ep: ExtraProducts) => ({
              id: ep._id,
              name: ep.name || ep.code,
              type: ep.type,
              price: ep.price,
              status: ep.status,
            }),
          ),
      }),
    );
  }, [product]);

  if (loading) return <CircularProgress />;

  return (
    <CommonDetailView
      title={`Product · ${product.name}`}
      basicFields={basicDetails}
      imgUrls={product.imgUrl}
      extras={extras}
    />
  );
};
