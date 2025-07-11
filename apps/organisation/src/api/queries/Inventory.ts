import { gql } from '@apollo/client';

export const GET_INVENTORY_LIST = gql`
  query getInventoryList($params: List) {
    inventories(params: $params) {
      statusCode
      message
      data {
        _id
        rawId
        rawName
        code
        qty
        transactionCodeId
        description
        uom
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;

export const GET_LOGS = gql`
  query getLogs(
    $limit: Int
    $pageNo: Int
    $searchKey: String
    $rawId: [String]
    $startDate: String
    $endDate: String
  ) {
    transactionLogs(
      params: {
        limit: $limit
        pageNo: $pageNo
        searchKey: $searchKey
        rawId: $rawId
        startDate: $startDate
        endDate: $endDate
      }
    ) {
      data {
        _id
        adminId
        userId
        userName
        code
        transactionCode
        name
        startQty
        qty
        endQty
        transactionCodeId
        createdAt
        description
        orderNo
      }
      totalItems
    }
  }
`;

export const EXPORT_TRANSACTION_LOGS = gql`
  query exportTransactionLog(
    $endDate: String
    $rawId: [String]
    $searchKey: String
    $startDate: String
  ) {
    export(
      params: {
        endDate: $endDate
        rawId: $rawId
        searchKey: $searchKey
        startDate: $startDate
      }
    ) {
      message
      statusCode
      data
    }
  }
`;
