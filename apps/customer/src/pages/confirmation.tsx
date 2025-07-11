import { PageTemplate, ReceiveConfirmation } from '../components';
import withCommonHeader from '../hoc/withCommonHeader';

export const Confirmation = () => {
  return (
    <PageTemplate
      title="customer.pageTitles.confirmation"
      description="customer.pageDescriptions.confirmation"
    >
      <div className="sticky-footer">
        <ReceiveConfirmation />
      </div>
    </PageTemplate>
  );
};

const confirmation = withCommonHeader(Confirmation);

export default confirmation;
