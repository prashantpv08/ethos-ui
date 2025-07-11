import { gql } from '@apollo/client';

export const GET_PRODUCT_LIST = gql`
  query getProductList($params: List) {
    products(params: $params) {
      statusCode
      message
      data {
        _id
        imgUrl
        availability

        categoryDetail {
          _id
          name
          code
        }
        name
        type
        calory
        code
        description
        discount
        price
        finalPrice
        status
        characteristicsDetail {
          _id
          name
          code
        }
        taxesDetail {
          code
          description
          element
          value
          _id
        }
        extras {
          groupName
          isRequired
          products
          isMultiple
        }
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;

export const GET_PRODUCT_DETAIL = gql`
  query getProductDetails($productId: ID!) {
    product(id: $productId) {
      statusCode
      message
      data {
        _id
        imgUrl
        availability
        categoryDetail {
          _id
          name
          code
        }
        name
        type
        calory
        code
        description
        discount
        price
        finalPrice
        characteristicsDetail {
          _id
          name
          code
        }
        taxesDetail {
          code
          description
          element
          value
          _id
        }
        extras {
          groupName
          isRequired
          products
          isMultiple
        }
        extrasProducts {
          _id
          url
          name
          type
          code
          price
          status
        }
      }
    }
  }
`;

export const GET_COMBOS_LIST = gql`
  query getCombosList($params: List) {
    combos(params: $params) {
      statusCode
      message
      totalItems
      totalPages
      currentPage
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
        categoryDetail {
          _id
          name
          code
        }
      }
    }
  }
`;

export const GET_COMBOS_DETAIL = gql`
  query getComboDetail($comboId: ID!) {
    combo(id: $comboId) {
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
        calory
        productDetail {
          _id
          name
          imgUrl
          code
          type
          price
        }
        categoryDetail {
          _id
          name
          code
        }
        status
        characteristicsDetail {
          _id
          name
          code
        }
        taxesDetail {
          _id
          code
          description
          element
          value
        }
        extras {
          _id
          groupName
          isRequired
          products
          isMultiple
        }
        extrasProducts {
          _id
          url
          name
          type
          code
          price
          status
        }
      }
    }
  }
`;

export const GET_ALL_PRODUCT_LIST = gql`
  query Dropdown {
    dropdown {
      statusCode
      message
      data {
        _id
        name
      }
    }
  }
`;
