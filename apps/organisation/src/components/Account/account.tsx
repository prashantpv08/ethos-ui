import { TabContext, TabList, TabPanel } from '@mui/lab';
import { CircularProgress, Tab } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAxios } from '../../api';
import { API_METHODS, API_URL, ROLES, SUCCESS_MESSAGES } from '@ethos-frontend/constants';
import styles from './account.module.scss';
import { Iconbutton, Modal, PrimaryButton } from '@ethos-frontend/ui';
import AccountPreferences from './accountPreferences';
import { Link, useLocation } from 'react-router-dom';
import { ProfileDetails } from './profileDetails';
import { GenerateQR } from './generateQR';
import { ManageAccountsOutlined, QrCode } from '@mui/icons-material';
import { Dropzone } from '../Common';
import { toast } from 'react-toastify';
import { uploadImages } from '../../utils/uploadImage';
import { useUser } from '../../context/user';
import { useTranslation } from 'react-i18next';

export interface PreviewFile {
  file: File;
  preview: string;
  id: string;
}

export const Account = () => {
  const params = useLocation();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState<string>('/account/profile');
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [isPhotoModal, setIsPhotoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userData, setUserData } = useUser();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  const { makeRequest, response } = useAxios(API_URL.profile);

  useEffect(() => {
    setTabValue(params.pathname);
  }, [params.pathname]);

  useEffect(() => {
    if (response && isPhotoModal) {
      setIsPhotoModal(false);
      setLoading(false);
      setFiles([]);
      toast.success(t(SUCCESS_MESSAGES.LOGO_UPDATED_SUCCESSFULLY));
      const newUrl = response.data.imageUrl;
      setUserData({
        ...userData,
        imageUrl: newUrl,
      });
    }
  }, [response]);

  const handleFileUpload = async () => {
    const validUrls = await uploadImages({ setLoading, files });

    if (validUrls && validUrls.length > 0) {
      makeRequest({
        method: API_METHODS.PUT,
        data: { imageUrl: validUrls[0] },
      });
    }
  };

  const handleFileChange = async (fileList: PreviewFile[]) => {
    setFiles(fileList);
  };

  const tabs = () => {
    return userData?.role === ROLES.EMPLOYEE
      ? [
          {
            label: t('account.profile'),
            value: '/account/profile',
            icon: <Iconbutton name="user" />,
            component: (
              <ProfileDetails
                businessDetail={userData}
                setIsPhotoModal={setIsPhotoModal}
              />
            ),
          },
        ]
      : [
          {
            label: t('account.profile'),
            value: '/account/profile',
            icon: <Iconbutton name="user" />,
            component: (
              <ProfileDetails
                businessDetail={userData}
                setIsPhotoModal={setIsPhotoModal}
              />
            ),
          },
          {
            label: t('account.qr'),
            value: '/account/qr',
            icon: <Iconbutton MuiIcon={QrCode} />,
            component: <GenerateQR />,
          },
          {
            label: t('account.preference'),
            value: '/account/settings',
            icon: <Iconbutton MuiIcon={ManageAccountsOutlined} />,
            component: <AccountPreferences />,
          },
        ];
  };

  return (
    <div className={styles.accountWrap}>
      <TabContext value={tabValue}>
        <TabList onChange={handleChange} aria-label="Account tabs">
          {tabs()?.map((tab) => (
            <Tab
              key={tab.value}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              value={tab.value}
              component={Link}
              to={tab.value}
            />
          ))}
        </TabList>
        {tabs()?.map((tab) => (
          <TabPanel key={tab.value} value={tab.value}>
            {tab.component}
          </TabPanel>
        ))}
      </TabContext>

      <Modal
        open={isPhotoModal}
        onClose={() => {
          if (!loading) setIsPhotoModal(false);
        }}
        size="md"
        title={t('account.profileTab.uploadProfileImage')}
      >
        <div className="text-center">
          <Dropzone
            setFiles={(file) => handleFileChange(file as PreviewFile[])}
            files={files}
            loading={loading}
          />
          <PrimaryButton
            className="!pt-4"
            variant="text"
            onClick={() => handleFileUpload()}
            disabled={!files.length}
          >
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              t('upload')
            )}
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};
