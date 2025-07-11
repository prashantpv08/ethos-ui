import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: InputAddOrder) {
    createOrder(data: $data) {
      statusCode
      data {
        _id
        orderNo
      }
    }
  }
`;
