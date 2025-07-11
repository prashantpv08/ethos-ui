import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_COMBOS_DETAIL } from '@organisation/api/queries/ProductManagement';
import { useResponsive, getNumberOfCols } from '@ethos-frontend/utils';
import { t } from 'i18next';
import { CommonDetailView } from '../ProductView/commonDetailsView';
import { ExtraProducts, GroupName } from '../ProductView/types';
import { Heading, Table } from '@ethos-frontend/ui';
import { Card } from '@ethos-frontend/components';
import { CircularProgress } from '@mui/material';

const singleColumns = [
  { field: 'name', headerName: t('tableData.name'), flex: 1 },
  { field: 'code', headerName: t('tableData.code'), flex: 1 },
  { field: 'type', headerName: t('tableData.type'), flex: 1 },
  { field: 'price', headerName: t('tableData.price'), flex: 1 },
];

const multipleColumns = [
  { field: 'title', headerName: t('product.comboTitle'), flex: 1 },
  { field: 'optionName', headerName: t('tableData.items'), flex: 1 },
  { field: 'price', headerName: t('tableData.price'), flex: 1 },
];

export const CombosView = () => {
  const { id } = useParams<{ id: string }>();
  const { isMobile, isDesktop } = useResponsive();
  const { data, loading } = useQuery(GET_COMBOS_DETAIL, {
    variables: { comboId: id },
    fetchPolicy: 'cache-and-network',
  });
  const combo = data?.combo.data;

  const characteristics = useMemo(
    () =>
      (combo?.characteristicsDetail || [])
        .map((c: { name: any; code: any }) => c.name || c.code)
        .join(', '),
    [combo],
  );
  const basicDetails = [
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.productName'),
      description: combo?.name,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.productCode'),
      description: combo?.code,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.totalCalories'),
      description: `${combo?.calory} cal`,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('characteristics.title'),
      description: characteristics || '—',
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.comboPrice'),
      description: `$${combo?.comboPrice.toFixed(2)}`,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.discount'),
      description: `${combo?.discount}%`,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.finalPrice'),
      description: `$${combo?.finalPrice.toFixed(2)}`,
    },

    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
      label: t('product.availableTimes'),
      description: (combo?.availability || []).join(', '),
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 12 }),
      label: t('tableData.description'),
      description: combo?.description,
    },
  ];

  const extras = useMemo(
    () =>
      (combo?.extras || []).map((g: GroupName) => ({
        groupName: g.groupName,
        isRequired: g.isRequired,
        isMultiple: g.isMultiple,
        products: (g.products || [])
          .map((pid: string) =>
            combo?.extrasProducts.find((ep: { _id: string }) => ep._id === pid),
          )
          .filter(Boolean)
          .map((ep: ExtraProducts) => ({
            id: ep!._id,
            name: ep!.name || ep!.code,
            type: ep!.type,
            price: ep!.price,
            status: ep!.status,
          })),
      })),
    [combo],
  );

  const singleRows = useMemo(() => {
    if (!combo) return [];
    return combo.products
      .filter((p: any) => p.type === 'Single')
      .map((p: any, idx: number) => {
        const detail = combo.productDetail.find(
          (pd: any) => pd._id === p.productId,
        );
        return {
          id: idx,
          name: detail?.name ?? t('combo.unknown'),
          code: detail?.code ?? '',
          type: p.type,
          price: detail ? `$${detail.price.toFixed(2)}` : '–',
        };
      });
  }, [combo]);

  const multipleRows = useMemo(() => {
    if (!combo) return [];
    return combo.products
      .filter((p: any) => p.type === 'Multiple')
      .flatMap((p: any, idx: number) =>
        p.options.map((opt: any, i: number) => ({
          id: `${idx}-${i}`,
          title: p.title || t('combo.noTitle'),
          optionName: opt.name,
          price: `$${opt.price.toFixed(2)}`,
        })),
      );
  }, [combo]);

  if (loading) return <CircularProgress />;

  return (
    <>
      <CommonDetailView
        title={`Product · ${combo.name}`}
        basicFields={basicDetails}
        imgUrls={combo.imgUrl}
        extras={extras}
      />
      <div className="pt-8">
        <Heading variant="h5" weight="bold" className="mt-8">
          {t('product.comboPack')}
        </Heading>
        {singleRows.length ? (
          <Card className="mt-4">
            <Table columns={singleColumns} rows={singleRows} hideFooter />
          </Card>
        ) : null}
        {multipleRows.length ? (
          <Card className="mt-4">
            <Table columns={multipleColumns} rows={multipleRows} hideFooter />
          </Card>
        ) : null}
      </div>
    </>
  );
};
