import { gql } from '@apollo/client';

export const UPDATE_INVENTORY = gql`
  mutation updateInventory($data: UpdateInventory) {
    updateInventory(params: $data) {
      statusCode
      message
      data {
        _id
      }
    }
  }
`;
