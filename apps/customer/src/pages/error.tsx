import React from 'react';
import Logo from '../assets/logo.svg';
import Image from 'next/image';
import { Heading, Paragraph } from '@ethos-frontend/ui';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <div className="error-page">
      <span className="ethos-logo mb-auto pt-20">
        <Image src={Logo} alt="Logo" width={250} height={100} />
      </span>
      <div className="mb-auto text-center">
        <Heading variant="h2" className="pb-4" color="red">
          {t('customer.error.invalidAccess')}
        </Heading>
        <Paragraph variant="h4">{t('customer.error.errorMessage')}</Paragraph>
      </div>
    </div>
  );
};

export default ErrorPage;
