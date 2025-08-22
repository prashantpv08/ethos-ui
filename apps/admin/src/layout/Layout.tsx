import { ReactNode, useEffect, useState } from 'react';
import Header from '../Containers/Header';
import SideNavigation from '../Containers/SideNavigation';
import { Iconbutton } from '@ethos-frontend/ui';
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';

interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('adminSidebarCollapsed');
    if (stored !== null) {
      setCollapsed(stored === 'true');
    }
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('adminSidebarCollapsed', next ? 'true' : 'false');
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`relative overflow-y-auto bg-white transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-72'
        }`}
      >
        <div className="absolute top-4 right-4">
          <Iconbutton
            MuiIcon={collapsed ? ArrowForwardIosOutlined : ArrowBackIosNewOutlined}
            size="small"
            aria-label="Toggle sidebar"
            onClick={toggle}
          />
        </div>
        {!collapsed && <SideNavigation />}
      </aside>
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-white">{children}</main>
      </div>
    </div>
  );
}

