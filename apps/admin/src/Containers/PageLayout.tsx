import * as React from 'react';
import Header from './Header';
import Footer from './Footer';
import SideNavigation from './SideNavigation';

interface Props {
  children?: JSX.Element | JSX.Element[];
}

export default function PageLayout(props: Props) {
  const { children } = props;
  return (
    <div className="dashboardWrapper">
      <Header />
      <div className="sidebar">
        <SideNavigation />
      </div>
      <div className="pageContainer">{children}</div>
      <Footer />
    </div>
  );
}
