import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { ItemsDetail } from '../../Common';
import {
  Chip,
  Heading,
  Iconbutton,
  Paragraph,
  PrimaryButton,
  Table,
} from '@ethos-frontend/ui';
import { Card } from '@ethos-frontend/components';
import dayjs from 'dayjs';
import styles from './order.module.scss';
import { IOrderDetails } from './payCounter';
import {
  MailOutline,
  ReceiptOutlined,
  Sms,
  WhatsApp,
} from '@mui/icons-material';
import { Fragment, useMemo } from 'react';
import { useUser } from '../../../../src/context/user';
import { useTranslation } from 'react-i18next';

interface IOrderDetailsTable {
  orderDetailsData: IOrderDetails;
  orderItems: {
    id: number;
    name: string;
    qty: number;
    discount: number;
    finalPrice: number;
  }[];
  setShowModal?: (val: boolean) => void;
  showButton?: boolean;
}

export const OrderDetailsTable = ({
  orderDetailsData,
  orderItems,
  setShowModal,
  showButton,
}: IOrderDetailsTable) => {
  const { t } = useTranslation();
  const columns = useMemo(
    () => [
      {
        headerName: t('tableData.name'),
        field: 'name',
        flex: 1,
      },
      {
        headerName: t('tableData.quantity'),
        field: 'qty',
        flex: 1,
      },
      {
        headerName: t('tableData.discount'),
        field: 'discount',
        flex: 1,
      },
      {
        headerName: t('tableData.additionalNote'),
        field: 'note',
        flex: 1,
      },
      {
        headerName: t('tableData.price'),
        field: 'price',
        flex: 1,
      },
    ],
    [],
  );

  const { isMobile, isDesktop } = useResponsive();
  const { userData } = useUser();
  const paidOrNotText =
    (orderDetailsData?.payment === 'offline' &&
      orderDetailsData?.paymentType) ||
    orderDetailsData?.payment === 'online';

  const orderDetails = useMemo(
    () => [
      {
        span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
        label: t('order.orderNumber'),
        description: orderDetailsData?.orderNo,
        tag: (
          <Chip
            sx={{ ml: 1 }}
            size="small"
            label={paidOrNotText ? t('paid') : t('notPaid')}
            color={paidOrNotText ? 'success' : 'warning'}
          />
        ),
      },
      {
        span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
        label: t('order.orderedAt'),
        description: dayjs(parseFloat(orderDetailsData?.createdAt)).format(
          'MM-DD-YYYY h:mm A',
        ),
      },
      ...(userData?.businessType === 'Hotels'
        ? [
            {
              span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
              label: t('order.roomNumber'),
              description: orderDetailsData?.roomNo,
            },
          ]
        : [
            {
              span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
              label: t('order.tableNumber'),
              description: orderDetailsData?.tableNo,
            },
          ]),

      {
        span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
        label: t('order.orderName'),
        description: orderDetailsData?.name,
      },
      {
        span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
        label: t('order.payment'),
        description: orderDetailsData?.payment,
      },
      {
        span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
        label: t('order.type'),
        description: orderDetailsData?.type,
      },
      {
        span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
        label: t('order.whatsapp'),
        description: orderDetailsData?.phone,
      },
      {
        span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
        label: t('order.sms'),
        description: orderDetailsData?.smsPhone,
      },
      {
        span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
        label: t('order.invoiceChoice'),
        description: (
          <div>
            {orderDetailsData?.invoiceChoice &&
            orderDetailsData.invoiceChoice.length > 0
              ? orderDetailsData.invoiceChoice.map((val, index) => (
                  <Fragment key={index}>
                    {val === 'email' && (
                      <MailOutline fontSize="small" color="primary" />
                    )}
                    {val === 'whatsapp' && (
                      <WhatsApp fontSize="small" color="primary" />
                    )}
                    {val === 'sms' && <Sms fontSize="small" color="primary" />}
                    {index < orderDetailsData.invoiceChoice.length - 1 && ' | '}
                  </Fragment>
                ))
              : 'N/A'}
          </div>
        ),
      },
      {
        span: getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 }),
        label: t('order.invoice'),
        description: orderDetailsData?.invoiceUrl ? (
          <Iconbutton
            MuiIcon={ReceiptOutlined}
            onClick={() => window.open(orderDetailsData.invoiceUrl, '_blank')}
            size="small"
          />
        ) : (
          t('na')
        ),
      },
    ],
    [orderDetailsData],
  );

  return (
    <Card>
      <ItemsDetail details={orderDetails} />
      <Table
        rows={orderItems}
        pagination={false}
        disableColumnResize
        columns={columns}
        hideFooter
        className="pt-5"
        getDetailPanelContent={({ row }) => {
          if (
            (!row.extras || row.extras.length === 0) &&
            (!row.comboProducts || row.comboProducts.length === 0)
          ) {
            return null;
          }

          const selectedExtras =
            row.extras?.length > 0
              ? row.extras
                  .map((val: { products: { name: string; price: string }[] }) =>
                    val?.products
                      .map(
                        (product) =>
                          `${product.name}${
                            product.price ? `(${product.price})` : ''
                          }`,
                      )
                      .join(' | '),
                  )
                  .join(' | ')
              : null;

          const selectedComboProduct =
            row.comboProducts?.length > 0
              ? row.comboProducts
                  .flatMap(
                    (val: {
                      name: string | null;
                      price: number | null;
                      options: { name: string; price: number }[];
                    }) => {
                      const rootProduct = val?.name ? `${val.name}` : null;

                      const optionsProducts = val?.options?.map(
                        (product) =>
                          `${product.name}${
                            product.price ? `(${product.price})` : ''
                          }`,
                      );

                      return [rootProduct, ...optionsProducts].filter(Boolean);
                    },
                  )
                  .join(' | ')
              : null;

          return (
            <div className="p-6">
              {selectedExtras && (
                <div className={styles.selectedProductDetails}>
                  <Heading
                    variant="subtitle1"
                    weight="semibold"
                    className="pb-2"
                  >
                    {t('order.selectedExtras')}
                  </Heading>
                  <Paragraph variant="subtitle2">{selectedExtras}</Paragraph>
                </div>
              )}
              {selectedComboProduct && (
                <div>
                  <Heading
                    variant="subtitle1"
                    weight="semibold"
                    className="pb-2"
                  >
                    {t('order.selectedCombo')}
                  </Heading>
                  <Paragraph variant="subtitle2">
                    {selectedComboProduct}
                  </Paragraph>
                </div>
              )}
            </div>
          );
        }}
        getDetailPanelHeight={() => 'auto'}
      />
      {showButton ? (
        <div className={styles.rightAlign}>
          <PrimaryButton
            className="!mt-5"
            onClick={() => {
              setShowModal?.(true);
            }}
          >
            + {t('order.addDiscount')}
          </PrimaryButton>
        </div>
      ) : null}
    </Card>
  );
};
