import { gql } from '@apollo/client';

export const CHARACTERSTICS_DETAILS = gql`
  query CustomerAccount {
    customerAccount {
      characteristics {
        _id
        name
      }
    }
  }
`;
