// @ts-nocheck
import InputField from '../../Components/Input';
import CustomButton from '../../Components/CustomButton';

import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import Success from '../../Components/Success';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Images from '../../Utils/images';

const ResetPasswordFormSchema = yup
  .object({
    newPassword: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(16, 'Password must be at least 16 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Password must include at least one uppercase letter, one lowercase letter, and one numeric digit'
      )
      .required('Password is required'),

    confirmPassword: yup
      .string()
      .trim()
      .required('Please fill in the required field')
      .oneOf(
        [yup.ref('newPassword'), null],
        "Password and confirm new password doesn't match."
      )
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Password must include at least one uppercase letter, one lowercase letter, and one numeric digit'
      ),
  })
  .required();

export default function ResetPassword(): JSX.Element {
  const navigate = useNavigate();
  const [load, setLoad] = useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [reset, setReset] = React.useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ResetPasswordFormSchema),
    mode: 'all',
  });

  return reset ? (
    <form onSubmit={handleSubmit(onSubmit)} className="authForm">
      {/* {console.log(reset, 'error')} */}

      <div>
        <h1>Reset Password</h1>
        <p>Enter a new password to reset the password on your account.</p>
        <div className="form">
          <InputField
            id="newPassword"
            label="Password"
            name="newPassword"
            error={!!errors['newPassword']}
            control={control}
            helperText={
              !!errors['newPassword']
                ? `${errors['newPassword']?.message}`
                : 'Password must include at least one uppercase letter, one lowercase letter, and one numeric digit'
            }
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <IconButton
                className="password-btn"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
            requiredField
          />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            error={!!errors['confirmPassword']}
            control={control}
            helperText={
              !!errors['confirmPassword']
                ? `${errors['confirmPassword']?.message}`
                : 'Password must include at least one uppercase letter, one lowercase letter, and one numeric digit'
            }
            type={showConfirmPassword ? 'text' : 'password'}
            endAdornment={
              <IconButton
                className="password-btn"
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >
                {showConfirmPassword ? (
                  // <VisibilityIcon fontSize="small" color="primary" />
                  <img src={Images.VISSIBILITY} alt="Show Password" />
                ) : (
                  // <VisibilityOffIcon fontSize="small" color="primary" />
                  <img src={Images.VISSIBILITY_OFF} alt="Hide Password" />
                )}
              </IconButton>
            }
            requiredField
          />

          <CustomButton
            size="large"
            variant="contained"
            text="Reset Password "
            showIcon={false}
            width="100%"
            // onClick?= () =>
            type="submit"
            id="login"
            loading={load}
          />
        </div>
      </div>
    </form>
  ) : (
    <Success
      heading="Password has been updated"
      title="Your password has been updated successfully. Please click to log in with the updated credentials."
      buttonText="Login Now"
      handleClick={() => {
        navigate('/login');
      }}
    />
  );
}
