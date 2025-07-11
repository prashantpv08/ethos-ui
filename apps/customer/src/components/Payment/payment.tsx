import { useRouter } from 'next/router';
import { useCart } from '../../context/cart';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Extra, IProductList } from '../../types/product';
import { CREATE_ORDER } from '../../api/Mutation/createOrder';
import { Heading, Modal, PrimaryButton, Radio } from '@ethos-frontend/ui';
import CheckoutSession from '../Stripe/CheckoutSession';
import { useMutation as useGraphMutation } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { getStorage, setStorage } from '@ethos-frontend/utils';
import { useRestMutation } from '@ethos-frontend/hook';
import { API_METHODS, getPaymentOptions } from '@ethos-frontend/constants';
import { useTranslation } from 'react-i18next';
import { ORDER_TYPE } from '../../constant';

interface IAccumulatedValue {
  _id: string;
  products: { _id: string }[];
}

export const Payment = () => {
  const router = useRouter();
  const { cart } = useCart();
  const { t } = useTranslation();
  const paymentOptions = getPaymentOptions();
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [stripeAccountId, setStripeAccountId] = useState('');
  const [productList, setProductList] = useState<IProductList[]>([]);
  const [orgId, setOrgId] = useState<string>('');
  const [selectPaymentMethod, setSelectPaymentMethod] = useState('');
  const [orderType, setOrderType] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [email, setEmail] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<number>(0);
  const [sms, setSms] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [subTotal, setSubTotal] = useState<number>(0);
  const [tip, setTip] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [orderName, setOrderName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [currentSymbol, setCurrencySymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [roomNumber, setRoomNumber] = useState<number>(0);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    const paymentStatus = getStorage('order-payment');
    if (paymentStatus === 'success') {
      setOpen(false);
      window.location.href = `/${orgId}`;
    }
  }, []);

  useEffect(() => {
    const id = getStorage('orgId');
    if (id) setOrgId(id);

    setOrderType(getStorage('orderType') || '');
    setFinalPrice(Number(getStorage('TotalPrice')));
    setSubTotal(Number(getStorage('subTotal')));
    setTip(Number(getStorage('selectedTipValue')));
    setServiceCharge(Number(getStorage('serviceCharge')));
    setTableNumber(Number(getStorage('tableNumber')));
    setOrderName(getStorage('orderName') || '');
    setRoomNumber(Number(getStorage('roomNo')));
    const { restaurantName, currencyCode } = JSON.parse(
      getStorage('restaurantData') || '{}',
    );
    setRestaurantName(restaurantName);
    setCurrencySymbol(currencyCode);
    setEmail(getStorage('email') || '');
    setSms(getStorage('sms') || '');
    setWhatsappNumber(getStorage('whatsapp') || '');
    setTotalTax(Number(getStorage('totalTax')));

    const updatedProductList = cart.map((val) => {
      const selectedSingleComboProductList =
        val?.products
          ?.filter((val) => val.type === 'Single')
          .map((product) => ({
            _id: product.productId,
            type: 'Single',
          })) || [];

      const selectedMultipleComboProductList =
        val?.selectedComboProducts?.map((ele) => ({
          options: {
            _id: ele.productId,
            price: ele.price,
          },
          name: ele.name,
          type: 'Multiple',
        })) || [];

      const extraProducts = val?.selectedExtras?.reduce<IAccumulatedValue[]>(
        (acc, item) => {
          const { _id, productId } = item;

          if (_id && productId) {
            let existingEntry = acc.find((entry) => entry._id === _id);

            if (!existingEntry) {
              existingEntry = { _id, products: [] };
              acc.push(existingEntry);
            }

            existingEntry.products.push({
              _id: productId,
            });
          }
          return acc;
        },
        [],
      );

      const result = {
        ...val,
        qty: val.quantity,
        type: val.productType === 'combo' ? 'combo' : 'default',
      };

      if (
        selectedSingleComboProductList.length ||
        selectedMultipleComboProductList.length
      ) {
        result.comboProducts = [
          ...selectedSingleComboProductList,
          ...selectedMultipleComboProductList,
        ] as unknown as { _id: string; name: string; price: string }[];
      }

      result.extras = extraProducts as unknown as Extra[];

      return result;
    });

    setProductList(updatedProductList);
  }, [cart]);

  const [createOrder] = useGraphMutation(CREATE_ORDER);

  const createStripeSession = useRestMutation<any, any, any>(
    `${process.env.NEXT_PUBLIC_API_URL}admin/organisation/create-order-stripe-session`,
    {
      method: API_METHODS.POST,
    },
    {
      onSuccess: (data) => {
        setClientSecret(data.data.clientSecret);
        setStripeAccountId(data.data.accountId);
        setOpen(true);
        setLoading(false);
      },
      onError: (error) => {
        console.error(' Error creating Stripe session:', error);
        setLoading(false);
      },
    },
  );

  const submitOrder = useCallback(async () => {
    setLoading(true);
    const orderProductList = productList.map((val: IProductList) => ({
      _id: val._id,
      qty: val.quantity,
      extras: val.extras,
      comboProducts: val.comboProducts,
      type: val.type,
      note: val.note,
    }));

    const invoiceChoice = JSON.parse(
      getStorage('selectedOptions') || '[]',
    ).filter((choice: string) => choice !== 'not');

    const orderData = {
      type: orderType,
      payment:
        orderType === ORDER_TYPE.roomService ? 'room_charge' : selectPaymentMethod,
      total: finalPrice,
      ...(orderType === ORDER_TYPE.roomService
        ? { roomNo: roomNumber }
        : { tableNo: tableNumber }),
      phone: invoiceChoice?.includes('whatsapp') ? whatsappNumber : '',
      smsPhone: invoiceChoice?.includes('sms') ? sms : '',
      subTotal: subTotal,
      items: orderProductList,
      email: invoiceChoice?.includes('email') ? email : '',
      invoiceChoice: invoiceChoice,
      tip: tip,
      serviceTax: serviceCharge,
      name: orderName,
      totalTax: totalTax,
    };

    try {
      const { data } = await createOrder({ variables: { data: orderData } });
      const orderNo = data.createOrder.data.orderNo;
      setStorage('paymentMethod', selectPaymentMethod);
      if (selectPaymentMethod === 'online') {
        const orderGenerated = {
          customerEmail: email,
          organisationId: orgId,
          orderId: orderNo,
          products: productList,
          total: finalPrice,
          restaurantName: restaurantName,
          currency: currentSymbol,
        };
        createStripeSession.mutate(orderGenerated);
      } else {
        setStorage('orderNo', orderNo);
        router.push('/payment-confirmation');
      }
    } catch (error) {
      toast.error(t('customer.error.general'));
      console.error('Error submitting order:', error);
      setLoading(false);
    }
  }, [
    productList,
    orderType,
    selectPaymentMethod,
    finalPrice,
    tableNumber,
    email,
    sms,
    whatsappNumber,
    subTotal,
    tip,
    serviceCharge,
    orderName,
    restaurantName,
    currentSymbol,
    totalTax,
    orgId,
    createOrder,
    createStripeSession,
  ]);

  useEffect(() => {
    if (orderType === ORDER_TYPE.roomService && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      submitOrder();
    }
  }, [orderType, submitOrder]);

  if (orderType === ORDER_TYPE.roomService) {
    return <CircularProgress />;
  }

  return (
    <>
      <div className="radioGroup payment">
        <Heading variant="h5" weight="semibold" className="pb-4">
          {t('customer.choosePaymentMethod')}
        </Heading>
        <Radio
          variant="tile"
          align="horizontal"
          name="payment-method"
          options={paymentOptions}
          onChange={(e) => setSelectPaymentMethod(e.target.value)}
          value={selectPaymentMethod}
        />
      </div>
      <div className="sticky-footer-container">
        <PrimaryButton
          className="mt-auto"
          onClick={submitOrder}
          fullWidth
          disabled={!selectPaymentMethod || loading}
        >
          {loading ? (
            <CircularProgress color="inherit" size={20} />
          ) : selectPaymentMethod === 'offline' ? (
            t('customer.finish')
          ) : (
            t('customer.payNow')
          )}
        </PrimaryButton>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="overflow-y-auto" style={{ height: '80vh' }}>
          {clientSecret && stripeAccountId && (
            <CheckoutSession
              clientSecret={clientSecret}
              stripeAccountId={stripeAccountId}
            />
          )}
        </div>
      </Modal>
    </>
  );
};
