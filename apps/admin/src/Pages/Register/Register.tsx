// import InputField from '../../Components/Input'
// import CustomButton from '../../Components/CustomButton'
// import InputCheckbox from '../../Components/CheckBox'
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'
// import { useForm } from 'react-hook-form'
// import { useNavigate } from 'react-router-dom'
// import { postApiCall } from '../../api/methods'
// import { useState } from 'react'
// import { IconButton } from '@mui/material'
// import VisibilityIcon from '@mui/icons-material/Visibility'
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
// import endPoints from '../../api/endpoint'
// import { toast } from 'react-toastify'
// import { notify } from '../../Utils/toastify'
// import { ErrorMsg } from '../../helpers/contants'
// import React from 'react'
// import Images from '../../Utils/images'

// interface passwordStrength {
//   title: string
//   list: any
// }
// function PasswordStrength(props: passwordStrength) {
//   const { title, list } = props
//   return (
//     <div className="passwordSugession">
//       <p>{title}</p>
//       <ul>
//         {list.map((item: any, index: any) => {
//           return <li key={index}>{item}</li>
//         })}
//       </ul>
//     </div>
//   )
// }

// const RegisterFormSchema = yup
//   .object({
//     firstName: yup
//       .string()
//       .required(ErrorMsg('First Name').required)
//       .min(3, ErrorMsg(3).min)
//       .max(50, ErrorMsg(50).max)
//       .matches(/^[a-zA-Z]+$/, ErrorMsg('First Name').onlyLetter),
//     lastName: yup
//       .string()
//       .required('Last Name is required.')
//       .min(3, ErrorMsg(3).min)
//       .max(50, ErrorMsg(50).min)
//       .matches(/^[a-zA-Z]+$/, 'Last Name should only contain letters'),
//     email: yup
//       .string()
//       .required('Email is required.')
//       .matches(
//         /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/,
//         'Please enter a valid email.'
//       )
//       .max(100, 'Email must be at most 100 characters long.')
//       .email('Please enter valid email.'),

//     password: yup
//       .string()
//       .min(6, 'Password must be at least 6 characters')
//       .max(16, 'Password must be less then 17 characters')
//       .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
//         'Password must include at least one uppercase letter, one lowercase letter, and one numeric digit'
//       )
//       .required('Password is required'),
//     confirmPassword: yup
//       .string()
//       .oneOf([yup.ref('password'), ''], 'Passwords must match')
//       .required('Confirm Password is required'),
//     termsAndConditions: yup
//       .boolean()
//       .oneOf([true], 'You must accept the Terms and Conditions'),
//   })
//   .required()

// export default function Register(): JSX.Element {
//   const navigate = useNavigate()
//   const [load, setLoad] = useState<boolean>(false)
//   const [showPassword, setShowPassword] = React.useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isValid },
//   } = useForm({
//     resolver: yupResolver(RegisterFormSchema),
//     mode: 'all',
//   })

//   const onSubmit = (data: any) => {
//     toast.dismiss()
//     setLoad(true)

//     delete data['termsAndConditions']
//     postApiCall(
//       endPoints.register,
//       data,
//       (s: any) => {
//         const {
//           data: { statusCode },
//         } = s
//         if (data && statusCode && statusCode === 201) {
//           localStorage.setItem('email', data['email'])
//           navigate(`/verify?type=REGISTER`)
//         }

//         setLoad(false)
//       },
//       (e: any) => {
//         setLoad(false)
//         if (e?.data && e?.data.message) {
//           notify(e?.data.message, 'error')
//         } else {
//           notify(null, 'error')
//         }
//       }
//     )
//   }

//   const setFocus = (e: any, fieldId: string) => {
//     if (e.key === 'Tab') {
//       const field = document.getElementById(fieldId)
//       if (field) {
//         field.focus()
//         e.preventDefault()
//       }
//     }
//   }

//   return (
//     <div className="authForm">
//       <h1>Create an Account</h1>
//       <p>Get started by filling in your details below.</p>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="form">
//           <InputField
//             requiredField
//             id="firstName"
//             label="First Name"
//             name="firstName"
//             placeholder=""
//             control={control}
//             error={!!errors['firstName']}
//             helperText={
//               !!errors['firstName'] ? errors['firstName'].message : ''
//             }
//             onKeyDown={(e) => {
//               setFocus(e, 'lastName')
//             }}
//           />

//           <InputField
//             requiredField
//             id="lastName"
//             label="Last Name"
//             name="lastName"
//             placeholder=""
//             control={control}
//             error={!!errors['lastName']}
//             helperText={!!errors['lastName'] ? errors['lastName'].message : ''}
//             onKeyDown={(e) => {
//               setFocus(e, 'email')
//             }}
//           />

