import { gql } from '@apollo/client';

export const GET_EMPLOYEE_LIST = gql`
  query Employees($params: ListEmployeeInput) {
    employees(params: $params) {
      statusCode
      message
      data {
        _id
        access {
          module
          pages
        }
        email
        firstName
        lastName
        role
        status
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;

export const GET_USER_DETAIL = gql`
  query userDetail($employeeId: ID) {
    employee(id: $employeeId) {
      statusCode
      message
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
    }
  }
`;

export const GET_USER_NAME = gql`
  query userDetail($employeeId: ID) {
    employee(id: $employeeId) {
      data {
        firstName
        lastName
      }
    }
  }
`;
