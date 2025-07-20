import { Box, Grid } from "@mui/material";
import AutocompleteSelect from "../../../Components/AutocompleteSelect";
import CustomButton from "../../../Components/CustomButton";
import InputField from "../../../Components/Input";
// import DateInput from '../../../Components/DateInput'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { putApiCall } from "../../../api/methods";
import endPoints from "../../../api/endpoint";
import { notify } from "../../../Utils/toastify";
import { ErrorMsg } from "../../../helpers/contants";
import dayjs from "dayjs";

const ContactInfoSchema = yup
  .object({
    firstName: yup
      .string()
      .required("First Name is required")
      .matches(/^[a-zA-Z]+$/, "First Name should only contain letters")
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).max),
    middleName: yup
      .string()
      .matches(/^[a-zA-Z]*$/, "Middle Name should only contain letters")
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).max),
    lastName: yup
      .string()
      .required("Last Name is required")
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).max)
      .matches(/^[a-zA-Z]+$/, "Last Name should only contain letters"),
    country: yup.object().required("Country is required"),
    dob: yup
      .string()
      .test("validDateOfBirth", "Invalid date of birth", function (value) {
        if (!value) return true; // Allow empty input
        const today = new Date();
        const dob = new Date(value);
        const age = today.getFullYear() - dob.getFullYear();
        if (dob > today || age < 18) {
          return false;
        }
        return true;
      })
      .required("Date of birth is required"),
    zipCode: yup
      .string()
      .matches(/^\d+$/, "Invalid Zip code.")
      .required("Zip code is required.")
      .max(10, "Invalid Zip code."),
    city: yup
      .string()
      .required("City is required")
      .matches(/^[A-Za-z]+$/, "Only alphabets are allowed.")
      .max(30, "City must be at most 30 characters long"),
    state: yup.string().required("State is required"),
    addressLineOne: yup
      .string()
      .required("Address is required")
      .max(500, "Address must be at most 500 characters long"),
    addressLineTwo: yup
      .string()
      .max(500, "Address must be at most 500 characters long"),
  })
  .required();
interface Props {
  changeStep: (step: number) => void;
}

