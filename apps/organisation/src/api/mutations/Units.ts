import { gql } from "@apollo/client";

export const ADD_UNTIS = gql`
  mutation addUnits($data: AddUom) {
    createUom(params: $data) {
      statusCode
      message
      data {
        _id
      }
    }
  }
`;

export const UPDATE_UNITS = gql`
  mutation updateUnits($data: UpdateUom) {
    updateUom(params: $data) {
      statusCode
      message
      data {
        _id
      }
    }
  }
`;

export const DELETE_UNITS = gql`
  mutation deleteUnits($id: ID) {
    deleteUom(id: $id) {
      statusCode
      message
    }
  }
`;
