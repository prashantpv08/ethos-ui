import { ItemsDetail } from '../Common';
import { Heading, Iconbutton } from '@ethos-frontend/ui';
import styles from './account.module.scss';
import { GridContainer } from '@ethos-frontend/components';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { ChangePassword } from './changePassword';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { IUserData } from '../../context/user';
import { Language } from './language';
import { useTranslation } from 'react-i18next';
import { ROLES } from '@ethos-frontend/constants';
import { tabPanelClasses } from '@mui/lab';

interface IProfileDetails {
  businessDetail: IUserData | undefined;
  setIsPhotoModal: (value: boolean) => void;
}

export const ProfileDetails = ({
  businessDetail,
  setIsPhotoModal,
}: IProfileDetails) => {
  const { t } = useTranslation();
  const { isDesktop, isMobile } = useResponsive();
  const router = useNavigate();
  const details = [
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.businessName'),
      description: businessDetail?.orgName,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.businessType'),
      description: businessDetail?.businessType,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('restaurantName'),
      description: businessDetail?.restaurantName,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.registrationNumber'),
      description: businessDetail?.orgNumber,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.representativeFullName'),
      description: `${businessDetail?.ownerFName} ${businessDetail?.ownerLName}`,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.email'),
      description: businessDetail?.email,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.phoneNumber'),
      description: businessDetail?.phone,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.vat'),
      description: businessDetail?.taxNumber,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.preferredLanguage'),
      description: businessDetail?.lang,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.currency'),
      description: `${businessDetail?.currency?.code} (${businessDetail?.currency?.symbol})`,
    },
  ];

  const companyDetails = [
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.address'),
      description: businessDetail?.address,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.zipcode'),
      description: businessDetail?.zipcode,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.city'),
      description: businessDetail?.city,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.state'),
      description: businessDetail?.state,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: t('account.profileTab.country'),
      description: businessDetail?.country,
    },
  ];

  return (
    <GridContainer columns={12} columnGap="16px">
      {businessDetail?.role !== 'EMPLOYEE' ? (
        <div
          date-item
          data-span={getNumberOfCols({
            isMobile,
            isDesktop,
            desktopCol: 2,
            mobileCol: 12,
          })}
          className={styles.left}
        >
          <div className={styles.restaurantLogo}>
            <span>
              {businessDetail?.imageUrl ? (
                <img src={businessDetail?.imageUrl} alt="Restaurant Logo" />
              ) : (
                <Avatar
                  src="/broken-image.jpg"
                  sx={{ height: '100%', width: '100%' }}
                  variant="square"
                />
              )}
            </span>
            <Iconbutton
              name="edit"
              className={styles.editBtn}
              variant="secondary"
              onClick={() => setIsPhotoModal(true)}
            />
          </div>
        </div>
      ) : null}
      <div
        date-item
        data-span={getNumberOfCols({
          isMobile,
          isDesktop,
          desktopCol: 10,
          mobileCol: 12,
        })}
      >
        {businessDetail?.role !== ROLES.EMPLOYEE ? (
          <>
            <div
              className={`flex justify-between items-center mb-4 pb-4 ${styles.headingBorder}`}
            >
              <Heading variant="h4" weight="semibold">
                {t('account.profileTab.companyDetails')}
              </Heading>
              <Iconbutton
                name="edit"
                onClick={() => router('/account/profile/edit')}
                text={t('account.profileTab.editProfile')}
              />
            </div>
            <ItemsDetail details={details} />

            <div className="py-6">
              <Heading
                variant="h4"
                weight="semibold"
                className={`pb-4 !mb-4 ${styles.headingBorder}`}
              >
                {t('account.profileTab.companyAddress')}
              </Heading>
              <ItemsDetail details={companyDetails} />
            </div>
          </>
        ) : null}
        <ChangePassword />
        {businessDetail?.role !== ROLES.EMPLOYEE ? <Language /> : null}
      </div>
    </GridContainer>
  );
};
