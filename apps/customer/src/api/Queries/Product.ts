import { gql } from '@apollo/client';
import {
  PRODUCT_FIELDS,
  EXTRAS_PRODUCTS_FIELDS,
  CHARACTERSTICS_DETAILS_FEILDS,
  TAX_DETAILS_FIELDS,
  CHARACTERSTICS_COMBO_DETAILS_FEILDS,
  CATEGORY_FIELDS,
} from './ProductFragments';

export const GET_COMBO_PRODUCT_LIST = gql`
  query productList($params: CustomerProductInput) {
    customerProducts(params: $params) {
      data {
        name
      }
    }
  }
`;

export const GET_PRODUCT_LIST = gql`
  query productList($params: CustomerProductInput) {
    customerProducts(params: $params) {
      statusCode
      message
      data {
        ...ProductFields
        characteristicsDetail {
          _id
          code
          name
        }
        products {
          _id
          options {
            _id
            name
            price
            productId
          }
          productId
          title
          type
        }
      }
      totalItems
      totalPages
      currentPage
    }
  }
  ${PRODUCT_FIELDS}
`;

export const GET_CATEGORY = gql`
  query getCategories {
    categories {
      message
      data {
        _id
        name
        code
        order
        category_type
      }
    }
  }
`;

export const GET_PRODUCT_DETAIL = gql`
  query getProductDetails($id: ID!) {
    customerProductDetail(id: $id) {
      data {
        ...ProductFields
        characteristicsDetail {
          ...charatersticsDetailsField
        }
        taxesDetail {
          ...taxesDetailField
        }
        extrasProducts {
          ...ExtrasProductsFields
        }
      }
    }
  }
  ${PRODUCT_FIELDS}
  ${CHARACTERSTICS_DETAILS_FEILDS}
  ${TAX_DETAILS_FIELDS}
  ${EXTRAS_PRODUCTS_FIELDS}
`;

export const GET_COMBO_DETAIL = gql`
  query getComboDetail($id: ID!) {
    customerComboDetail(id: $id) {
      statusCode
      message
      data {
        characteristicsDetail {
          ...comboDetailsField
        }
        taxesDetail {
          ...taxesDetailField
        }
        _id
        categoryId
        imgUrl
        name
        code
        availability
        type
        calory
        description
        discount
        comboPrice
        finalPrice
        characteristicIds
        products {
          productId
          title
          options {
            productId
            name
            price
          }
          type
        }
        categoryDetail {
          ...CategoryFields
        }
        extras {
          _id
          groupName
          isRequired
          products
          isMultiple
        }
        extrasProducts {
          ...ExtrasProductsFields
        }
        productDetail {
          _id
          name
          imgUrl
          code
          type
          price
        }
      }
    }
  }
  ${CHARACTERSTICS_COMBO_DETAILS_FEILDS}
  ${TAX_DETAILS_FIELDS}
  ${EXTRAS_PRODUCTS_FIELDS}
  ${CATEGORY_FIELDS}
`;

export const GET_EXTRAS_PRODUCT = gql`
  query getExtraProducts($ids: [ID]) {
    extraProducts(ids: $ids) {
      data {
        name
        _id
      }
    }
  }
`;
