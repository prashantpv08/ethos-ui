import { HomePage, PageTemplate } from '../components';
import type { NextPage } from 'next';
import { getStorage } from '@ethos-frontend/utils';

const Home: NextPage = () => {
  const { restaurantName } = JSON.parse(getStorage('restaurantData') || '{}');
  return (
    <PageTemplate
      title="customer.pageTitles.home"
      description="customer.pageDescriptions.home"
      restaurantName={restaurantName || 'Ethos'}
    >
      <HomePage />
    </PageTemplate>
  );
};
export default Home;
