import { createSlice } from '@reduxjs/toolkit'
import endPoints from '../api/endpoint'
import store from './store'
import { getApiCall, postApiCall } from '../api/methods'
import { notify } from '../Utils/toastify'
import { ProductState } from '../types'

const initialState: ProductState = {
  products: [],
  loading: false,
  error: false,
}
const productSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendorList: (state, action) => {
      const { payload }: any = action
      state.products = payload
    },
    setProductLoader: (state, action) => {
      const { payload }: any = action
      state.loading = payload
    },
    setProductError: (state, action) => {
      const { payload }: any = action
      state.error = payload
    },
  },
})

export const {
  setVendorList,
  setProductLoader,
  setProductError,
} = productSlice.actions

export default productSlice.reducer

export const getAndSetVendorList = (values: any) => {
  return (dispatch: any) => {
    const apiEndpoint = endPoints.vendorManagement.vendorManagementList

    store.dispatch(setProductLoader(true))
    postApiCall(
      apiEndpoint,
      values,
      (s: any) => {
        const {
          data: { statusCode },
        } = s

        console.log('RESSS', s)
        if (statusCode && statusCode === 200) {
          // dispatch(setVendorList())
          // navigate(ROUTES.PRODUCTS)
          // notify('Product created successfully', 'success')
        }

        store.dispatch(setProductLoader(false))
      },
      (e: any) => {
        //   setLoad(false)
        store.dispatch(setProductLoader(false))

        if (e?.data && e?.data.message) {
          notify(e?.data.message, 'error')
        } else {
          notify(null, 'error')
        }
      }
    )
  }
}

