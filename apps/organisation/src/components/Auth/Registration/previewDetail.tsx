import { Iconbutton, PrimaryButton } from '@ethos-frontend/ui';
import { FinalSubmit } from './registration';
import { getLanguageLabel, getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { ItemsDetail } from '../../Common/ItemsDetail';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

interface IPreviewDetails {
  onSubmit: (val: FinalSubmit) => void;
  setActiveStep: (val: number | ((prev: number) => number)) => void;
  data: Partial<FinalSubmit>;
  loading: boolean;
}

export const PreviewDetail = ({
  onSubmit,
  setActiveStep,
  data,
  loading,
}: IPreviewDetails) => {
  const { isDesktop, isMobile } = useResponsive();
  const navigate = useNavigate();

  const handleFinalSubmit = () => {
    const {
      businessName = '',
      businessType = '',
      restaurantName = '',
      registrationNumber = '',
      ownerFirstName = '',
      ownerLastName = '',
      email = '',
      taxNumber = '',
      language = '',
      address = '',
      zipcode = '',
      city = '',
      state = '',
      country = '',
      mobile = '',
      phone = '',
      currency = '',
    } = data;

    const completeData: FinalSubmit = {
      businessName,
      businessType,
      restaurantName,
      registrationNumber,
      ownerFirstName,
      ownerLastName,
      email,
      taxNumber,
      language,
      address,
      zipcode,
      city,
      state,
      country,
      mobile,
      phone,
      currency,
    };

    onSubmit(completeData);
  };

  const companyDetails = [
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Business Name',
      description: data?.businessName,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Business Type',
      description: data?.businessType,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Restaurant Name',
      description: data?.restaurantName,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Representative Name',
      description: data ? `${data.ownerFirstName} ${data.ownerLastName}` : '',
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Registration Number',
      description: data?.registrationNumber,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'VAT/Tax Number',
      description: data?.taxNumber,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Email Address',
      description: data?.email,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Language',
      description: getLanguageLabel(data?.language),
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Address',
      description: data?.address,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Zipcode',
      description: data?.zipcode,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'City',
      description: data?.city,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'State',
      description: data?.state,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Country',
      description: data?.country,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Mobile Number',
      description: data?.mobile,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Phone Number',
      description: data?.phone,
    },
    {
      span: getNumberOfCols({ isMobile, isDesktop }),
      label: 'Currency',
      description: data?.currency,
    },
  ];

  return (
    <div>
      <ItemsDetail details={companyDetails} />

      <div className="pt-4 flex justify-between items-center">
        <Iconbutton
          MuiIcon={ArrowBack}
          onClick={() => {
            setActiveStep((prev: number) => prev - 1);
          }}
          text="Previous"
          size="small"
        />
        <PrimaryButton type="submit" onClick={handleFinalSubmit}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
        </PrimaryButton>
      </div>
      <div className="pt-4 justify-center flex">
        <PrimaryButton
          size="small"
          variant="outlined"
          onClick={() => navigate('/login')}
        >
          Back to Sign in
        </PrimaryButton>
      </div>
    </div>
  );
};
