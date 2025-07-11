import { gql } from '@apollo/client';

export const GET_REFRESH_TOKEN = gql`
  query Account {
    refreshToken {
      statusCode
      message
      data {
        accessToken
      }
    }
  }
`;
