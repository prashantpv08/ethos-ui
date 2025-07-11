import { PageTemplate, PaymentConfirmation } from '../components';
import React from 'react';
import type { NextPage } from 'next';

const Payment: NextPage = () => {
  return (
    <PageTemplate
      title="customer.pageTitles.paymentConfirmation"
      description="customer.pageDescriptions.paymentConfirmation"
    >
      <div className="sticky-footer">
        <div className="pageHolder h-screen justify-center">
          <PaymentConfirmation />
        </div>
      </div>
    </PageTemplate>
  );
};

export default Payment;
