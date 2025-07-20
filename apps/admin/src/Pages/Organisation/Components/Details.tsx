import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeading from '../../../Components/PageHaeding';
// import CustomButton from "../../../Components/CustomButton";
import SectionContainer from '../../../Components/SectionContainer';
import { Box, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { getOrgDetails } from '../action';
import Loading from '../../../Components/Loading';

const Details = () => {
  const { state }: any = useLocation();
  const [detailsData, setDetailsData] = useState<any>({});
  const [loading, setLoading] = useState<any>(true);

  useEffect(() => {
    getOrgDetails({ id: state?.orgData._id }, (data: any) => {
      if (data) {
        setDetailsData(data?.data);
        setLoading(false);
      }
    });
  }, []);

  // console.log(detailsData);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="pageBody">
      <PageHeading
        pageTitle="Organisation Management"
        pageName={'Organisation Details'}
      />

      <SectionContainer
        heading="Organisation Details"
        children={
          <Grid container spacing={2} px={1}>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Organisation Name</Typography>
                <Typography variant="h6">
                  {detailsData?.orgName || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Organisation Number</Typography>
                <Typography variant="h6">
                  {detailsData?.orgNumber || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Business Type</Typography>
                <Typography variant="h6">
                  {detailsData?.businessType || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Owner Name</Typography>
                <Typography variant="h6">
                  {detailsData?.ownerFName + ' ' + detailsData?.ownerLName ||
                    '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Email</Typography>
                <Typography variant="h6">
                  {detailsData?.email || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Phone</Typography>
                <Typography variant="h6">
                  {detailsData?.phone || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Home Number</Typography>
                <Typography variant="h6">
                  {detailsData?.homeNumber || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Address</Typography>
                <Typography variant="h6">
                  {detailsData?.address || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Zipcode</Typography>
                <Typography variant="h6">
                  {detailsData?.zipcode || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">State</Typography>
                <Typography variant="h6">
                  {detailsData?.state || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">City</Typography>
                <Typography variant="h6">{detailsData?.city || '-'}</Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Country</Typography>
                <Typography variant="h6">
                  {detailsData?.country || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Code</Typography>
                <Typography variant="h6">{detailsData?.code || '-'}</Typography>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Commission Type</Typography>
                <Typography variant="h6">
                  {detailsData?.commissionType || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Commission Value</Typography>
                <Typography variant="h6">
                  {detailsData?.commissionValue || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">
                  Stripe Connect AcctId
                </Typography>
                <Typography variant="h6">
                  {detailsData?.stripeConnectAcctId || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">
                  Stripe Connect Status
                </Typography>
                <Typography variant="h6">
                  {detailsData?.stripeConnectStatus || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">
                  Stripe Payout Status
                </Typography>
                <Typography variant="h6">
                  {(detailsData?.stripePayoutStatus && 'True') || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box>
                <Typography variant="subtitle1">Created At</Typography>
                <Typography variant="h6">
                  {dayjs(detailsData?.createdAt).format('MMM DD YYYY') || '-'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        }
      />
    </div>
  );
};

export default Details;

// stripeConnectAcctId: "acct_1OvmFm2c6wAgMR9S";
// stripeConnectStatus: "Connected";
// stripePayoutStatus: true;
