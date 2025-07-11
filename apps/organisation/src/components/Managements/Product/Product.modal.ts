interface Detail {
  _id: string;
  name: string;
  code: string;
}

interface TaxesDetail {
  code: string;
  description: string;
  element: string[];
}

interface ProductsDetails {
  imgUrl: string[];
  categoryId: string;
  name: string;
  type: string;
  calory: number;
  code: string;
  description: string;
  discount: number;
  price: number;
  finalPrice: number;
  characteristicIds: string[];
  taxCode: string;
}
export interface Extras {
  name?: string;
  code?: string;
  price?: string;
  type?: string;
  url?: string[];
  groupName: string;
  isRequired: boolean;
  productsDetails: ProductsDetails;
}

export interface ProductModalProps {
  _id: string;
  imgUrl: string[];
  availability: string[];
  categoryDetail: Detail;
  name: string;
  type: string;
  calory: number;
  code: string;
  description: string;
  discount: number;
  price: number;
  finalPrice: number;
  characteristicsDetail: Detail;
  extras: Extras[];
  taxesDetail: TaxesDetail;
  comboPrice?: string;
  status: string;
}
