import { Box, Grid, IconButton } from '@mui/material'
import AutocompleteSelect from '../../../Components/AutocompleteSelect'
import CustomButton from '../../../Components/CustomButton'
import InputField from '../../../Components/Input'

export default function BillingDetails() {
  return (
    <div className="businessInfo_step contactInfo">
      <Box>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <AutocompleteSelect
              id="bank_name"
              labelText="Name of the bank"
              placeHolderText="Name of the bank"
              name="bank_name"
              error={false}
              helperText=""
              defaultValue="Name of the bank"
              disabled={false}
              value=""
              onChange={() => {}}
              options={['Bank One', 'Bank two', 'Bank three', 'Bank four']}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <InputField
              id="bank_address"
              label="Bank Address"
              name="bank_address"
              placeholder="Enter bank address"
              // error={}
              helperText={''}
              // control={control}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <InputField
              id="zip_postal_code"
              label="Zip / Postal code"
              name="zip_postal_code"
              placeholder="Enter zip / postal code"
              // error={}
              helperText={''}
              // control={control}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <InputField
              id="Account Holder Name"
              label="Account Holder Name"
              name="Account Holder Name"
              placeholder="Enter account holder name"
              // error={}
              helperText={''}
              // control={control}
            />
          </Grid>
          <Grid item md={8} xs={12}>
            <InputField
              id="Account Number"
              label="Account Number"
              name="Account Number"
              placeholder="Enter account number"
              // error={}
              helperText={''}
              // control={control}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <InputField
              id="Instructions"
              label="Instructions"
              name="Instructions"
              placeholder="Write your instructions here..."
              // error={}
              helperText={''}
              // control={control}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className="buttonContainer">
        <CustomButton
          size="large"
          variant="contained"
          text=" Submit"
          showIcon={false}
          width="100%"
          type="submit"
          id="login"
          loading={false}
          disabled
        />
      </Box>
    </div>
  )
}
