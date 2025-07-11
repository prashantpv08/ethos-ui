import { IconButton, Popover } from '@mui/material'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import React from 'react'
import Images from '../Utils/images'

interface Props {
  id: string
  children: any
  arrow?: boolean
  closeButton?: boolean
  anchorOrigin_vertical: 'bottom' | 'center' | 'top' | number
  anchorOrigin_horizontal: 'center' | 'left' | 'right' | number
  transformOrigin_vertical: 'bottom' | 'center' | 'top' | number
  transformOrigin_horizonral: 'center' | 'left' | 'right' | number
}
export default function CustomPopover(props: Props) {
  const {
    id,
    children,
    arrow,
    closeButton,
    anchorOrigin_vertical,
    anchorOrigin_horizontal,
    transformOrigin_vertical,
    transformOrigin_horizonral,
  } = props
  // console.log(anchorOrigin)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        className="popoverPosition"
        disableRipple
        onClick={handleClick}
      >
        <HelpOutlineOutlinedIcon fontSize="small" />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={arrow ? 'popoverArrow' : ''}
        anchorOrigin={{
          vertical: anchorOrigin_vertical,
          horizontal: anchorOrigin_horizontal,
        }}
        transformOrigin={{
          vertical: transformOrigin_vertical,
          horizontal: transformOrigin_horizonral,
        }}
      >
        {closeButton ? (
          <IconButton className="CloasePopover" onClick={handleClose}>
            <img src={Images.CLOSE} alt="Close" />
          </IconButton>
        ) : null}

        {children}
      </Popover>
    </>
  )
}
