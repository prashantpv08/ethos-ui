import { createSlice } from '@reduxjs/toolkit'
import endPoints from '../api/endpoint'
import store from './store'
import { getApiCall } from '../api/methods'
import { notify } from '../Utils/toastify'
import { CommonState } from '../types'

const initialState: CommonState = {
  countryList: [],
  departmentList: [],
  categories: [],
  loading: false,
}
const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setData: (state, action) => {
      const {
        payload: { type, value },
      }: any = action
      if (type === 'country') {
        state.countryList = value
      } else if (type === 'department') {
        state.departmentList = value
      } else if (type === 'categories') {
        state.categories = value
      }
    },
    setCommonDataLoader: (state, action) => {
      const { payload }: any = action
      state.loading = payload
    },
  },
})

export const { setData, setCommonDataLoader } = commonSlice.actions

export default commonSlice.reducer

export const getAndSetData = (type: string, query: string = '') => {
  const apiEndpoint =
    type === 'country'
      ? endPoints.common.countryList
      : type === 'department'
      ? endPoints.common.deparmentList
      : endPoints.common.categories

  store.dispatch(setCommonDataLoader(true))
  getApiCall(
    `${apiEndpoint}${query}`,
    (s: any) => {
      const { data: data } = s
      if (data.data) {
        store.dispatch(setData({ type: type, value: data.data }))
      }
      store.dispatch(setCommonDataLoader(false))
    },
    (e: any) => {
      console.log(e)
      store.dispatch(setCommonDataLoader(false))
      notify(`Error while fetching ${type} list`, 'error')
    },
    type === 'country'
      ? { Authorization: `Basic ${btoa('reel:reel@123')}` }
      : {}
  )
}
