import { useNavigate } from 'react-router-dom'
import CustomButton from '../../Components/CustomButton'
import { ROUTES } from '../../helpers/contants'
import Images from '../../Utils/images'
import { useEffect } from 'react'
import { RootState, useAppSelector } from '../../redux/store'

function Welcome() {
  const navigate = useNavigate()
  const { userData } = useAppSelector((state: RootState) => state.auth)
  // useEffect(() => {
  //   if (userData.formNextStep !== undefined) {
  //     navigate(ROUTES.BUSINESSINFO)
  //   }
  // }, [])

  return (
    <div className="welcomeScreen">
      <div className="wel_left">
        <div className="wel_message">
          <h1>Welcome! Here's what to expect</h1>
          <ul>
            <li>
              <div className="num">1</div>
              <div className="desc">
                <h3>Provide your Information and Documents</h3>
                <p>
                  We need to collect relevant personal and business information
                  to comply with identification and verification measures. We
                  may require additional information or documents later.
                </p>
              </div>
            </li>
            <li>
              <div className="num">2</div>
              <div className="desc">
                <h3>We'll verify your submission</h3>
                <p>
                  You may be asked to meet with an Reels Associate to verify
                  your submission. This helps keep Amazon a trusted shopping
                  destination.
                </p>
              </div>
            </li>
            <li>
              <div className="num">3</div>
              <div className="desc">
                <h3>Get verified and start selling!</h3>
                <p>
                  After we receive all of the required information, it will be
                  verified as soon as possible.
                </p>
              </div>
            </li>
          </ul>

          <div className="burronWrapper">
            <CustomButton
              onClick={() => navigate(ROUTES.BUSINESSINFO)}
              size="large"
              variant="contained"
              text="Let's Begin"
              showIcon={false}
              width="100%"
              type="submit"
              id="login"
              loading={false}
            />
          </div>
        </div>
      </div>
      <div className="wel_right">
        <div className="infoGraphic">
          <figure>
            <img src={Images.WELCOME_ILLUSTRATOR} alt="Welcome" />
          </figure>
          <h3>What you’ll need</h3>
          <ul>
            <li>
              <p>Valid government issued ID or passport</p>
            </li>
            <li>
              <p>Recent bank account or credit card statement</p>
            </li>
            <li>
              <p>Chargeable credit or debit card</p>
            </li>
            <li>
              <p>Mobile number</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Welcome
