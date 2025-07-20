import { Outlet, useNavigate } from 'react-router-dom';
import '../styles/auth.scss';
import CustomButton from '../Components/CustomButton';
import Images from '../Utils/images';
import Login from '../Pages/Login/Login';
import ResetPassword from '../Pages/ResetPassword/ResetPassword';
import ForgotPassword from '../Pages/Forgot/ForgotPassword';
import Footer from './Footer';
import { useEffect } from 'react';
import { ROUTES } from '../helpers/contants';
interface Props {
  page: string | undefined;
}

export default function AuthLayout({ page }: Props): JSX.Element {
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (status) {
  //     if (userData.formNextStep === 'BILLING_DETAILS') {
  //       navigate(ROUTES.DASHBOARD)
  //     } else {
  //       navigate(ROUTES.BUSINESSINFO)
  //     }
  //   }
  // }, [])

  const content: React.ReactNode =
    page === 'Login' ? (
      <Login />
    ) : page === 'Reset' ? (
      <ResetPassword />
    ) : page == 'Forgot' ? (
      <ForgotPassword />
    ) : null;
  return (
    <div className="authContainer">
      <div className="authHeader">
        <div className="authHeaderInner">
          <div className="logo">
            {/* <img src={Images.LOGO} alt="Logo" /> */}
            <h1>Logo</h1>
          </div>
        </div>
      </div>
      <div className="authBody">
        <div className="slider">
          <img src={Images.ADMIN_BG} alt="Admin" />
          {/* <img src={Images.LOGO_WHITE} alt="Logo" className="logoWhite" /> */}
          {/* <AuthSlider /> */}
        </div>
        <div className="componentContainer">{content}</div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
