import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createEmployee($params: InputAddEmployee) {
    createEmployee(params: $params) {
      data {
        _id
        role
        email
        firstName
        lastName
        access {
          module
          pages
        }
        status
      }
      message
      statusCode
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateEmployee($params: InputUpdateEmployee) {
    updateEmployee(params: $params) {
      data {
        _id
        role
        email
        firstName
        lastName
        access {
          module
          pages
        }
        status
      }
      message
      statusCode
    }
  }
`;
