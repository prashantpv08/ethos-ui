import { Avatar, Divider, Menu, MenuItem, Skeleton } from '@mui/material';
import styles from './Layout.module.scss';
import { useNavigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { useUser } from '../context/user';
import { Iconbutton, Label, Switch } from '@ethos-frontend/ui';
import {
  AccountCircleOutlined,
  ArrowDropDown,
  Logout,
  Settings,
} from '@mui/icons-material';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useRestMutation } from '@ethos-frontend/hook';
import {
  API_METHODS,
  API_URL,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@ethos-frontend/constants';
import { useTranslation } from 'react-i18next';

interface IHeader {
  loading: boolean;
}
export const Header = ({ loading }: IHeader) => {
  const { setUserData, userData } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const client = useApolloClient();
  const queryClient = useQueryClient();

  const [closeRestaurant, setCloseRestaurant] = useState<boolean>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (userData) setCloseRestaurant(userData?.isEnabled);
  }, [userData]);

  const ownerFullName = userData?.ownerFName
    ? `${userData?.ownerFName} ${userData?.ownerLName}`
    : null;

  const { isPending, mutate } = useRestMutation(
    API_URL.profile,
    {
      method: API_METHODS.PUT,
    },
    {
      onSuccess: (res) => {
        setCloseRestaurant(res.data.isEnabled);
        toast.success(
          `${res.data.isEnabled ? SUCCESS_MESSAGES.RESTAURANT_OPEN : SUCCESS_MESSAGES.RESTAURANT_CLOSED}`,
        );
      },
      onError: () => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      },
    },
  );

  const handleCloseRestaurant = (e: ChangeEvent<HTMLInputElement>) => {
    mutate({ isEnabled: e.target.checked });
  };

  const { mutate: callLogout, isPending: isLoggingOut } = useRestMutation(
    API_URL.logout,
    { method: API_METHODS.POST },
    {
      onSuccess: () => {
        queryClient.cancelQueries();
        queryClient.clear();
        client.stop();
        client.clearStore();
        localStorage.clear();
        setUserData(undefined);
        navigate('/auth/login');
        toast.success(t(SUCCESS_MESSAGES.LOGOUT));
      },
      onError: () => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      },
    },
  );

  return (
    <header className={styles.header}>
      {loading ? (
        <div className="flex justify-between items-center">
          <Skeleton animation="wave" width="30%" />
          <div className="flex items-center gap-4 justify-end flex-1">
            <Skeleton animation="wave" width="10%" />
            <Skeleton variant="circular" width={40} height={40} />
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <Label variant="subtitle1">
            {t('restaurantName')}: <strong>{userData?.restaurantName}</strong>
          </Label>
          <div className="flex items-center">
            {userData?.type === 'ORGANISATION' ? (
              <div className={styles.closeRestaurant}>
                <Label variant="subtitle2" className="pr-3" weight="medium">
                  {t('openForOrder')}
                </Label>
                <div className="flex">
                  <Switch
                    checked={closeRestaurant}
                    onChange={handleCloseRestaurant}
                    disabled={isPending}
                  />
                </div>
              </div>
            ) : null}
            <Divider
              sx={{ height: 20 }}
              orientation="vertical"
              variant="middle"
            />
            <div
              className="flex items-center cursor-pointer pl-4"
              onClick={handleClick}
            >
              <Label variant="subtitle1" className="pr-4">
                {ownerFullName}
              </Label>
              <div className={styles.avatar}>
                <div className={styles.logo}>
                  <Avatar
                    src={userData?.imageUrl}
                    alt={ownerFullName || ''}
                    sx={{ bgcolor: 'grey' }}
                  >
                    {ownerFullName?.split('')[0]}
                  </Avatar>
                </div>
                <ArrowDropDown />
              </div>
            </div>
          </div>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem
              onClick={() => {
                navigate('/account/profile');
                handleClose();
              }}
            >
              <Iconbutton MuiIcon={AccountCircleOutlined} />
              <Label className="pl-2" variant="subtitle2">
                {t('navigation.account')}
              </Label>
            </MenuItem>
            {userData?.role !== 'EMPLOYEE' ? (
              <MenuItem
                onClick={() => {
                  navigate('/account/settings');
                  handleClose();
                }}
              >
                <Iconbutton MuiIcon={Settings} />
                <Label className="pl-2" variant="subtitle2">
                  {t('navigation.settings')}
                </Label>
              </MenuItem>
            ) : null}
            <Divider />
            <MenuItem
              disabled={isLoggingOut}
              onClick={() => {
                handleClose();
                callLogout(undefined);
              }}
            >
              <Iconbutton MuiIcon={Logout} />
              <Label className="pl-2" variant="subtitle2">
                {t('navigation.logout')}
              </Label>
            </MenuItem>
          </Menu>
        </div>
      )}
    </header>
  );
};
