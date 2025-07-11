import { gql } from '@apollo/client';

export const GET_RECEIPE = gql`
  query Recipies($params: List) {
    recipies(params: $params) {
      statusCode
      message
      data {
        _id
        productId
        ingredients {
          rawMaterialId
          qty
          waste {
            valueType
            value
            uomId
            uom
          }
        }
        product {
          _id
          name
        }
        rawMaterial {
          _id
          name
          code
          cost
          description
        }
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;

export const GET_RECEIPE_BY_ID = gql`
  query Recipe($recipeId: ID!) {
    recipe(id: $recipeId) {
      statusCode
      message
      data {
        _id
        productId
        ingredients {
          rawMaterialId
          qty
          waste {
            valueType
            value
            uomId
            uom
          }
        }
        product {
          _id
          name
        }
        rawMaterial {
          _id
          name
          code
          cost
          description
        }
      }
    }
  }
`;
