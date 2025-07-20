import { Grid, IconButton } from '@mui/material'
import AutocompleteSelect from '../../../Components/AutocompleteSelect'
import CustomButton from '../../../Components/CustomButton'
import CustomSelect from '../../../Components/CustomSelect'
import InputField from '../../../Components/Input'
import CustomPopover from '../../../Components/CustomPopover'
import Images from '../../../Utils/images'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { putApiCall } from '../../../api/methods'
import endPoints from '../../../api/endpoint'
import InputCheckbox from '../../../Components/CheckBox'
import { notify } from '../../../Utils/toastify'

import { ErrorMsg } from '../../../helpers/contants'
import { businessType } from '../../../Utils/constantData'

interface BusinessTypeWarning {
  title: string
  info: any
  error: any
}
function BusinessTypeWarning(props: BusinessTypeWarning) {
  const { title, info, error } = props
  return (
    <div className="passwordSugession BusinessTypeWarning">
      <div className="popoverHead">
        <img src={Images.WARNING} alt="Warning" />
      </div>
      <div className="popOverBody">
        <h4>{title}</h4>
        <p className="info">{info}</p>
        <p className="error">{error}</p>
      </div>
    </div>
  )
}

const BusinessSchema = yup
  .object({
    businessLocation: yup.object().required('Business Location is required'),
    businessType: yup
      .string()
      .required('Business Type is required')
      .default(businessType[0]),
    businessName: yup
      .string()
      .required('Business Name is required')
      .matches(
        /^[a-zA-Z0-9_\s]+$/,
        'Value can only contain letters, numbers, and underscores'
      )
      .min(3, ErrorMsg(3).min)
      .max(50, ErrorMsg(50).min),
    department: yup
      .array()
      .min(1, 'Select at least one value')
      .required('Select at least one value'),
  })
  .required()

interface Props {
  changeStep: (step: number) => void
}

export default function Business({ changeStep }: Props) {
  const [load, setLoad] = useState<boolean>(false)
  const [loadingData, setLodingData] = useState<boolean>(false)
  const countryList: any[] = []
  const departmentList: any[] = []
  const userData: any = {}

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: yupResolver(BusinessSchema),
    mode: 'all',
  })

  useEffect(() => {
    if (userData.businessInfo) {
      setLodingData(true)
      const { businessLocation, businessName, businessType, department } =
        userData.businessInfo
      setValue('businessType', businessType)
      setValue('businessLocation', { name: businessLocation })
      setValue('businessName', businessName)
      setValue('department', department)
      setLodingData(false)
    } else {
      // setValue('businessType', businessType[0])
    }
  }, [userData])

  const onSubmit = (data: any) => {
    const payload = data
    payload['type'] = 'BUSINESS_INFO'
    payload['businessLocation'] = data['businessLocation'].name
    payload['isBusinessInfoCorrect'] = true
    putApiCall(
      endPoints.businessRegister,
      payload,
      (s: any) => {
        const {
          data: { statusCode, data },
        } = s
        if (statusCode && statusCode === 202) {
          notify('Business Information saved successfully. ', 'success')
          changeStep(1)
        }
      },
      (e: any) => {
        setLoad(false)
        if (e?.data && e?.data.message) {
          notify(e?.data.message, 'error')
        } else {
          notify(null, 'error')
        }
      }
    )
  }
  const wathcType = watch('businessType')
  return (
    <div className="businessInfo_step">
      <form onSubmit={handleSubmit(onSubmit)}>
        {!loadingData && (
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <AutocompleteSelect
                requiredField
                id="BusinessLocation"
                isCountryField={true}
                labelText="Business Location"
                placeHolderText="Please select business location"
                name="businessLocation"
                disabled={false}
                control={control}
                error={!!errors['businessLocation']}
                setValue={setValue}
                helperText={
                  !!errors['businessLocation']
                    ? `${errors['businessLocation'].message}`
                    : ''
                }
                options={countryList}
              />
            </Grid>
            <Grid item md={12} xs={12} className="business_wa_p">
              {wathcType && (
                <CustomSelect
                  id="Business Type"
                  labelText="Business Type"
                  placeHolderText="Select an entity type"
                  name="businessType"
                  error={!!errors['businessType']}
                  helperText={
                    !!errors['businessType']
                      ? `${errors['businessType'].message}`
                      : ''
                  }
                  control={control}
                  options={businessType}
                  requiredField
                />
              )}

              <CustomPopover
                id=""
                children={
                  <BusinessTypeWarning
                    title="Please ensure your business type selection is correct."
                    info="You have selected to register as a Publicly-listed business with shares listed on a stock exchange for public trading."
                    error="An incorrect selection may affect the status of your account."
                  />
                }
                anchorOrigin_vertical="top"
                anchorOrigin_horizontal="left"
                transformOrigin_vertical="top"
                transformOrigin_horizonral="left"
                closeButton
              />
            </Grid>

            {departmentList.length > 0 && (
              <Grid item md={12} xs={12}>
                <AutocompleteSelect
                  requiredField
                  id="department"
                  labelText="Which Departments do you cater?"
                  placeHolderText="Please select department"
                  name="department"
                  defaultValue={[]}
                  disabled={false}
                  control={control}
                  error={!!errors['department']}
                  setValue={setValue}
                  helperText={
                    !!errors['department']
                      ? `${errors['department'].message}`
                      : ''
                  }
                  options={departmentList.map(
                    (department: any) => department.deptName
                  )}
                  multiple={true}
                  isCheckbox
                />
              </Grid>
            )}
            <Grid item md={12} xs={12}>
              <InputField
                requiredField
                id="business_name"
                label="Business Name: Used for state or federal registration."
                name="businessName"
                placeholder="Enter business name"
                control={control}
                error={!!errors['businessName']}
                helperText={
                  !!errors['businessName']
                    ? `${errors['businessName'].message}`
                    : 'I verify the accuracy of my business location and type, and I acknowledge that this information is not amendable at a later time.'
                }
              />
            </Grid>
          </Grid>
        )}

        <div className="step_help flex">
          <p>
            By clicking 'Agree and continue,' you are accepting the and
            <a href="" className="link">
              Reels Services Business Solutions Agreement
            </a>{' '}
            and{' '}
            <a href="" className="link">
              Reels Privacy
            </a>
            .
          </p>
        </div>
        <CustomButton
          size="large"
          variant="contained"
          text="Agree and Continue"
          showIcon={false}
          width="100%"
          type="submit"
          id="login"
          loading={load}
          disabled={!isValid}
        />
      </form>
    </div>
  )
}