export default function ContactInfo({ changeStep }: Props) {
  const userData: any = {};
  const [load, setLoad] = useState<boolean>(false);
  const countryList: any[] = [];
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    resolver: yupResolver(ContactInfoSchema),
    mode: "all",
  });

  useEffect(() => {
    if (userData) {
      const { businessInfo } = userData;
      if (businessInfo && businessInfo.addressLineOne) {
        const fieldNames = Object.keys(ContactInfoSchema.fields);
        fieldNames.forEach((name: any) => {
          if (name === "country") {
            setValue(name, { name: businessInfo[name] });
          } else if (name === "addressLineTwo") {
            setValue(
              name,
              businessInfo[name] === null ? undefined : businessInfo[name]
            );
          } else if (name === "dob") {
            setValue(name, dayjs(businessInfo[name]));
          } else {
            setValue(name, businessInfo[name]);
          }
        });
      }
      setValue("firstName", userData.firstName);
      setValue("lastName", userData.lastName);
    }
  }, [userData]);

  const onSubmit = (data: any) => {
    const payload = data;

    payload["type"] = "CONTACT_INFO";
    payload["country"] = data["country"].name;
    if (!payload["addressLineTwo"]) {
      delete payload["addressLineTwo"];
    }
    putApiCall(
      endPoints.businessRegister,
      payload,
      (s: any) => {
        const {
          data: { statusCode },
        } = s;
        if (statusCode && statusCode === 202) {
          notify("Contact Information saved successfully. ", "success");
          changeStep(2);
        }
      },
      (e: any) => {
        setLoad(false);
        if (e?.data && e?.data.message) {
          notify(e?.data.message, "error");
        } else {
          notify(null, "error");
        }
      }
    );
  };

  return (
    <div className="businessInfo_step contactInfo">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <InputField
                requiredField
                id="First_Name"
                label="First Name"
                name="firstName"
                placeholder="Enter first name"
                error={!!errors["firstName"]}
                helperText={
                  !!errors["firstName"]
                    ? errors["firstName"].message
                    : `Enter your complete name, as it appears on the passport or ID.`
                }
                control={control}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <InputField
                id="MiddleName"
                label="Middle Name"
                name="middleName"
                placeholder="Enter middle name"
                error={!!errors["middleName"]}
                helperText={
                  !!errors["middleName"] ? errors["middleName"].message : ``
                }
                control={control}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <InputField
                requiredField
                id="LastName"
                label="Last Name"
                name="lastName"
                placeholder="Enter last name"
                error={!!errors["lastName"]}
                helperText={
                  !!errors["lastName"] ? errors["lastName"].message : ``
                }
                control={control}
              />
            </Grid>
          </Grid>
          <div className="formLabel">
            <h3>Country of citizenship</h3>
          </div>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <AutocompleteSelect
                requiredField
                id="Country"
                labelText="Country"
                placeHolderText="Select country"
                name="country"
                control={control}
                error={!!errors["country"]}
                setValue={setValue}
                helperText={
                  !!errors["country"] ? `${errors["country"].message}` : ""
                }
                isCountryField={true}
                options={countryList}
                defaultValue=""
                disabled={false}
              />
            </Grid>
            {/* <Grid item md={4} xs={12}>
              <DateInput
                requiredField
                label="Date of Birth"
                minDate={new Date('1900-01-01').toISOString()}
                name="dob"
                formProps={{ control }}
                error={!!errors['dob']}
                helperText={
                  !!errors['dob'] && (
                    <p className="helper-error">{errors['dob'].message}</p>
                  )
                }
              />
            </Grid> */}
          </Grid>

          <div className="formLabel">
            <h3>Residential address</h3>
          </div>

          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <InputField
                id="address_line_1"
                label="Address line-1"
                name="addressLineOne"
                placeholder=""
                error={!!errors["addressLineOne"]}
                helperText={
                  !!errors["addressLineOne"]
                    ? errors["addressLineOne"].message
                    : ``
                }
                control={control}
                requiredField
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <InputField
                id="address_line_2"
                label="Address line-2"
                name="addressLineTwo"
                placeholder=""
                error={!!errors["addressLineTwo"]}
                helperText={
                  !!errors["addressLineTwo"]
                    ? errors["addressLineTwo"].message
                    : ``
                }
                control={control}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <InputField
                requiredField
                id="city_town"
                label="City / Town"
                name="city"
                placeholder="Enter city / town"
                error={!!errors["city"]}
                helperText={!!errors["city"] ? errors["city"].message : ``}
                control={control}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <InputField
                id="zip_postal_code"
                label="Zip / Postal code"
                name="zipCode"
                placeholder="Enter zip / postal code"
                error={!!errors["zipCode"]}
                helperText={
                  !!errors["zipCode"] ? errors["zipCode"].message : ``
                }
                control={control}
                requiredField
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <AutocompleteSelect
                requiredField
                id="BusinessLocation"
                labelText="State"
                placeHolderText="Please select State"
                name="state"
                control={control}
                error={!!errors["state"]}
                setValue={setValue}
                helperText={
                  !!errors["state"] ? `${errors["state"].message}` : ""
                }
                options={["United State", "Canada", "India", "Rusia"]}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <InputField
                id="business_location"
                label="Country"
                name="business_location"
                placeholder="State / region"
                // error={}
                // helperText={''}
                defaultValue={
                  userData.businessInfo
                    ? userData.businessInfo.businessLocation
                    : ""
                }
                // control={control}
                disabled={true}
                requiredField
              />
            </Grid>
          </Grid>
        </Box>
        <Box className="buttonContainer">
          <CustomButton
            size="large"
            variant="contained"
            text="Continue"
            showIcon={false}
            width="100%"
            type="submit"
            id="login"
            loading={load}
            disabled={!isValid}
          />
        </Box>
      </form>
    </div>
  );
}
