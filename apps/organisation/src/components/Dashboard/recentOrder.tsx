import { useEffect, useMemo, useState } from 'react';
import { Card } from '@ethos-frontend/components';
import { Paragraph, PrimaryButton, Table } from '@ethos-frontend/ui';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-premium';
import { useNavigate } from 'react-router-dom';
import { IOrder } from '../Managements';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../context/user';
import { priceWithSymbolAdmin } from '@ethos-frontend/utils';

interface IRecentOrderProps {
  data: IOrder[];
  highlightedRowId: string | null;
}

export const RecentOrder = ({ data, highlightedRowId }: IRecentOrderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userData } = useUser();
  const [recentOrderData, setRecentOrderData] = useState<IOrder[]>([]);
  const isHotel = userData?.businessType === 'Hotels';

  const columms = useMemo(
    () => [
      {
        field: 'orderNo',
        headerName: t('tableData.orderId'),
        flex: 1,
        minWidth: 100,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const order = params.row.id;
          return (
            <PrimaryButton
              variant="text"
              size="small"
              onClick={() => navigate?.(`/orders/${order}`)}
            >
              {params.row.orderNo}
            </PrimaryButton>
          );
        },
      },
      ...(isHotel
        ? [
            {
              field: 'roomNo',
              headerName: 'Room No.',
              flex: 1,
              minWidth: 100,
            },
          ]
        : [
            {
              field: 'tableNo',
              headerName: t('tableData.tableNumber'),
              flex: 1,
              minWidth: 80,
            },
          ]),
      {
        headerName: t('tableData.orderName'),
        field: 'name',
        flex: 1,
        minWidth: 150,
        sortable: false,
      },
      {
        headerName: t('tableData.type'),
        field: 'type',
        flex: 1,
        minWidth: 100,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Paragraph variant="h5">
              {params.row.type === 'Takeaway' ? t('takeAway') : t('dineIn')}
            </Paragraph>
          );
        },
      },
      {
        headerName: t('tableData.items'),
        field: 'items',
        flex: 1,
        minWidth: 100,
        sortable: false,
      },
      {
        headerName: t('tableData.price'),
        field: 'total',
        flex: 1,
        minWidth: 80,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
          <Paragraph variant="h5">
            {priceWithSymbolAdmin(params.row.total, userData?.currency)}
          </Paragraph>
        ),
      },
    ],
    [data, isHotel],
  );

  useEffect(() => {
    if (data) {
      const recentOrder = data.map((order) => ({
        id: order?._id || '',
        orderNo: order?.orderNo,
        name: order?.name,
        payment: order?.payment,
        type: order?.type,
        total: order?.total,
        roomNo: order?.roomNo,
        tableNo: order?.tableNo,
        items: order?.items?.length as unknown as string,
        invoiceUrl: order?.invoiceUrl,
      }));

      setRecentOrderData(recentOrder);
    }
  }, [data]);

  return (
    <div>
      <Card
        title={t('recentReceivedOrders')}
        button={
          <PrimaryButton
            variant="text"
            color="secondary"
            onClick={() => navigate('/orders/received')}
          >
            {t('viewAll')}
          </PrimaryButton>
        }
      >
        <Table
          rows={recentOrderData}
          columns={columms as GridColDef[]}
          pagination={false}
          hideFooter
          getRowClassName={(params) =>
            params.row.id === highlightedRowId ? 'highlightedRow' : ''
          }
        />
      </Card>
    </div>
  );
};
