import { gql } from '@apollo/client';

export const UPDATE_ORDER = gql`
  mutation updateOrder($data: InputOrderUpdate) {
    updateOrder(params: $data) {
      message
      statusCode
      data {
        status
        _id
      }
    }
  }
`;

export const PAY_AT_COUNTER = gql`
  mutation PayAtCounter($params: InputPayAtCounter) {
    payAtCounter(params: $params) {
      statusCode
      message
      data {
        _id
        orderNo
        status
      }
    }
  }
`;
