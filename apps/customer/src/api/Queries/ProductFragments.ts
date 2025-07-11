import { gql } from '@apollo/client';

export const CHARACTERSTICS_DETAILS_FEILDS = gql`
  fragment charatersticsDetailsField on CharacteristicDetail {
    _id
    name
    code
  }
`;

export const CHARACTERSTICS_COMBO_DETAILS_FEILDS = gql`
  fragment comboDetailsField on ComboCharacteristic {
    _id
    imgUrl
    name
  }
`;

export const TAX_DETAILS_FIELDS = gql`
  fragment taxesDetailField on TaxDetail {
    _id
    code
    element
    value
  }
`;

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on CategoryDetail {
    _id
    name
    code
    category_type
  }
`;

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    _id
    imgUrl
    availability
    categoryDetail {
      ...CategoryFields
    }
    extras {
      groupName
      isMultiple
      isRequired
      products
      _id
    }
    comboPrice
    name
    type
    calory
    code
    description
    discount
    price
    finalPrice
    taxesDetail {
      _id
      code
      element
      value
      description
    }
  }
  ${CATEGORY_FIELDS}
`;

export const EXTRAS_PRODUCTS_FIELDS = gql`
  fragment ExtrasProductsFields on ExtraProduct {
    _id
    url
    name
    type
    code
    price
    status
  }
`;
