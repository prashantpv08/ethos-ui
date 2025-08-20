import * as yup from 'yup';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  FormLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';

import PageHeading from '../../Components/PageHaeding';
import React, { useEffect } from 'react';
import CustomButton from '../../Components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../helpers/contants';
import NoData from '../../Components/Nodata';
import SearchInput from '../../Components/searchInput';
import TablePagination from '../../Components/Pagination';
import {
  capitalizeFirstLetter,
  getComparator,
  stableSort,
  useDebounce,
} from '../../Utils/helperFns';
import {
  blockOrg,
  deleteORG,
  getActiveOrgList,
  getOrgList,
  updateCommission,
  updateUserAction,
} from './action';
import InputField from '../../Components/Input';
import { Controller, useForm } from 'react-hook-form';
import MUIAutoComplete from '../../Components/MUIAutoComplete';
import Loading from '../../Components/Loading';
import WarningDialog from '../../Components/WarningDialog';
import { toast } from 'react-toastify';

const CommissionSchema = yup
  .object({
    orgIds: yup.array().min(1).required('at least one item needs to be here'),
    commissionType: yup.string().required('Please select Commission Type.'),
    commissionValue: yup.string().required('Please add commission value.'),
    // .min(3, ErrorMsg(3).min)
    // .max(50, ErrorMsg(50).min),
  })
  .required();

