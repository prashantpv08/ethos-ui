import Images from '../Utils/images'
import CustomButton from './CustomButton'

interface Props {
    heading?: string
    title?: string
    buttonText?: string
    showButton?: boolean
    handleClick?: () => void
}

export default function UnderDevelopment(props: Props) {
    const { heading, title, buttonText, handleClick, showButton } = props
    return (
        <div className="success">
            <img src={Images.NO_DATA_FOUND} alt={heading} />
            <h3>{heading}</h3>
            <p>{title}</p>
            {
                showButton ? (
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
                ) : null
            }

        </div>
    )
}
