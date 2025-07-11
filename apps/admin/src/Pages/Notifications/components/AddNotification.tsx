import PageHeading from "../../../Components/PageHaeding";

// import CustomSelect from '../../../Components/CustomSelect'

export default function AddNotification() {
  return (
    <div className="pageBody">
      <PageHeading pageTitle="Notification" pageName="Add Notification" />
      {/* <form>
        <SectionContainer
          heading="Notification Details"
          children={
            <div className="formContainer">
              <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                  <AutocompleteSelect
                    id=""
                    labelText="Select Users"
                    placeHolderText="Select Users"
                    name=""
                    options={['All', 'Customers', 'Vendors']}
                    isCheckbox
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <DateInput name="" label="Date" />
                </Grid>
                <Grid item md={4} xs={12}>
                  <InputField
                    id=""
                    label="Time"
                    name=""
                    placeholder="Enter time"
                    requiredField
                  />
                </Grid>

                <Grid item md={12} xs={12}>
                  <Textarea
                    id=""
                    label="Title"
                    name=""
                    placeholder="Enter title"
                    requiredField
                    rows={4}
                  />
                </Grid>

                <Grid item md={12} xs={12}>
                  <Textarea
                    id=""
                    label="Description"
                    name=""
                    placeholder="Enter description"
                    requiredField
                    rows={4}
                  />
                </Grid>
              </Grid>
              <div className="formButtons end">
                <CustomButton
                  onClick={() => {}}
                  size="large"
                  variant="outlined"
                  text="Cancel"
                  width="auto"
                  type="button"
                  id="cancel"
                  showIcon={false}
                />

                <CustomButton
                  size="large"
                  variant="contained"
                  text="Send"
                  width="auto"
                  type="submit"
                  id="submit"
                  showIcon={false}
                />
              </div>
            </div>
          }
        />
      </form> */}
    </div>
  );
}
