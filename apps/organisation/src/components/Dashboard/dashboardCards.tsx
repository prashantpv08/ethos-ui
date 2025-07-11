import { ReactNode } from 'react';
import { Card } from '@ethos-frontend/components';
import styles from './dashboard.module.scss';
import { Paragraph } from '@ethos-frontend/ui';
import { CircularProgress, Skeleton } from '@mui/material';
import { priceWithSymbolAdmin } from '@ethos-frontend/utils';
import { useUser } from '../../context/user';

interface IDashboardCards {
  icon: ReactNode;
  data: string | number;
  title: string;
  loading?: boolean;
  nocurrency?: boolean;
}
export const DashboardCards = ({
  icon,
  data,
  title,
  loading,
  nocurrency,
}: IDashboardCards) => {
  const { userData } = useUser();
  return (
    <Card className={styles.dashboardCards}>
      <div className="flex justify-between items-center">
        <div className={styles.icon}>{icon}</div>
        <div className="text-right">
          <Paragraph variant="subtitle1" color="#7C7C7C" weight="medium">
            {title}
          </Paragraph>
          {loading ? (
            <Skeleton variant="text" width={30} sx={{ fontSize: '1rem' }} />
          ) : (
            <Paragraph variant="subtitle1" weight="medium">
              {nocurrency
                ? data ?? 0
                : priceWithSymbolAdmin(data as number, userData?.currency)}
            </Paragraph>
          )}
        </div>
      </div>
    </Card>
  );
};
