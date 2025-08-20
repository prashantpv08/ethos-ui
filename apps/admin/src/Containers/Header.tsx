import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import Images from '../Utils/images';
import React, { useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { resetAuthorizationToken } from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../helpers/contants';
import { postApiCall } from '../api/methods';
import endPoints from '../api/endpoint';
import { AxiosResponse } from 'axios';
import { notify } from '../Utils/toastify';

export default function Header(): JSX.Element {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userDetails = {} as any;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (action: string) => {
    if (action === 'logout') {
      postApiCall(
        endPoints.logout,
        {},
        () => {
          localStorage.clear();
          resetAuthorizationToken();
          navigate(ROUTES.LOGIN);
        },
        (e: any) => {
          if (e?.data && e?.data.message) {
            console.log(e.data.message);
          } else {
            notify(null, 'error');
          }
        }
      );
    }

    setAnchorEl(null);
  };

  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo">
        {/* <img src={Images.LOGO} alt="Logo" /> */}
        <h1>Logo</h1>
      </div>
      <div className="authAction">
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <div className="userDropdown">
            <Avatar
              alt="User name"
              src={
                // userDetails?.profilePicture
                //   ? userDetails?.profilePicture
                //   : Images.AUTH_BG_1
                userDetails?.profilePicture
                  ? userDetails.profilePicture
                  : userData?.profilePicture
                  ? userData.profilePicture
                  : Images.AUTH_BG_1
              }
            />
            {/* IN CASE OF NO IMAGE AVAULABLE */}
            {/* <Avatar>H</Avatar> */}
            <div className="info">
              <h4>
                {userData?.type}
                {/* {userDetails.ownerFName
                  ? userDetails.ownerFName
                  : userData.ownerFName}{" "}
                {userDetails.ownerLName
                  ? userDetails.ownerLName
                  : userData.ownerLName} */}
              </h4>
              <p>{userDetails?.email ? userDetails.email : userData.email}</p>
            </div>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </div>
        </Button>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'user-button',
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
          {/* <MenuItem
            onClick={() => {
              navigate(ROUTES.EDIT_PROFILE)
            }}
          >
            Profile
          </MenuItem> */}
          {/* <MenuItem onClick={() => handleClose('')}>My account</MenuItem> */}
          <MenuItem onClick={() => handleClose('logout')}>Logout</MenuItem>
        </Menu>
      </div>
    </header>
  );
}