//           <InputField
//             requiredField
//             id="email"
//             label="Email"
//             name="email"
//             error={!!errors['email']}
//             helperText={!!errors['email'] ? errors['email'].message : ''}
//             control={control}
//           />
//           <InputField
//             requiredField
//             id="password"
//             label="Password"
//             name="password"
//             error={!!errors['password']}
//             // type="password"
//             type={showPassword ? 'text' : 'password'}
//             helperText={
//               !!errors['password'] ? `${errors['password']?.message}` : ''
//             }
//             control={control}
//             tooltip
//             popoverContent={
//               <PasswordStrength
//                 title="Your password must meet the following criteria"
//                 list={[
//                   'It should be between 6 and 16 characters in length.',
//                   'It must contain at least one uppercase letter.',
//                   'It must contain at least one lowercase letter.',
//                   'It must include at least one numeric digit.',
//                 ]}
//               />
//             }
//             onKeyDown={(e) => {
//               setFocus(e, 'confirmpassword')
//             }}
//             endAdornment={
//               <IconButton
//                 className="password-btn"
//                 onClick={() => {
//                   setShowPassword(!showPassword)
//                 }}
//                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//               >
//                 {showPassword ? (
//                   // <VisibilityIcon fontSize="small" color="primary" />
//                   <img src={Images.VISSIBILITY} alt="Show Password" />
//                 ) : (
//                   // <VisibilityOffIcon fontSize="small" color="primary" />
//                   <img src={Images.VISSIBILITY_OFF} alt="Hide Password" />
//                 )}
//               </IconButton>
//             }
//           />

//           <InputField
//             requiredField
//             id="confirmpassword"
//             label="Confirm Password"
//             name="confirmPassword"
//             error={!!errors['confirmPassword']}
//             // type="password"
//             type={showConfirmPassword ? 'text' : 'password'}
//             helperText={
//               !!errors['confirmPassword']
//                 ? `${errors['confirmPassword']?.message}`
//                 : ''
//             }
//             control={control}
//             tooltip
//             onKeyDown={(e) => {
//               setFocus(e, 'rememberme')
//             }}
//             popoverContent={
//               <PasswordStrength
//                 title="Your password must meet the following criteria"
//                 list={[
//                   'It should be between 6 and 16 characters in length.',
//                   'It must contain at least one uppercase letter.',
//                   'It must contain at least one lowercase letter.',
//                   'It must include at least one numeric digit.',
//                 ]}
//               />
//             }
//             endAdornment={
//               <IconButton
//                 className="password-btn"
//                 onClick={() => {
//                   setShowConfirmPassword(!showConfirmPassword)
//                 }}
//                 aria-label={
//                   showConfirmPassword ? 'Hide password' : 'Show password'
//                 }
//               >
//                 {showConfirmPassword ? (
//                   // <VisibilityIcon fontSize="small" color="primary" />
//                   <img src={Images.VISSIBILITY} alt="Show Password" />
//                 ) : (
//                   // <VisibilityOffIcon fontSize="small" color="primary" />
//                   <img src={Images.VISSIBILITY_OFF} alt="Hide Password" />
//                 )}
//               </IconButton>
//             }
//           />

//           <div className="rememberMe">
//             <InputCheckbox
//               id="rememberme"
//               label=""
//               name="termsAndConditions"
//               control={control}
//               isError={!!errors['termsAndConditions']}
//               helperText={
//                 !!errors['termsAndConditions']
//                   ? `${errors['termsAndConditions']?.message}`
//                   : ''
//               }
//             />
//             <p>
//               By creating an account, you agree to RealTrak{' '}
//               <CustomButton
//                 // href=""
//                 text="Terms & Conditions"
//                 className="link"
//                 showIcon={false}
//                 id={''}
//               />
//               {/* Terms & Conditions
//               </button> */}{' '}
//               and{' '}
//               <CustomButton
//                 // href=""
//                 text="Privacy Notice."
//                 className="link"
//                 showIcon={false}
//                 id={''}
//               />
//               {/* <a href="/" className="link">
//                 Privacy Notice
//               </a> */}

//             </p>
//           </div>
//           <div className="burronWrapper">
//             <CustomButton
//               size="large"
//               variant="contained"
//               text="Next"
//               showIcon={false}
//               width="100%"
//               type="submit"
//               id="login"
//               loading={load}
//               disabled={!isValid}
//             />
//           </div>

//           <div className="signupLink">
//             <p>
//               Already have an account yet?{' '}
//               <CustomButton
//                 // href=""
//                 text="Login Now"
//                 className="link"
//                 onClick={() => navigate('/login')}
//                 showIcon={false}
//                 id={''}
//               />
//               {/* Login Now
//               </button> */}
//             </p>
//           </div>
//         </div>
//       </form>
//     </div>
//   )
// }
