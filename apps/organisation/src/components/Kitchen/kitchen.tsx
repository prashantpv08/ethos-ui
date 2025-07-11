import { GET_ORDERS_LIST } from '@organisation/api/queries/Orders';
import React, { useEffect, useMemo, useState } from 'react';
import { useSocket } from '../../context/socket';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ORDER_STATUS } from '@ethos-frontend/constants';
import { Tabs } from '@ethos-frontend/ui';
import { Link, useLocation } from 'react-router-dom';
import { IOrder } from '../Managements';
import { Pagination, styled } from '@mui/material';
import { KitchenCard, KitchenCardSkeleton } from './card';
import { UPDATE_ORDER } from '@organisation/api/mutations/Order';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPagination-ul': {
    '& li > button': {
      ...theme.typography.subtitle2,
    },
  },
}));

export const Kitchen = () => {
  const { socket } = useSocket();
  const { t } = useTranslation();
  const { pathname: tabValue } = useLocation();
  const [orderList, setOrderList] = useState<IOrder[]>([]);
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const status = useMemo(
    () =>
      tabValue === '/kitchen-order/received'
        ? {
            orderStatus: ORDER_STATUS.RECEIVED,
            buttonText: t('received'),
          }
        : tabValue === '/kitchen-order/progress'
          ? {
              orderStatus: ORDER_STATUS.PROGRESS,
              buttonText: t('progress'),
            }
          : tabValue === '/kitchen-order/ready'
            ? {
                orderStatus: ORDER_STATUS.READY,
                buttonText: t('ready'),
              }
            : null,
    [tabValue],
  );

  const [fetchOrderList, { loading }] = useLazyQuery(GET_ORDERS_LIST, {
    fetchPolicy: 'no-cache',
  });

  const [updateOrder] = useMutation(UPDATE_ORDER);

  const transformData = (order: any): IOrder => ({
    id: order._id,
    orderNo: order.orderNo,
    name: order.name,
    type: order.type,
    status: order.status,
    total: order.total,
    tableNo: order.tableNo,
    productItems: order?.items,
    invoiceUrl: order.invoiceUrl,
    paymentType: order.paymentType,
    roomNo: order.roomNo ?? 0,
  });

  useEffect(() => {
    fetchOrderList({
      variables: {
        params: {
          status: [status?.orderStatus],
          limit: page.limit,
          pageNo: page.pageNo,
        },
      },
    }).then((res) => {
      setTotalItems(res.data.orders.totalItems);
      setOrderList(res.data.orders.data.map(transformData));
    });
  }, [status, page.limit, page.pageNo, refreshOrders]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message: string) => {
        const newOrder = JSON.parse(message);

        if (
          newOrder.status === ORDER_STATUS.RECEIVED &&
          tabValue === '/kitchen-order/received'
        ) {
          const transformedOrder = transformData(newOrder);

          setOrderList((prevOrderList) => [transformedOrder, ...prevOrderList]);
        }
      });

      return () => {
        socket.off('message');
      };
    }
  }, [socket]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setPage({ limit: 10, pageNo: 1 });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage({ ...page, pageNo: newPage });
  };

  const handleUpdateOrder = (order: IOrder) => {
    let newStatus;
    switch (order.status) {
      case ORDER_STATUS.RECEIVED:
        newStatus = ORDER_STATUS.PROGRESS;
        break;
      case ORDER_STATUS.PROGRESS:
        newStatus = ORDER_STATUS.READY;
        break;
      case ORDER_STATUS.READY:
        newStatus = ORDER_STATUS.COMPLETED;
        break;
    }

    if (newStatus) {
      updateOrder({
        variables: { data: { id: order.id, status: newStatus } },
        refetchQueries: [GET_ORDERS_LIST],
      }).then((res) => {
        const status = res.data.updateOrder.data.status;
        let statusText;
        switch (status) {
          case ORDER_STATUS.PROGRESS:
            statusText = 'in progress';
            break;
          case ORDER_STATUS.READY:
            statusText = 'ready';
            break;
          case ORDER_STATUS.COMPLETED:
            statusText = 'completed';
            break;
        }

        toast.success(
          `${order.name || order.orderNo} has been moved for ${statusText}`,
        );
        setRefreshOrders((prev) => !prev);
      });
    }
  };

  const tabs = [
    {
      label: t('received'),
      value: '/kitchen-order/received',
      component: Link,
      to: '/kitchen-order/received',
      panelContent: loading ? (
        <KitchenCardSkeleton />
      ) : (
        <KitchenCard
          orderList={orderList}
          status={status}
          handleUpdateOrder={handleUpdateOrder}
        />
      ),
    },
    {
      label: t('progress'),
      value: '/kitchen-order/progress',
      component: Link,
      to: '/kitchen-order/progress',
      panelContent: loading ? (
        <KitchenCardSkeleton />
      ) : (
        <KitchenCard
          orderList={orderList}
          status={status}
          handleUpdateOrder={handleUpdateOrder}
        />
      ),
    },
  ];

  return (
    <>
      <Tabs
        key={tabValue}
        value={tabValue}
        onChange={handleChange}
        tabs={tabs}
      />
      {!loading ? (
        <div className="pt-5 flex justify-end">
          <StyledPagination
            count={Math.ceil(totalItems / page.limit)}
            page={page.pageNo}
            onChange={handlePageChange}
            color="primary"
            size="small"
            shape="rounded"
            variant="outlined"
          />
        </div>
      ) : null}
    </>
  );
};
