// @ts-nocheck
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import InputCheckbox from './CheckBox';
import { IconButton } from '@mui/material';
import Images from '../Utils/images';
import TablePagination from './Pagination';

interface Props {
  buttonChildren?: JSX.Element | JSX.Element[];
  pageTitle?: string;
}

function createData(
  check: unknown,
  productId: string,
  productName: string,
  category: string,
  purpose: string,
  skuCode: string,
  inventory: string,
  price: number,
  actions?: unknown
) {
  return {
    check,
    productId,
    productName,
    category,
    purpose,
    skuCode,
    inventory,
    price,
    actions,
  };
}
const rows = [
  createData(
    <InputCheckbox id="" name="" />,
    'RT-01X-TRAK',
    'EOS 5D Mark IV Kit (EF 24 - 105 II USM)',
    'Camera',
    'Purchase & Rent',
    'DS-2121',
    '20 Pcs.',
    10000,
    <div className="tableActions">
      <IconButton className="btn_edit">
        <img src={Images.EDIT_IC} alt="Edit" />
      </IconButton>
      <IconButton className="btn_delete">
        <img src={Images.TRASH} alt="Delete" />
      </IconButton>
    </div>
  ),
  createData(
    <InputCheckbox id="" name="" />,
    'RT-01X-TRAK',
    'EOS 5D Mark IV Kit (EF 24 - 105 II USM)',
    'Camera',
    'Purchase & Rent',
    'DS-2121',
    '20 Pcs.',
    10000,
    <div className="tableActions">
      <IconButton className="btn_edit">
        <img src={Images.EDIT_IC} alt="Edit" />
      </IconButton>
      <IconButton className="btn_delete">
        <img src={Images.TRASH} alt="Delete" />
      </IconButton>
    </div>
  ),
  createData(
    <InputCheckbox id="" name="" />,
    'RT-01X-TRAK',
    'EOS 5D Mark IV Kit (EF 24 - 105 II USM)',
    'Camera',
    'Purchase & Rent',
    'DS-2121',
    '20 Pcs.',
    10000,
    <div className="tableActions">
      <IconButton className="btn_edit">
        <img src={Images.EDIT_IC} alt="Edit" />
      </IconButton>
      <IconButton className="btn_delete">
        <img src={Images.TRASH} alt="Delete" />
      </IconButton>
    </div>
  ),
  createData(
    <InputCheckbox id="" name="" />,
    'RT-01X-TRAK',
    'EOS 5D Mark IV Kit (EF 24 - 105 II USM)',
    'Camera',
    'Purchase & Rent',
    'DS-2121',
    '20 Pcs.',
    10000,
    <div className="tableActions">
      <IconButton className="btn_edit">
        <img src={Images.EDIT_IC} alt="Edit" />
      </IconButton>
      <IconButton className="btn_delete">
        <img src={Images.TRASH} alt="Delete" />
      </IconButton>
    </div>
  ),
  createData(
    <InputCheckbox id="" name="" />,
    'RT-01X-TRAK',
    'EOS 5D Mark IV Kit (EF 24 - 105 II USM)',
    'Camera',
    'Purchase & Rent',
    'DS-2121',
    '20 Pcs.',
    10000,
    <div className="tableActions">
      <IconButton className="btn_edit">
        <img src={Images.EDIT_IC} alt="Edit" />
      </IconButton>
      <IconButton className="btn_delete">
        <img src={Images.TRASH} alt="Delete" />
      </IconButton>
    </div>
  ),
  createData(
    <InputCheckbox id="" name="" />,
    'RT-01X-TRAK',
    'EOS 5D Mark IV Kit (EF 24 - 105 II USM)',
    'Camera',
    'Purchase & Rent',
    'DS-2121',
    '20 Pcs.',
    10000,
    <div className="tableActions">
      <IconButton className="btn_edit">
        <img src={Images.EDIT_IC} alt="Edit" />
      </IconButton>
      <IconButton className="btn_delete">
        <img src={Images.TRASH} alt="Delete" />
      </IconButton>
    </div>
  ),
  createData(
    <InputCheckbox id="" name="" />,
    'RT-01X-TRAK',
    'EOS 5D Mark IV Kit (EF 24 - 105 II USM)',
    'Camera',
    'Purchase & Rent',
    'DS-2121',
    '20 Pcs.',
    10000,
    <div className="tableActions">
      <IconButton className="btn_edit">
        <img src={Images.EDIT_IC} alt="Edit" />
      </IconButton>
      <IconButton className="btn_delete">
        <img src={Images.TRASH} alt="Delete" />
      </IconButton>
    </div>
  ),
];

export default function CustomTable(props: Props) {
  return (
    <div className="reelTableContainer">
      <TableContainer
        component={Paper}
        elevation={0}
        className="reelTable table_height"
      >
        <Table sx={{ minWidth: 650 }} aria-label="table" className="reelTable">
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell align="left">Product Name</TableCell>
              <TableCell align="left">Category</TableCell>
              <TableCell align="left">Purpose</TableCell>
              <TableCell align="left">SKU Code</TableCell>
              <TableCell align="left">Inventory</TableCell>
              <TableCell align="left">Price</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="td" scope="row" align="left">
                  {row.productId}
                </TableCell>
                <TableCell component="td" scope="row" align="left">
                  {row.productName}
                </TableCell>
                <TableCell component="td" scope="row" align="left">
                  {row.category}
                </TableCell>
                <TableCell component="td" scope="row" align="left">
                  {row.purpose}
                </TableCell>
                <TableCell component="td" scope="row" align="left">
                  {row.skuCode}
                </TableCell>
                <TableCell component="td" scope="row" align="left">
                  {row.inventory}
                </TableCell>
                <TableCell component="td" scope="row" align="left">
                  {row.price}
                </TableCell>
                <TableCell component="td" scope="row" align="right">
                  {row?.actions}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination />
    </div>
  );
}
