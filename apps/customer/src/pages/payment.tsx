import { PageTemplate } from '../components';
import type { NextPage } from 'next';
import { Payment } from '../components/Payment';
import withCommonHeader from '../hoc/withCommonHeader';

const Payments: NextPage = () => {
  return (
    <PageTemplate
      title="customer.pageTitles.payment"
      description="customer.pageDescriptions.payment"
    >
      <div className="sticky-footer">
        <div className="pageHolder">
          <Payment />
        </div>
      </div>
    </PageTemplate>
  );
};

const payment = withCommonHeader(Payments);

export default payment;
