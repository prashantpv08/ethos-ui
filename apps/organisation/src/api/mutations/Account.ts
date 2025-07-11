import { gql } from "@apollo/client";

export const UPDATE_ACCOUNT  = gql`
mutation UpdateAccount($params: UpdateAccount) {
  updateAccount(params: $params) {
    statusCode
    message
    data {
      adminId
      language
      order_type
      restaurantType
      default_language
      taxMode
      serviceFee {
        value
        valueType
      }
      currency {
        code
        symbol
      }
      payment
      tips
    }
  }
}`;
  