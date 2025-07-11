import { toast } from 'react-toastify'
import { standardErrorMsg } from '../helpers/contants'

export const notify = (message: string | null, type: string) => {
  toast.dismiss()
  if (message === null) [(message = standardErrorMsg)]
  if (type === 'error') {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  } else if (type === 'success') {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }
}
