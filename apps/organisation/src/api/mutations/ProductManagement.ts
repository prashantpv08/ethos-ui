import { gql } from '@apollo/client';

export const ADD_PRODUCT = gql`
  mutation Mutation($data: AddProductInput) {
    createProduct(data: $data) {
      data {
        _id
      }
      message
      statusCode
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation Mutation($data: UpdateProductInput) {
    updateProduct(params: $data) {
      data {
        _id
      }
      message
      statusCode
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation Mutation($deleteProductId: ID!) {
    deleteProduct(id: $deleteProductId) {
      message
      statusCode
    }
  }
`;

export const ADD_COMBO_PRODUCT = gql`
  mutation CreateCombo($data: ComboAddRequest) {
    createCombo(params: $data) {
      data {
        _id
        adminId
        imgUrl
        name
        code
        availability
        type
        description
        discount
        comboPrice
        finalPrice
        characteristicIds
        products {
          type
          productId
          title
          options {
            productId
            name
            price
          }
        }
        status
        characteristicsDetail {
          _id
          name
        }
      }
      statusCode
      message
    }
  }
`;

export const UPDATE_COMBO_PRODUCT = gql`mutation UpdateCombo($updateCombo: ComboUpdateRequest) {
  updateCombo(params: $updateCombo) {
    statusCode
    message
    data {
      _id
      adminId
      imgUrl
      name
      code
      availability
      type
      description
      discount
      comboPrice
      finalPrice
      characteristicIds
      products {
        type
        productId
        title
        options {
          productId
          name
          price
        }
      }
      status
      characteristicsDetail {
        _id
        name
      }
    }
  }
}`;

export const DELETE_COMBO_PRODUCT = gql`
  mutation deleteCombo($deleteComboId: ID!) {
    deleteCombo(id: $deleteComboId) {
      statusCode
      message
    }
  }
`;
