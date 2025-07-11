import { useRestQuery } from '@ethos-frontend/hook';
import {
  Heading,
  Iconbutton,
  Paragraph,
  PrimaryButton,
  Table,
} from '@ethos-frontend/ui';
import { FullscreenOutlined } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from './socket';
import { ORDER_STATUS } from '@ethos-frontend/constants';
import styles from './login.module.scss';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';

export const Status = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orderStatus, setOrderStatus] = useState(() => {
    const savedOrders = localStorage.getItem('orderStatus');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useRestQuery('fetch-order-status', 'customer/customerScreen', {
    onSuccess: (res) => {
      const data = res.data.map(
        (val: { orderNo: string; status: string; name: string }) => ({
          id: val.orderNo,
          orderNo: val.orderNo,
          status: val.status,
          name: val.name,
        })
      );
      setOrderStatus(data);
      localStorage.setItem('orderStatus', JSON.stringify(data));
    },
  });

  useEffect(() => {
    if (socket) {
      socket.on('message', (message: string) => {
        const updatedOrder = JSON.parse(message);
        console.log(updatedOrder, 'asdasdas');

        setOrderStatus((prevOrders: { orderNo: string }[]) => {
          // Check if the order exists in the previous state
          const orderExists = prevOrders.some(
            (order: { orderNo: string }) =>
              order.orderNo === updatedOrder.orderNo
          );

          let updatedOrders;

          if (orderExists) {
            // If the order exists, map through and update the status of that order
            updatedOrders = prevOrders.map((order) =>
              order.orderNo === updatedOrder.orderNo
                ? {
                    ...order,
                    status: updatedOrder.status,
                  }
                : order
            );
          } else {
            // If the order is new, add it to the list
            updatedOrders = [
              ...prevOrders,
              { ...updatedOrder, id: updatedOrder.orderNo },
            ];
          }

          // Store the updated orders in localStorage
          localStorage.setItem('orderStatus', JSON.stringify(updatedOrders));

          // Return the new updated state
          return updatedOrders;
        });
      });

      // Clean up the event listener on unmount
      return () => {
        socket.off('message');
      };
    }
  }, [socket]);

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        /* Firefox */
        (elem as any).mozRequestFullScreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        /* Chrome, Safari, Opera */
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        /* IE/Edge */
        (elem as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        field: 'orderNo',
        headerName: 'In Progress',
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const orderNo = params?.row.orderNo;
          const name = params?.row?.name;
          return (
            <Paragraph variant="h4">
              {name ? (
                <>
                  Order name - <strong>{name}</strong>
                </>
              ) : (
                <>
                  Order Number - <strong>{orderNo}</strong>
                </>
              )}
            </Paragraph>
          );
        },
      },
    ],
    []
  );

  const readyColumns = useMemo(
    () => [
      {
        field: 'orderNo',
        headerName: 'Ready',
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const orderNo = params?.row.orderNo;
          const name = params?.row?.name;
          return (
            <Paragraph variant="h4">
              {name ? (
                <>
                  Order name - <strong>{name}</strong>
                </>
              ) : (
                <>
                  Order Number - <strong>{orderNo}</strong>
                </>
              )}
            </Paragraph>
          );
        },
      },
    ],
    []
  );

  const inProgressOrders = orderStatus.filter(
    (order: { status: ORDER_STATUS }) => order.status === ORDER_STATUS.PROGRESS
  );
  const readyOrders = orderStatus.filter(
    (order: { status: ORDER_STATUS }) => order.status === ORDER_STATUS.READY
  );

  const logo = localStorage.getItem('logo');
  const name = localStorage.getItem('name');

  return (
    <div className={styles.status}>
      <div className="flex justify-center py-5 flex-col items-center">
        <img width={200} className='object-cover' src={logo ?? ''} alt="logo" />
        <Heading className='pt-5' variant='h4'>{name}</Heading>
      </div>
      {!isFullscreen ? (
        <div className="flex gap-4 pb-5">
          <div className="ml-auto">
            <PrimaryButton
              size="small"
              onClick={() => {
                localStorage.clear();
                navigate('/auth/login');
              }}
            >
              Logout
            </PrimaryButton>
          </div>
          <Iconbutton MuiIcon={FullscreenOutlined} onClick={handleFullscreen} />
        </div>
      ) : null}
      <div className="flex border-2">
        <div className="w-full border-r-2">
          <Table
            columns={columns}
            rows={inProgressOrders}
            disableColumnResize
            hideFooter
            pagination={false}
          />
        </div>

        <div className="w-full">
          <Table
            columns={readyColumns}
            rows={readyOrders}
            disableColumnResize
            hideFooter
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};
