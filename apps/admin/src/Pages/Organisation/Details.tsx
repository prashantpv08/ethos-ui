import { Box, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { Heading } from "@ethos-frontend/ui";
import { useRestQuery } from "@ethos-frontend/hook";
import { API_URL } from "@ethos-frontend/constants";
import Loading from "../../Components/Loading";

export default function Details() {
  const { id } = useParams();
  const { data, isLoading } = useRestQuery<any>(
    ["org-detail", id],
    `${API_URL.deleteOrGetOrg}/detail/${id}`
  );

  if (isLoading) {
    return <Loading />;
  }

  const detailsData = data?.data?.data || {};

  return (
    <div className="p-4">
      <Heading variant="h5" className="pb-4">
        Organisation Details
      </Heading>
      <Grid container spacing={2} px={1}>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Organisation Name</Typography>
            <Typography variant="h6">{detailsData?.orgName || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Organisation Number</Typography>
            <Typography variant="h6">{detailsData?.orgNumber || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Business Type</Typography>
            <Typography variant="h6">{detailsData?.businessType || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Owner Name</Typography>
            <Typography variant="h6">
              {detailsData?.ownerFName && detailsData?.ownerLName
                ? `${detailsData.ownerFName} ${detailsData.ownerLName}`
                : "-"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Email</Typography>
            <Typography variant="h6">{detailsData?.email || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Phone</Typography>
            <Typography variant="h6">{detailsData?.phone || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Home Number</Typography>
            <Typography variant="h6">{detailsData?.homeNumber || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Address</Typography>
            <Typography variant="h6">{detailsData?.address || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Zipcode</Typography>
            <Typography variant="h6">{detailsData?.zipcode || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">State</Typography>
            <Typography variant="h6">{detailsData?.state || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">City</Typography>
            <Typography variant="h6">{detailsData?.city || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Country</Typography>
            <Typography variant="h6">{detailsData?.country || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Code</Typography>
            <Typography variant="h6">{detailsData?.code || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Commission Type</Typography>
            <Typography variant="h6">{detailsData?.commissionType || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Commission Value</Typography>
            <Typography variant="h6">{detailsData?.commissionValue || "-"}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Stripe Connect AcctId</Typography>
            <Typography variant="h6">
              {detailsData?.stripeConnectAcctId || "-"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Stripe Connect Status</Typography>
            <Typography variant="h6">
              {detailsData?.stripeConnectStatus || "-"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Stripe Payout Status</Typography>
            <Typography variant="h6">
              {detailsData?.stripePayoutStatus ? "True" : "-"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography variant="subtitle1">Created At</Typography>
            <Typography variant="h6">
              {detailsData?.createdAt
                ? dayjs(detailsData.createdAt).format("MMM DD YYYY")
                : "-"}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

