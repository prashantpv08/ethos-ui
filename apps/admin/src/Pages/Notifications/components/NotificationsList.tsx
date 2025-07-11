// import { Box, Chip, Dialog, DialogActions, DialogContent, MenuItem, Stack, Tab, Tabs } from '@mui/material'
// import PageHeading from '../../../Components/PageHaeding'
// import React, { useEffect } from 'react'
// import CustomButton from '../../../Components/CustomButton'
// import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
// import CustomTable from '../../../Components/CustomTable'
// import { useNavigate } from 'react-router-dom'
// import { ROUTES } from '../../../helpers/contants'
// import { useDispatch } from 'react-redux'
// import NoData from '../../../Components/Nodata'
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { IconButton, Menu } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import TablePagination from '../../../Components/Pagination'
// import Images from '../../../Utils/images'
// import InputField from '../../../Components/Input'
// import Textarea from '../../../Components/Textarea'

// export default function NotificationsList() {
//   const [value, setValue] = React.useState(0)
//   const dispatch = useDispatch()

//   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//     setValue(newValue)
//   }
//   const navigate = useNavigate()

//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const [openDialog, setOpenDialog] = React.useState(false);
//   const handleCloseDoalog = () => {
//     setOpenDialog(false)
//   }
//   return (
//     <div className="pageBody">
//       <PageHeading
//         pageTitle="Vendor Management"
//       />
//     <Stack className="flex row between">
//       <SearchInput placeholder="Search by name, and email"
//         endAdornment={
//         <IconButton className="password-btn">
//           <SearchIcon fontSize="medium" color="primary" />
//         </IconButton>} id={''} name={''}      />

//         <div className='flex gap_10'>
//         <CustomButton
//                 onClick={() => navigate(ROUTES.ADD_NOTIFICATIONS)}
//                 size="large"
//                 variant="contained"
//                 text={'Add New Notification'}
//                 showIcon={false}
//                 //   width="100%"
//                 type="submit"
//                 id="add"
//               // loading={load}
//               // disabled={!isValid}
//               />
//                <div className="filterButton">
//                 <Filter />
//               </div>
//         </div>
//       </Stack>
//       <div className="tabs mt-20">
//         <Box sx={{ width: '100%' }}>
//           <Box sx={{ width: '100%' }} padding={0}>

//             <TableContainer component={Paper} elevation={0} >
//                   <Table sx={{ minWidth: 650 }} aria-label="table" className='reelTable'>
//                     <TableHead>
//                       <TableRow>

//                         <TableCell>Vendor</TableCell>
//                         <TableCell align="left">Email</TableCell>
//                         <TableCell align="left">Firm</TableCell>
//                         <TableCell align="left">Type</TableCell>
//                         <TableCell align="left">Location</TableCell>
//                         <TableCell align="left">Total Revenue</TableCell>
//                         <TableCell align="center">Status</TableCell>
//                         <TableCell align="right">Action</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>

//                       <TableRow
//                         key={''}
//                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                       >

//                         <TableCell component="td" scope="row" align="left">
//                         <CustomButton
//                             size="small"
//                             variant="text"
//                             text={'John Mathew'}
//                             showIcon={false}
//                             //   width="100%"
//                             type="button"
//                             id="add"
//                             onClick={()=> navigate(ROUTES.VENDOR_PROFILE)}
//                           ></CustomButton>
//                         </TableCell>
//                         <TableCell component="td" scope="row" align="left">mxinc_us@yopmail.com</TableCell>
//                         <TableCell component="td" scope="row" align="left">Amy Production Inc.</TableCell>
//                         <TableCell component="td" scope="row" align="left">Publicly-listed</TableCell>
//                         <TableCell component="td" scope="row" align="left">Anniston, AL</TableCell>
//                         <TableCell component="td" scope="row" align="left">200,000.00</TableCell>
//                         <TableCell component="td" scope="row" align="center">
//                           <div className="status active">Active</div>
//                         </TableCell>
//                         <TableCell component="td" scope="row" align="right">
//                           <div className="tableActions">
//                             <Box>
//                               <IconButton
//                                 onClick={handleClickMenu}
//                               >
//                                 <MoreVertIcon />
//                               </IconButton>
//                               <Menu
//                                 id="basic-menu"
//                                 anchorEl={anchorEl}
//                                 open={open}
//                                 onClose={() => handleClose()}
//                                 MenuListProps={{
//                                   'aria-labelledby': 'basic-button',
//                                 }}
//                               >
//                                 <MenuItem onClick={handleClose}>View</MenuItem>
//                                 <MenuItem onClick={handleClose}>Resend</MenuItem>
//                                 <MenuItem onClick={handleClose}>Remove</MenuItem>
//                               </Menu>
//                             </Box>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                       <TableRow
//                         key={''}
//                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                       >

