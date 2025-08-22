import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function PageLayout({ children }: Props) {
  return <>{children}</>;
}
