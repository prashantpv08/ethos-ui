import { gql } from '@apollo/client';
import { ORDER_DETAILS_FRAGMENT } from '../fragments/order';

export const GET_ORDERS_LIST = gql`
  query getOrdersList($params: OrderList) {
    orders(params: $params) {
      statusCode
      message
      data {
        ...OrderDetails
      }
      totalItems
      totalPages
      currentPage
    }
  }
  ${ORDER_DETAILS_FRAGMENT}
`;

export const GET_ORDERS_DETAILS = gql`
  query getOrderDetails($orderId: ID!) {
    order(id: $orderId) {
      statusCode
      message
      data {
        ...OrderDetails
        smsPhone
        invoiceChoice
        tip
        statusHistory {
          date
          status
        }
        totalTax
      }
    }
  }
  ${ORDER_DETAILS_FRAGMENT}
`;
