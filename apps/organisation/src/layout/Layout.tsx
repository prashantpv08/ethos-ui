import Logo from '../assets/logo.svg?react';
import SmallLogo from '../assets/smallLogo.svg?react';
import styles from './Layout.module.scss';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { Heading, Iconbutton } from '@ethos-frontend/ui';
import { generateMenuItems } from '../utils/permission';
import { AppRoutes } from '../routes/appRoutes';
import { useRestQuery } from '@ethos-frontend/hook';
import { useUser } from '../context/user';
import { Header } from './header';
import { GridContainer } from '@ethos-frontend/components';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { ModulesConfig } from '../routes';
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { API_URL, ROLES } from '@ethos-frontend/constants';
import i18n from '@ethos-frontend/i18n';
import { useQuery } from '@apollo/client';
import { GET_INTERFACE_LANGUAGE } from '@organisation/api/queries/Account';
import { toast } from 'react-toastify';

export const Layout = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { isMobile, isDesktop } = useResponsive();
  const { setUserData, setLoading, setError, loading, userData } = useUser();
  const userType = userData?.type || '';
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [toggleNavigation, setToggleNavigation] = useState(false);
  const token = localStorage.getItem('token');

  const {
    data: loginUserData,
    isLoading: userLoading,
    error,
  } = useRestQuery('userProfile', API_URL.profile, {
    enabled: Boolean(token) && !userData,
  });

  const { data: accountData, loading: interfaceLanguageLoading } = useQuery(
    GET_INTERFACE_LANGUAGE,
    {
      skip: !userData,
      onError: (err) => {
        toast.error(t('errors.general'));
      },
    },
  );

  const { data: getStripeStatus, isLoading: loadingStripeStatus } =
    useRestQuery('stripe-status', API_URL.stripeStatus, {
      enabled: !userLoading && userType === ROLES.ORGANISATION,
    });

  useEffect(() => {
    const toggle = localStorage.getItem('toggle');
    setToggleNavigation(toggle === 'false' ? false : true);
  }, []);

  useEffect(() => {
    setLoading(userLoading || loadingStripeStatus || interfaceLanguageLoading);
    
    if (loginUserData || getStripeStatus || accountData) {
      let userData;
      if (loginUserData?.data?.role === ROLES.EMPLOYEE) {
        userData = {
          ownerFName: loginUserData?.data?.firstName,
          ownerLName: loginUserData?.data?.lastName,
          role: loginUserData?.data?.role,
          ...loginUserData?.data,
        };
      } else {
        userData = {
          ...loginUserData?.data,
          ...getStripeStatus?.data,
        };
      }
      userData = {
        ...userData,
        interfaceLanguage: accountData?.account.data.language,
      };
      localStorage.setItem(
        'interface_lang',
        JSON.stringify(accountData?.account.data?.language) || '[]',
      );
      const systemLanguage = loginUserData?.data.lang || 'en';
      i18n.changeLanguage(systemLanguage);
      setUserData(userData);
    }
    if (error) {
      setError(error);
    }
  }, [loginUserData, userLoading, error, loadingStripeStatus, accountData]);

  useEffect(() => {
    if (userData) {
      const updatedOpenMenus = { ...openMenus };
      const dynamicModulesConfig = ModulesConfig(userData);
      Object.keys(dynamicModulesConfig).forEach((key) => {
        const moduleConfig = dynamicModulesConfig?.[key];
        if (moduleConfig.children) {
          moduleConfig.children.forEach((child: { path: string }) => {
            if (location.pathname.startsWith(child.path)) {
              updatedOpenMenus[key] = true;
            }
          });
        }
      });
      setOpenMenus(updatedOpenMenus);
    }
  }, [location.pathname]);

  const userAccess = loginUserData?.data?.access ?? [];
  const dynamicModulesConfig = userData && ModulesConfig(userData);

  const { overviewItems, managementItems, supportsLanguageTabs } =
    generateMenuItems(
      userAccess,
      userType,
      openMenus,
      setOpenMenus,
      styles,
      Iconbutton,
      location,
      toggleNavigation,
      dynamicModulesConfig,
    );

  const showDashboardMenu = (
    <div className={styles.overview}>
      <ul>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : '')}
            to="/"
          >
            <Iconbutton name="dashboard" /> {t('navigation.dashboard')}
          </NavLink>
        </li>
      </ul>
    </div>
  );

  if (!userData) {
    return <CircularProgress />;
  }

  return (
    <GridContainer
      columns={getNumberOfCols({
        isDesktop,
        isMobile,
        desktopCol: toggleNavigation ? 22 : 12,
        mobileCol: 12,
      })}
      className={styles.layout}
      columnGap="0"
      rowGap="0"
    >
      <aside
        data-item
        data-span={getNumberOfCols({
          isDesktop,
          isMobile,
          desktopCol: toggleNavigation ? 1 : 2,
          mobileCol: 3,
        })}
        className={`${styles.sidebar} ${
          toggleNavigation ? styles.closeNavigation : styles.openNavigation
        }`}
      >
        <Link className={styles.logo} to={'/'}>
          {toggleNavigation ? <SmallLogo /> : <Logo />}
        </Link>
        <div className={styles.shrinkBtn}>
          <Iconbutton
            MuiIcon={
              toggleNavigation
                ? ArrowForwardIosOutlined
                : ArrowBackIosNewOutlined
            }
            size="large"
            iconColor="grey"
            title="Close navigation"
            onClick={() => {
              setToggleNavigation(!toggleNavigation);
              localStorage.setItem(
                'toggle',
                !toggleNavigation ? 'true' : 'false',
              );
            }}
          />
        </div>

        {userLoading ? (
          <CircularProgress size={30} color="inherit" />
        ) : (
          <>
            {showDashboardMenu}
            {overviewItems.length ? (
              <div className={styles.overview}>
                <Heading
                  className={`pb-5 pl-2 uppercase ${styles.menuTitle}`}
                  variant="subtitle2"
                  weight="medium"
                  color={'#7c7c7c'}
                >
                  {t('navigation.setup')}
                </Heading>
                <ul>{overviewItems}</ul>
              </div>
            ) : null}
            {managementItems.length ? (
              <div className={styles.management}>
                <Heading
                  className={`pb-5 pl-2 uppercase ${styles.menuTitle}`}
                  variant="subtitle2"
                  weight="medium"
                  color={'#7c7c7c'}
                >
                  {t('navigation.management')}
                </Heading>
                <ul>{managementItems}</ul>
              </div>
            ) : null}
          </>
        )}
      </aside>
      <div
        data-item
        data-span={getNumberOfCols({
          isDesktop,
          isMobile,
          desktopCol: toggleNavigation ? 21 : 10,
          mobileCol: toggleNavigation ? 11 : 9,
        })}
        className={styles.content}
      >
        <Header loading={loading} />
        <main className={styles.main}>
          <AppRoutes supportsLanguageTabs={supportsLanguageTabs} />
        </main>
      </div>
    </GridContainer>
  );
};