export default function ClientMain() {
  const navigate = useNavigate();
  const [orgList, setOrgList] = React.useState<any>([]);
  const [activeOrgList, setActiveOrgList] = React.useState<any>([]);

  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState<any>(null);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = React.useState<any>(null);
  const [fromDate, setFromDate] = React.useState<any>('');
  const [toDate, setToDate] = React.useState<any>('');
  const [status, setStatus] = React.useState<any>('');
  const [selectedId, setSelectedId] = React.useState<any>('');
  const [type, setType] = React.useState<any>(false);
  const [loading, setLoading] = React.useState<any>(true);
  const [openModel, setOpenModel] = React.useState(false);
  const [openDeleteModel, SetOpenDeleteModel] = React.useState(false);
  const [rejectModel, setRejectModel] = React.useState(false);
  const [comment, setComment] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [popModel, setPopModel] = React.useState(false);

  const handleClickOpen = () => {
    setPopModel(true);
  };

  const handleCloseModel = () => {
    setPopModel(false);
    handleClose();
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const status = event.target.value as string;
    setStatus(status);
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    register,
    getValues,
    clearErrors,
  } = useForm({
    resolver: yupResolver(CommissionSchema),
    mode: 'all',
  });

  useEffect(() => {
    // setLoading(true);
    getOrgList(
      {
        searchKey: searchTerm,
      },
      (data: any) => {
        if (data) {
          setOrgList(data);
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      },
    );

    getActiveOrgList(
      (data: any) => {
        if (data) {
          setActiveOrgList(data);
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      },
    );
  }, [debouncedSearchTerm]);

  const handleClickMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    id?: any
  ) => {
    setSelectedId(id);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getOrgList(
      {
        searchKey: searchTerm,
        pageNo: newPage,
      },
      (data: any) => {
        if (data) {
          setOrgList(data);
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      },
    );
  };

  const handleSort = (property: keyof any) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortBy(property);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filters = () => {
    // dispatch(
    //   getUsersManagementList(
    //     {
    //       fromDate: dayjs(fromDate).valueOf() || 0,
    //       toDate: (toDate && dayjs(toDate).add(1, "day").valueOf()) || 0,
    //       ...(searchTerm && { searchKey: searchTerm }),
    //       status: status,
    //     },
    //     () => {}
    //   )
    // );
  };

  const resetFilters = () => {
    setFromDate(0);
    setToDate(0);
    setStatus('');
    // dispatch(
    //   getUsersManagementList(
    //     { ...(searchTerm && { searchKey: searchTerm }) },
    //     () => {}
    //   )
    // );
  };

  const getOrgListMethod = () => {
    getOrgList(
      {
        searchKey: searchTerm,
        pageNo: page,
      },
      (data: any) => {
        if (data) {
          if (status === 'active') {
            toast.success('Status has been updated successfully.');
          }
          setOrgList(data);
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      },
    );
  };

  const handleUserAction = (status: string) => {
    if (status === 'blocked') {
      blockOrg({ id: selectedId._id }, () => {
        toast.success('Status has been updated successfully.');
        setAnchorEl(null);
        getOrgListMethod();
      });
    } else {
      updateUserAction({ id: selectedId._id, type: status }, () => {
        toast.success('Status has been updated successfully.');
        setAnchorEl(null);
        getOrgListMethod();
      });
    }
  };

  const handleView = (item: any) => {
    navigate('/organisation-details', {
      state: {
        orgData: item,
      },
    });
  };

  const onSubmit = (data: any) => {
    // console.log("DDD=>", data);
    updateCommission(
      { ...data, orgIds: data.orgIds.map((item: any) => item.id) },
      () => {
        setOpenModel(!openModel);
        toast.success('Organisation Comission updated.');
      },
    );
  };

  useEffect(() => {
    const inputType: any = document.getElementById('commissionValue');
    // console.log(inputType)

    if (inputType) {
      inputType?.addEventListener('keypress', (evt: any) => {
        if (evt.which === 8) {
          return;
        }
        if (evt.which < 48 || evt.which > 57) {
          evt.preventDefault();
        }
      });
    }

    inputType?.addEventListener('keydown', function (e: any) {
      if (e.which === 38 || e.which === 40) {
        e.preventDefault();
      }
    });
  }, []);

  const handleDeleteBanner = () => {
    // console.log(selectedId)
    deleteORG(selectedId._id, () => {
      setAnchorEl(null);
      SetOpenDeleteModel(!openDeleteModel);
      toast.success('Organisation has been deleted.');
      getOrgListMethod();
    });
  };

  const handleReject = () => {
    updateUserAction({ id: selectedId._id, type: 'rejected', comment }, () => {
      setAnchorEl(null);
      setRejectModel(!rejectModel);
      getOrgListMethod();
    });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {/* {loading && <Loading />} */}
      <div className="pageBody">
        <PageHeading
          pageTitle="Organisation Management"
          buttonChildren={
            <div className="filterButton">
              <CustomButton
                size="medium"
                variant="contained"
                text="Add Commission"
                width="auto"
                id="submit"
                // disabled={load}
                onClick={() => setOpenModel(!openModel)}
                showIcon={false}
              />
              {/* <Filter
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  toDate={toDate}
                  setToDate={setToDate}
                  handleApply={filters}
                  handleReset={resetFilters}
                  labelText={"Status"}
                  statusField={true}
                  selectedValue={status}
                  options={["Active", "Blocked"]}
                  onChange={handleStatusChange}
                /> */}
            </div>
          }
        />

        <Stack className="flex row between">
          <SearchInput
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            endAdornment={
              <IconButton className="password-btn">
                <SearchIcon fontSize="medium" color="primary" />
              </IconButton>
            }
            id={''}
            name={''}
          />
          {/* <h4 className="colorPrimary">
            Total users | <strong>{usersList?.total}</strong>
          </h4> */}
        </Stack>

        {orgList?.data?.length ? (
          <Box className="mt-20 reelTableContainer">
            <TableContainer
              component={Paper}
              elevation={0}
              className="reelTable table_height"
            >
              <Table
                sx={{ minWidth: 650 }}
                aria-label="table"
                style={{ tableLayout: 'fixed' }}
                className="reelTable"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => {
                        handleSort('firstName');
                      }}
                    >
                      Org Name
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        handleSort('firstName');
                      }}
                    >
                      Owner Name
                    </TableCell>
                    <TableCell align="left" onClick={() => handleSort('email')}>
                      Org Number
                    </TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell
                      align="left"
                      onClick={() => handleSort('phoneNo')}
                    >
                      BusinessType
                    </TableCell>
                    {/* <TableCell align="left">Type</TableCell> */}

                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orgList?.data?.map((item: any) => {
                    return (
                      <TableRow
                        key={item?._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="td" scope="row" align="left">
                          <CustomButton
                            size="small"
                            variant="text"
                            text={item.orgName}
                            showIcon={false}
                            //   width="100%"
                            type="button"
                            id="add"
                            onClick={() => handleView(item)}
                          ></CustomButton>
                        </TableCell>
                        <TableCell component="td" scope="row" align="left">
                          {item?.ownerFName + ' ' + item?.ownerLName}
                        </TableCell>
                        <TableCell component="td" scope="row" align="left">
                          <CustomButton
                            size="small"
                            variant="text"
                            text={item.orgNumber}
                            showIcon={false}
                            //   width="100%"
                            type="button"
                            id="add"
                            onClick={() => handleView(item)}
                          ></CustomButton>
                        </TableCell>

                        <TableCell component="td" scope="row" align="left">
                          {/* {dayjs(item?.created).format("DD/MM/YYYY")} */}
                          {/* {item?.email} */}
                          <a
                            href={`mailto:${item?.email}`}
                            style={{
                              textDecoration: 'none',
                              color: '#5089AC',
                              fontWeight: '500',
                            }}
                          >
                            {item?.email}
                          </a>
                          {/* <CustomButton
                            size="small"
                            variant="text"
                            text={item.email}
                            showIcon={false}
                            //   width="100%"
                            type="button"
                            id="add"
                            // onClick={() => handleView(item)}
                          ></CustomButton> */}
                        </TableCell>

                        <TableCell component="td" scope="row" align="left">
                          {item?.businessType}
                        </TableCell>
                        {/* <TableCell component="td" scope="row" align="left">
                          {item?.type}
                        </TableCell> */}

                        <TableCell component="td" scope="row" align="center">
                          <div
                            className="status active"
                            style={{
                              color:
                                item.status === 'rejected'
                                  ? 'red'
                                  : item.status === 'pending'
                                  ? '#E3651D'
                                  : item.status === 'blocked'
                                  ? '#35374B'
                                  : '',
                              textAlign: 'center',
                              backgroundColor: '#F3F4F6',
                            }}
                          >
                            {capitalizeFirstLetter(item?.status)}
                          </div>
                        </TableCell>
                        <TableCell component="td" scope="row" align="right">
                          <div className="tableActions">
                            <Box>
                              <IconButton
                                onClick={(e) => handleClickMenu(e, item)}
                                // disabled={item.status === "active"}
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={() => handleClose()}
                                MenuListProps={{
                                  'aria-labelledby': 'basic-button',
                                }}
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}
                              >
                                {selectedId?.status !== 'active' &&
                                  selectedId?.status !== 'rejected' &&
                                  selectedId?.status !== 'blocked' && (
                                    <MenuItem
                                      onClick={() => handleUserAction('active')}
                                    >
                                      Approve
                                    </MenuItem>
                                  )}

                                {selectedId?.status === 'active' && (
                                  <MenuItem
                                    onClick={() => handleUserAction('blocked')}
                                  >
                                    Block
                                  </MenuItem>
                                )}

                                {selectedId?.status === 'blocked' && (
                                  <MenuItem
                                    onClick={() => handleUserAction('blocked')}
                                  >
                                    Active
                                  </MenuItem>
                                )}

                                {selectedId?.status !== 'rejected' &&
                                  selectedId?.status !== 'active' &&
                                  selectedId?.status !== 'blocked' && (
                                    <MenuItem
                                      onClick={() => {
                                        // SetOpenDeleteModel(!openDeleteModel);
                                        setRejectModel(!rejectModel);
                                      }}
                                    >
                                      Reject
                                    </MenuItem>
                                  )}
                                <MenuItem
                                  onClick={() => {
                                    SetOpenDeleteModel(!openDeleteModel);
                                  }}
                                >
                                  Delete
                                </MenuItem>
                              </Menu>
                            </Box>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {orgList?.totalItems > 10 && (
              <TablePagination
                count={orgList?.totalPages}
                onPageChange={handleChangePage}
                page={page}
              />
            )}
          </Box>
        ) : (
          <NoData className="mt_100" title="No Data to show yet!" />
        )}
      </div>

      {/* ADD COMMISSION BOX */}

      <Dialog open={openModel} sx={{ padding: '20px' }}>
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit((data) => onSubmit(data))}>
            <div className="dialog_title">
              <h3> Add Commision </h3>
            </div>
            <DialogContent sx={{ width: '520px' }}>
              {/* {children} */}
              <div className="dialog_subtitle">
                You can select multiple orgs to add the commission.
              </div>
              <Box my={4}>
                <div className="form">
                  <MUIAutoComplete
                    control={control}
                    labelText="Select Organisations"
                    name="orgIds"
                    id={'orgIds'}
                    defaultValue={[]}
                    height
                    multiple
                    limit={5}
                    keyName="name"
                    options={
                      activeOrgList?.map((item: any) => ({
                        name: item.orgName,
                        id: item._id,
                      })) || []
                    }
                    // limit={2}
                    setValue={setValue}
                    clearIcon
                    error={!!errors['orgIds'] ? errors['orgIds']?.message : ''}
                    placeHolderText={
                      getValues('orgIds')?.length > 0 ? '' : 'Select Orgs'
                    }
                  />

                  {/* <Grid item md={4} xs={12}> */}
                  <FormControl fullWidth error>
                    <FormLabel className="formLabel">
                      Commission Type <span style={{ color: 'red' }}>*</span>
                    </FormLabel>
                    <Controller
                      name="commissionType"
                      defaultValue={''}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="type"
                          displayEmpty
                          renderValue={(selected: any) => {
                            // console.log("SSSS=", selected)
                            if (!selected) {
                              return (
                                <p
                                  style={{
                                    color: 'grey',
                                    fontSize: '13px',
                                    opacity: 0.6,
                                  }}
                                >
                                  Select Commission type
                                </p>
                              );
                            }

                            return selected;
                          }}
                          fullWidth
                          error={!!errors['commissionType']}
                          // disabled={!editMode}
                          // IconComponent={editMode ? undefined : () => null}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                // maxHeight: '320px',
                              },
                            },
                          }}
                        >
                          {['Flat', 'Percentage'].map((item: any) => {
                            return (
                              <MenuItem value={item} key={'item'}>
                                {item}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                    />

                    <FormHelperText>
                      {!!errors['commissionType']
                        ? errors['commissionType'].message
                        : ''}
                    </FormHelperText>
                  </FormControl>
                  {/* </Grid> */}

                  <InputField
                    requiredField
                    type="number"
                    id="commissionValue"
                    label="Commission Value"
                    name="commissionValue"
                    control={control}
                    error={!!errors['commissionValue']}
                    helperText={
                      !!errors['commissionValue']
                        ? errors['commissionValue'].message
                        : ``
                    }
                    // value={commissionValue ? commissionValue  : ''}
                  />
                </div>
              </Box>
            </DialogContent>
            <DialogActions>
              <CustomButton
                // onClick?= () =>
                // onClick={() => handleEdit(edit)}
                size="large"
                variant="contained"
                text={'Save'}
                loading={loading}
                showIcon={false}
                //   width="100%"
                type="submit"
                id="add"
                // loading={load}
                // disabled={!isValid}
              />
              <CustomButton
                // onClick?= () =>
                onClick={() => {
                  setOpenModel(!openModel);
                  reset();
                }}
                size="large"
                variant="outlined"
                text={'Cancel'}
                loading={loading}
                showIcon={false}
                //   width="100%"
                // type="submit"
                id="add"
                // loading={load}
                // disabled={!isValid}
              />
            </DialogActions>
          </form>
        </Box>
      </Dialog>

      {/* REJECT DAILOG BOX  */}

      <Dialog
        open={rejectModel}
        // maxWidth="lg"
        // onClose={() => setOpenModel(!openModel)}
        sx={{ padding: '20px' }}
      >
        <Box sx={{ p: 3 }}>
          {/* <form onSubmit={handleSubmit((data) => onSubmit(data))}> */}
          <div className="dialog_title">
            <h3> Reject Comment </h3>
          </div>
          <DialogContent>
            {/* {children} */}
            <div className="dialog_subtitle">
              Add comment why are you reject this organisation ?
            </div>
            <Box my={4}>
              <div className="form">
                <InputField
                  // requiredField
                  type="text"
                  id="commissionValue"
                  label="Comment"
                  name="comment"
                  onChange={(e: any) => {
                    setComment(e.target.value);
                  }}

                  // value={commissionValue ? commissionValue  : ''}
                />
              </div>
            </Box>
          </DialogContent>
          <DialogActions>
            <CustomButton
              onClick={handleReject}
              size="large"
              variant="contained"
              text={'Save'}
              loading={loading}
              showIcon={false}
              type="submit"
              id="add"
            />
            <CustomButton
              onClick={() => {
                setRejectModel(!rejectModel);
              }}
              size="large"
              variant="outlined"
              text={'Cancel'}
              loading={loading}
              showIcon={false}
              id="add"
            />
          </DialogActions>
          {/* </form> */}
        </Box>
      </Dialog>

      {/* ---------DELETE WARNING DAILOG ---------------- */}

      <WarningDialog
        open={openDeleteModel}
        handleClose={() => {
          setAnchorEl(null);
          SetOpenDeleteModel(false);
        }}
        title="Delete"
        description="Do you want to delete this Organisation ?"
        type="delete"
        onClick={() => handleDeleteBanner()}
        cancelBtnText="Cancel"
        confirmBtnText="Delete"
      />
    </>
  );
}
