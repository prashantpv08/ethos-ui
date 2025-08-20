import React, { useEffect, useState } from "react";
import InputField from "../../Components/Input";
import CustomButton from "../../Components/CustomButton";
import InputCheckbox from "../../Components/CheckBox";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { postApiCall } from "../../api/methods";

import endPoints from "../../api/endpoint";
// import { AxiosResponse } from 'axios'
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
import { ROUTES } from "../../helpers/contants";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { notify } from "../../Utils/toastify";
import { AxiosResponse } from "axios";
import Images from "../../Utils/images";

interface passwordType {
  title: string;
  list: any;
}
function PasswordType(props: passwordType) {
  const { title, list } = props;
  return (
    <div className="passwordSugession">
      <p>{title}</p>
      <ul>
        {list.map((item: any, index: any) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
    </div>
  );
}

const LoginFormSchema = yup
  .object({
    email: yup
      .string()
      .required("Email is required.")
      .matches(
        /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/,
        "Please enter a valid email."
      )
      .max(100, "Email must be at most 100 characters long.")
      .email("Please enter a valid email."),

    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at least 16 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must include at least one uppercase letter, one lowercase letter, and one numeric digit."
      )
      .required("Password is required."),
  })
  .required();

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [load, setLoad] = useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberChecked, setRememberChecked] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(LoginFormSchema),
    mode: "all",
  });
  const handleRememberCheck = () => {
    setRememberChecked(!rememberChecked);
  };
  const vendorEmail = localStorage.getItem("admin_email");
  const vendorPassword = localStorage.getItem("admin_password");
  useEffect(() => {
    // if (vendorEmail && vendorPassword)
    const initialFormData = {
      email: vendorEmail ? vendorEmail : "",
      password: vendorPassword ? vendorPassword : "",
    };
    reset(initialFormData);
  }, [reset]);

  const onSubmit = (data: any) => {
    const { email, password } = data;
    toast.dismiss();
    setLoad(true);
    if (rememberChecked) {
      localStorage.setItem("admin_email", email);
      localStorage.setItem("admin_password", password);
    }


    const payload = {
      email,
      password,
      // deviceId: `${generateRandomString(5)}_${
      //   localStorage.getItem('email') ? localStorage.getItem('email') : ' '
      // }`,
      // deviceToken: generateRandomString(6),
      // browser: navigator.userAgent,
    };

    postApiCall(
      endPoints.login,
      payload,
      (s: AxiosResponse) => {
        const {
          data: { data },
        } = s;
        if (data?.accessToken) {
          dispatch(
            login({
              status: true,
              userData: { ...data, email },
              token: data.accessToken,
            })
          );
          navigate(ROUTES.DASHBOARD);
          // if (data.isEmailVerified) {
          //   dispatch(
          //     login({
          //       status: true,
          //       userData: { ...data, email },
          //       token: data.accessToken,
          //     })
          //   )
          //   if (data.formNextStep && data.formNextStep !== 'BILLING_DETAILS') {
          //     navigate(ROUTES.BUSINESSINFO)
          //   } else {
          //     navigate(ROUTES.DASHBOARD)
          //   }
          //   localStorage.removeItem('email')
          // } else {
          //   localStorage.setItem('email', email)
          //   navigate(ROUTES.VERIFY)
          // }
        }
        setLoad(false);
      },
      (e: any) => {
        setLoad(false);
        if (e?.data && e?.data.message) {
          if (
            e?.data?.message === "We did not find any account with this email."
          ) {
            notify(
              "The email address and password do not match our records",
              "error"
            );
          } else {
            notify(e?.data.message, "error");
          }
        } else {
          notify(null, "error");
        }
      }
    );
  };

  return (
    <div className="authForm top_50">
      <h1>Welcome back</h1>
      <p>Please enter your details.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form">
          <InputField
            requiredField
            id="email"
            label="Email"
            name="email"
            error={!!errors["email"]}
            helperText={!!errors["email"] ? errors["email"].message : ``}
            control={control}
            value={vendorEmail ? vendorEmail : ""}
          />

          <InputField
            requiredField
            id="password"
            label="Password"
            name="password"
            error={!!errors["password"]}
            helperText={
              !!errors["password"] ? `${errors["password"]?.message}` : ""
            }
            type={showPassword ? "text" : "password"}
            // tooltip
            // popoverContent={
            //   <PasswordType
            //     title="Your password must meet the following criteria"
            //     list={[
            //       'It should be between 8 and 16 characters in length.',
            //       'It must contain at least one uppercase letter.',
            //       'It must contain at least one lowercase letter.',
            //       'It must include at least one numeric digit.',
            //     ]}
            //   />
            // }
            endAdornment={
              <IconButton
                className="password-btn"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // <VisibilityIcon fontSize="small" color="primary" />
                  <img src={Images.VISSIBILITY} alt="Show Password" />
                ) : (
                  // <VisibilityOffIcon fontSize="small" color="primary" />
                  <img src={Images.VISSIBILITY_OFF} alt="Hide Password" />
                )}
              </IconButton>
            }
            control={control}
            defaultValue={vendorPassword ? vendorPassword : ""}
          />

          <div className="burronWrapper">
            <CustomButton
              // onClick?= () =>
              size="large"
              variant="contained"
              text="Log In"
              showIcon={false}
              width="100%"
              type="submit"
              id="login"
              loading={load}
              // disabled={!isValid}n
            />
          </div>

          <div className="rememberMe">
            <InputCheckbox
              id="rememberme"
              label="Remember Me"
              name="rememberme"
              // control={control}
              onChange={() => handleRememberCheck()}
            />
            {/* <CustomButton
              // href=""
              text="Forgot Password"
              // onClick={(e: { preventDefault: () => void }) => {
              //   e.preventDefault()
              //   navigate(ROUTES.FORGOT_PASSWORD)
              // }}
              onClick={() => navigate('/forgot-password')}
              showIcon={false}
              id={''}
              className="link"
            /> */}
            {/* Forgot Password
            </button> */}
          </div>
        </div>
      </form>
    </div>
  );
}
