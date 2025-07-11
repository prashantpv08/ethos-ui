export interface GroupName {
  groupName: string;
  isRequired: boolean;
  isMultiple: boolean;
  products: any;
}
export interface ExtraProducts {
  _id: string;
  name: string;
  code: string;
  type: string;
  price: number;
  status: string;
}