//                         <TableCell component="td" scope="row" align="left">
//                         <CustomButton
//                             size="small"
//                             variant="text"
//                             text={'John Mathew'}
//                             showIcon={false}
//                             //   width="100%"
//                             type="button"
//                             id="add"
//                             onClick={()=> navigate(ROUTES.VENDOR_PROFILE)}
//                           ></CustomButton>
//                         </TableCell>
//                         <TableCell component="td" scope="row" align="left">mxinc_us@yopmail.com</TableCell>
//                         <TableCell component="td" scope="row" align="left">Amy Production Inc.</TableCell>
//                         <TableCell component="td" scope="row" align="left">Publicly-listed</TableCell>
//                         <TableCell component="td" scope="row" align="left">Anniston, AL</TableCell>
//                         <TableCell component="td" scope="row" align="left">200,000.00</TableCell>
//                         <TableCell component="td" scope="row" align="left">
//                           <div className="status in_active">Inactive</div>
//                         </TableCell>
//                         <TableCell component="td" scope="row" align="right">
//                           <div className="tableActions">
//                             <Box>
//                               <IconButton
//                                 onClick={handleClickMenu}
//                               >
//                                 <MoreVertIcon />
//                               </IconButton>
//                               <Menu
//                                 id="basic-menu"
//                                 anchorEl={anchorEl}
//                                 open={open}
//                                 onClose={() => handleClose()}
//                                 MenuListProps={{
//                                   'aria-labelledby': 'basic-button',
//                                 }}
//                               >
//                                 <MenuItem onClick={handleClose}>View</MenuItem>
//                                 <MenuItem onClick={handleClose}>Resend</MenuItem>
//                                 <MenuItem onClick={handleClose}>Remove</MenuItem>
//                               </Menu>
//                             </Box>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>

//                   </Table>
//                   {/* <NoData
//                heading="No Products added yet!"
//                title="You have not added any products yet."
//                buttonText="Add New Product"
//               //  handleClick?: () => void
//               /> */}
//                 </TableContainer>
//           </Box>
//         </Box>
//       </div>

//       <Dialog open={openDialog} onClose={handleCloseDoalog} sx={{ padding: '20px' }} maxWidth='sm' fullWidth={true}>
//         <Box sx={{ p: 3 }}>
//           <form>
//             <div className='dialog_title'>
//               <h3>Reject Request</h3>
//             </div>
//             <DialogContent sx={{ padding: 0 }}>

//               <div className='dialogPara'>
//                 <p>Are you sure want to reject this vendor registration request?</p>
//               </div>
//               <Box my={4}>
//                 <div className="form">
//                   <InputField
//                     requiredField
//                     id="title"
//                     label="Rejection Reason"
//                     name="title"
//                   />

//                   <Textarea
//                     id='description'
//                     label='Description'
//                     name='description'
//                     placeholder='Reason of cancellation'
//                     requiredField
//                     rows={4}
//                   />
//                 </div>
//               </Box>
//             </DialogContent>
//             <DialogActions>
//               <CustomButton
//                 // onClick?= () =>
//                 size="large"
//                 variant="outlined"
//                 text={'Cancel'}
//                 showIcon={false}
//                 //   width="100%"
//                 type="submit"
//                 id="add"
//               // loading={load}
//               // disabled={!isValid}
//               />
//               <CustomButton
//                 // onClick?= () =>
//                 size="large"
//                 variant="contained"
//                 text={'Continue'}
//                 showIcon={false}
//                 //   width="100%"
//                 type="submit"
//                 id="add"
//               // loading={load}
//               // disabled={!isValid}
//               />
//             </DialogActions>
//           </form>
//         </Box>
//       </Dialog>
//     </div>
//   )
// }
