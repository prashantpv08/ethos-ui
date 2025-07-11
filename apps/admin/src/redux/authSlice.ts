import { createSlice } from '@reduxjs/toolkit'
import { resetAuthorizationToken, setAuthorizationToken } from '../api'
import { AuthState } from '../types'

const initialState: AuthState = {
  status: false,
  userData: null,
  token: null,
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const {
        payload: { userData, token },
      } = action
      state.status = true
      state.userData = userData
      state.token = token
      setAuthorizationToken(token)
      localStorage.setItem('token', token)
    },
    logout: (state) => {
      state.status = false
      state.userData = null
      state.token = null
      if (localStorage.getItem('vendor_email')) {
        localStorage.removeItem('token')
      } else {
        localStorage.clear()
      }
      localStorage.removeItem('token')
      localStorage.setItem('d', '1')
      resetAuthorizationToken()
    },
    updateStep: (state, action) => {
      if (state.userData == null) {
        state.userData = { formNextStep: action.payload.step }
      } else {
        state.userData['formNextStep'] = action.payload.step
      }
    },
    saveUserData: (state, action) => {
      // console.log(action)
      if (state.userData == null) {
        state.userData = { [action.payload.key]: action.payload.value }
      } else {
        state.userData[action.payload.key] = action.payload.value
      }
    },
  },
})

export const { login, logout, updateStep, saveUserData } = authSlice.actions

export default authSlice.reducer
