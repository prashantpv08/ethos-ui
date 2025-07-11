export interface routeTypes {
  name: string
  path: string
  id: number
  isPrivate?: boolean
  Component: React.FC<any>
  pageProp?: { page: string }
}

export type country = {
  code: string
  dial_code: string
  flag: string
  name: string
  _id: string
}

export type Department = {
  _id: string
  deptName: string
}
export interface CommonState {
  countryList: country[]
  departmentList: Department[]
  categories: any[]
  loading: boolean
}
export interface AuthState {
  status: boolean
  userData: null | any
  token: null | string
}

export interface ProductState {
  loading: boolean
  products: null | any
  error: boolean | string
}
