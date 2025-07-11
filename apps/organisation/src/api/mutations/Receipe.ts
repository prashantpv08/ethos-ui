import { gql } from "@apollo/client";

export const ADD_RECEIPE = gql`
  mutation AddReceipe($data: AddRecipeInput!) {
    createRecipe(data: $data) {
      statusCode
      message
      data {
        _id
      }
    }
  }
`;

export const DELETE_RECEIPE = gql`
  mutation DeleteRecipe($data: ID!) {
    deleteRecipe(id: $data) {
      message
      statusCode
    }
  }`

export const UPDATE_RECEIPE = gql`
  mutation Mutation($params: UpdateRecipeInput!) {
    updateRecipe(params: $params) {
      data {
        _id
        productId
        ingredients {
          rawMaterialId
          qty
          waste {
            valueType
            value
          }
        }
      }
      message
      statusCode
    }
  }`