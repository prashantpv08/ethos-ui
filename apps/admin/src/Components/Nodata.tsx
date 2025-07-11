import Images from '../Utils/images'
import CustomButton from './CustomButton'

interface Props {
  heading?: string
  title?: string
  buttonText?: string
  handleClick?: () => void
  img?:boolean
  disabled?:boolean
  className?: string
}

export default function NoData(props: Props) {
  const { heading, title, buttonText, handleClick , img=true  , disabled, className} = props
  // console.log(disabled)
  return (
    <div className={`success ${className }`}>
     {img && <img src={disabled ? Images.NO_RECORD_FOUND : Images.NO_DATA_FOUND } alt={heading} />}
      <h3>{heading}</h3>
      <p>{title}</p>
      {buttonText && (
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
          disabled={disabled}
        />
      )}
    </div>
  )
}
