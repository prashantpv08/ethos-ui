import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props): JSX.Element {
  return (
    <div className="main">
      <Header />
      <div className="mainContainer">{children}</div>
      <Footer />
    </div>
  );
}
