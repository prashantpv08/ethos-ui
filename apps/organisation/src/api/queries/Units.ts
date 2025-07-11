import { gql } from '@apollo/client';

export const GET_UNITS_LIST = gql`
  query getUnitsList($params: List) {
    uoms(params: $params) {
      statusCode
      message
      data {
        _id
        adminId
        code
        description
        status
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;

export const GET_ALL_UNITS__LIST = gql`
  query UomsListNames {
    uomsListNames {
      statusCode
      message
      data {
        _id
        code
        description
      }
    }
  }
`;
