import { Dialog, IconButton, Link } from '@mui/material'
import React from 'react'
import Images from '../Utils/images'
import CustomButton from '../Components/CustomButton'

export default function Footer() {
  const [open, setOpen] = React.useState(false
    // localStorage.getItem('d') === null ? true : false
  )

  const handleClose = () => {
    localStorage.setItem('d', '1')
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <footer className="footer">
      {/* <div className="nav">
        <nav>
          <Link underline="none" className="navLink">
            Get support
          </Link>
          <Link underline="none" className="navLink">
            Policies and Agreements
          </Link>
          <Link underline="none" className="navLink">
            FAQ’s
          </Link>
          <Link underline="none" className="navLink" onClick={handleOpen}>
            Disclaimer
          </Link>
        </nav>
      </div> */}
      <div className="copyright">
        <p>© 2024, Inc. or its affiliates</p>
      </div>

      <Dialog onClose={handleClose} open={open}>
        <div className="dialogWrapper">
          <div className="dialogHeader">
            <h4>Disclaimer</h4>

            <IconButton onClick={handleClose}>
              <img src={Images.CLOSE} alt="Close" />
            </IconButton>
          </div>
          <div className="doalogBody">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </div>
          <div className="dialogActions">
            <CustomButton
              size="large"
              variant="contained"
              text="Accept"
              showIcon={false}
              width="100%"
              type="submit"
              id="accept"
              loading={false}
              onClick={handleClose}
            />
          </div>
        </div>
      </Dialog>
    </footer>
  )
}
