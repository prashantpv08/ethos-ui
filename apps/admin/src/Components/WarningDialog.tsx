import { Dialog, IconButton } from '@mui/material'
import React from 'react'
import CustomButton from './CustomButton'
import Images from '../Utils/images'
interface Props {
  // open?: boolean
  open: boolean
  handleClose: () => void
  title?: string
  description?: string
  type: 'success' | 'warning' | 'delete'
  onClick: (e?: any) => void
  cancelBtnText: string
  confirmBtnText: string
}

export default function WarningDialog(props: Props) {
  const {
    title,
    description,
    type,
    open,
    cancelBtnText,
    confirmBtnText,
    handleClose,
    onClick,
  } = props

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className="dialogWrapper warning">
        <div className="dialogHeader">
          <img
            src={
              type === 'success'
                ? Images.SUCCESS_IC
                : type === 'warning'
                ? Images.WARNING
                : type === 'delete'
                ? Images.ERROR_IC
                : Images.WARNING
            }
            alt=""
          />
          <h4 className="small">{title}</h4>

          {/* <IconButton onClick={handleClose}>
              <img src={Images.CLOSE} alt="Close" />
            </IconButton> */}
        </div>
        <div className="doalogBody small">
          <p className="small">{description}</p>
        </div>
        <div className="dialogActions">
          <CustomButton
            size="large"
            variant="outlined"
            text={cancelBtnText}
            showIcon={false}
            width="100%"
            type="submit"
            id="accept"
            loading={false}
            onClick={handleClose}
          />

          <CustomButton
            size="large"
            variant="contained"
            text={confirmBtnText}
            showIcon={false}
            width="100%"
            type="submit"
            id="accept"
            loading={false}
            onClick={onClick}
          />
        </div>
      </div>
    </Dialog>
  )
}
