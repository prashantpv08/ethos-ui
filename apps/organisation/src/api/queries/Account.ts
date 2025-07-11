import { gql } from '@apollo/client';

export const GET_ACCOUNT_PREFERENCES = gql`
  query AccountPreference {
    account {
      data {
        adminId
        payment
        language
        order_type
        restaurantType
        default_language
        serviceFee {
          value
          valueType
        }
        taxMode
        tips
      }
      message
      statusCode
    }
  }
`;

export const GET_INTERFACE_LANGUAGE = gql`
  query AccountPreference {
    account {
      data {
        language
      }
      message
      statusCode
    }
  }
`;
