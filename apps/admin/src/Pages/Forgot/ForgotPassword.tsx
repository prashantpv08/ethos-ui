import React, { useState } from "react";
import InputField from "../../Components/Input";
import CustomButton from "../../Components/CustomButton";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getApiCall, postApiCall } from "../../api/methods";
import endPoints from "../../api/endpoint";
import { useNavigate } from "react-router-dom";
// import { notifyError } from '../../Utils/toastify'

const forgotPasswordSchema = yup
  .object({
    // email: yup.string().email().required(),
    email: yup
      .string()
      .required("Email is required.")
      .matches(
        /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/,
        "Please enter a valid email."
      )
      .max(100, "Email must be at most 100 characters long.")
      .email("Please enter a valid email."),
  })
  .required();

export default function ForgotPassword(): JSX.Element {
  const [load, setLoad] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "all",
  });

  const onSubmit = (data: any) => {
    console.log("data", data);

    toast.dismiss();
    setLoad(true);
    // postApiCallWithOutToken(
    //   endPoints.forget_password,
    //   data,
    //   (s: any) => {
    //     const {
    //       data: { statusCode },
    //     } = s
    //     // if (data && statusCode && statusCode === 200) {
    //     localStorage.setItem('email', data['email'])
    //     //   // console.log('verified')
    //     toast.success(
    //       'An email has been sent to your registered email ID. Please follow the instructions to reset your password'
    //     )
    //     navigate('/verify?type=FORGOT_PASSWORD')
    //     // }
    //     setLoad(false)
    //   },
    //   (e: any) => {
    //     setLoad(false)
    //     if (e?.data && e?.data.message) {
    //       toast.error(e?.data.message)
    //     }
    //   }
    // )
  };

  return (
    <div className="authForm">
      <h1>Forgot Password</h1>
      <p>Please enter your registered email address, we will send you an OTP</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form">
          <InputField
            id="email"
            label="Email"
            name="email"
            control={control}
            error={!!errors["email"]}
            helperText={!!errors["email"] ? errors["email"].message : ``}
          />

          <CustomButton
            size="large"
            variant="contained"
            text="Reset Password "
            showIcon={false}
            width="100%"
            type="submit"
            id="login"
            loading={load}
          />
        </div>
      </form>

      <div className="rememberMe">
        <CustomButton
          // href=""
          text="Back to login"
          // onClick={(e: { preventDefault: () => void }) => {
          //   e.preventDefault()
          //   navigate(ROUTES.FORGOT_PASSWORD)
          // }}
          onClick={() => navigate("/")}
          showIcon={false}
          id={""}
          className="link"
        />
        {/* Forgot Password
            </button> */}
      </div>
    </div>
  );
}
