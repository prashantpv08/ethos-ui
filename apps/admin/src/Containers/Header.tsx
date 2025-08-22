import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import Images from '../Utils/images';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { resetAuthorizationToken } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../helpers/contants';
import { postApiCall } from '../api/methods';
import endPoints from '../api/endpoint';
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
    <header className="flex items-center justify-between bg-white px-4 py-2 border-b">
      <div className="text-xl font-semibold">Logo</div>
      <div className="flex items-center">
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <div className="flex items-center gap-2">
            <Avatar
              alt="User name"
              src={
                userDetails?.profilePicture
                  ? userDetails.profilePicture
                  : userData?.profilePicture
                  ? userData.profilePicture
                  : Images.AUTH_BG_1
              }
            />
            <div className="hidden sm:block text-left">
              <h4 className="text-sm font-medium">{userData?.type}</h4>
              <p className="text-xs">
                {userDetails?.email ? userDetails.email : userData.email}
              </p>
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
          <MenuItem onClick={() => handleClose('logout')}>Logout</MenuItem>
        </Menu>
      </div>
    </header>
  );
}
