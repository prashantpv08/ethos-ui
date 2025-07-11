import type { NextPage } from 'next';
import { PageTemplate, ProductList } from '../components';
import withCommonHeader from '../hoc/withCommonHeader';

const Explore: NextPage = () => {
  return (
    <PageTemplate
      title="customer.pageTitles.explore"
      description="customer.pageDescriptions.explore"
    >
      <ProductList />
    </PageTemplate>
  );
};

const explore = withCommonHeader(Explore, { headerType: 'secondary' });

export default explore;
