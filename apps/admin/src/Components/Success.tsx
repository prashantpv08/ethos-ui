import Images from '../Utils/images'
import CustomButton from './CustomButton'

interface Props {
  heading?: string
  title?: string
  buttonText?: string
  handleClick?: () => void
}

export default function Success(props: Props) {
  const { heading, title, buttonText, handleClick } = props
  return (
    <div className="success">
      <img src={Images.SUCCESS_GIF} alt={heading} />
      <h3>{heading}</h3>
      <p>{title}</p>
      <CustomButton
        size="large"
        variant="contained"
        text={buttonText as string}
        showIcon={false}
        width="100%"
        onClick={handleClick}
        id="redirect"
        loading={false}
        // onClick={onClick}
      />
    </div>
  )
}
