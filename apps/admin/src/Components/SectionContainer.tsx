import { Button, IconButton } from '@mui/material'
import Images from '../Utils/images'

interface Props {
  children?: JSX.Element | JSX.Element[]
  heading: String
  editIcon?: boolean
  handleEditButton?: any
}

export default function SectionContainer(props: Props) {
  const { children, heading, editIcon, handleEditButton } = props
  return (
    <div className="sectionContainer">
      <div className="sectionHeadings">
        <div>
          <h3>{heading}</h3>
        </div>
        {editIcon && (
          <Button onClick={handleEditButton} sx={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#ffffff',
            border: '1px solid #ffffff',
            padding: '2px 8px',
            "&:hover":{
              color: '#d5d5d5',
              border: '1px solid #d5d5d5',
            }
          }}>
            {/* <img src={Images.EDIT_IC} style={{filter: "invert(100%)"}} alt="User Name" /> */}
            Edit
          </Button>
        )}
      </div>
      <div className="sectionBody">{children}</div>
    </div>
  )
}
