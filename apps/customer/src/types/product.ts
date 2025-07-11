export interface Detail {
  _id: string;
  name: string;
  code: string;
  category_type: string;
}

export interface Extra {
  _id: string;
  url: string[];
  name: string;
  type: string;
  code: string;
  price: number;
  status: string;
  isRequired: boolean;
}

export interface TaxesDetail {
  value: number;
  _id: string;
  code: string;
  description: string;
}

export interface IProductList {
  selectedComboProducts: {
    groupName?: string;
    name?: string;
    label?: string;
    price: number | undefined;
    productId?: string;
  }[];
  products: IComboProducts[];
  productKey: string;
  productType?: string;
  _id: number;
  imgUrl: string[];
  availability: string[];
  categoryDetail: Detail;
  name: string;
  comboPrice: number;
  type: string;
  calory: number;
  code: string;
  description: string;
  discount: number;
  price: number;
  finalPrice: number;
  characteristicsDetail: Detail[];
  taxesDetail: TaxesDetail[];
  extras: Extra[];
  quantity: number;
  selectedExtras?: ISelectedValues[];
  comboProducts?: {
    _id: string;
    name: string;
    price: string;
  }[];
  note?: string;
}

export interface ProductProps {
  id: string;
  product: {
    id: string;
    name: string;
    imageUrl: string;
    deliveryFee: string;
    rating: number;
    reviews: number;
    category: string;
    deliveryTime: string;
  };
}

export interface IExtras {
  groupName: string;
  isMultiple: boolean;
  isRequired: boolean;
  products: IProductList[];
  _id: string;
}

export interface IExtraProducts {
  name: string;
  price: number;
  _id: string;
}

export type ISelectedValues = {
  groupName: string;
  label: string;
  value: string;
  price?: number;
  _id?: string;
  productId?: string;
};

interface IOptions {
  detail: {
    _id: string;
    name: string;
    price: number;
  };
  name: string;
  price: number;
  productId: string;
}

export interface IComboProducts {
  title: string;
  type: string;
  productId: null;
  options: IOptions[];
}

export interface ICheckboxProducts {
  _id: string;
  name: string;
  price: number | undefined;
  options: IOptions[];
  title: string;
  productType: string;
}
