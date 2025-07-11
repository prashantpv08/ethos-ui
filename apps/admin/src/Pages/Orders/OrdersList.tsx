import { Box, Tab, Tabs } from "@mui/material";
import PageHeading from "../../Components/PageHaeding";
import React, { useEffect } from "react";
import CustomButton from "../../Components/CustomButton";
import Images from "../../Utils/images";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CustomTable from "../../Components/CustomTable";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../helpers/contants";
import { useDispatch } from "react-redux";
// import { getAndSetProductList } from '../../redux/products'
import NoData from "../../Components/Nodata";
// import Filter from '../../Components/Filter'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2, px: 0, pb: 0 }}>
          <div className="tabContainer">{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function OrdersList() {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const navigate = useNavigate();

  // useEffect(() => {
  //   getAndSetProductList()
  // }, [])

  return (
    <div className="pageBody">
      <PageHeading
        pageTitle="Product Management"
        buttonChildren={
          <>
            {value === 0 ? (
              <CustomButton
                // onClick={() => navigate(ROUTES.ADD_PRODUCTS)}
                size="large"
                variant="contained"
                text="Add New Product"
                showIcon={true}
                width="auto"
                type="button"
                id="filter"
                loading={false}
                iconPosition="start"
                iconType="svg"
                icon={<AddOutlinedIcon />}
              />
            ) : (
              <CustomButton
                // onClick={() => navigate(ROUTES.ADD_SERVICES)}
                size="large"
                variant="contained"
                text="Add New Service"
                showIcon={true}
                width="auto"
                type="button"
                id="filter"
                loading={false}
                iconPosition="start"
                iconType="svg"
                icon={<AddOutlinedIcon />}
              />
            )}
          </>
        }
      />

      <div className="tabs">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ width: "100%" }} padding={0}>
            <Box
              sx={{ borderBottom: 0, borderColor: "divider" }}
              className="tabsContainer"
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Products" {...a11yProps(0)} />
                <Tab label="Services" {...a11yProps(1)} />
              </Tabs>
              <div className="filterButton">{/* <Filter/> */}</div>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {/* <CustomTable /> */}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {/* <CustomTable /> */}
            </CustomTabPanel>
          </Box>
        </Box>
      </div>
    </div>
  );
}
