import { PageTemplate, OrderDetails } from '../components';
import type { NextPage } from 'next';
import withCommonHeader from '../hoc/withCommonHeader';

const Checkout: NextPage = () => {
  return (
    <>
      <PageTemplate
        title="customer.pageTitles.checkout"
        description="customer.pageDescriptions.checkout"
      >
        <div className="sticky-footer">
          <OrderDetails />
        </div>
      </PageTemplate>
    </>
  );
};

const checkout = withCommonHeader(Checkout);

export default checkout;
