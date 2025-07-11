import { ReactNode } from 'react';
import { Card } from '@ethos-frontend/components';
import styles from './dashboard.module.scss';
import { Label, Paragraph } from '@ethos-frontend/ui';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { priceWithSymbolAdmin } from '@ethos-frontend/utils';
import { useUser } from '../../context/user';

interface IOrderCounts {
  icon: ReactNode;
  title: string;
  offlineCount: number;
  onlineCount: number;
  loading?: boolean;
  nocurrency?: boolean;
}
export const CountCard = ({
  icon,
  title,
  onlineCount,
  offlineCount,
  loading,
  nocurrency,
}: IOrderCounts) => {
  const { t } = useTranslation();
  const { userData } = useUser();
  const totalRevenue = +offlineCount + +onlineCount;
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div className={styles.icon}>{icon}</div>
        <div className="text-right">
          <Paragraph variant="subtitle1" color="#7C7C7C" weight="medium">
            {title}
          </Paragraph>
          <div className="flex flex-col items-end gap-2 pt-2">
            <div className="flex gap-1">
              <Label variant="h5" weight="medium" color="primary">
                {t('online')}
              </Label>
              <Paragraph variant="subtitle1" weight="medium">
                {loading ? (
                  <Skeleton
                    variant="text"
                    width={30}
                    sx={{ fontSize: '1rem' }}
                  />
                ) : nocurrency ? (
                  (onlineCount ?? 0)
                ) : (
                  priceWithSymbolAdmin(
                    onlineCount as number,
                    userData?.currency,
                  )
                )}
              </Paragraph>
            </div>
            <div className="flex gap-1">
              <Label variant="h5" weight="medium" color="primary">
                {t('offline')}
              </Label>
              <Paragraph variant="subtitle1" weight="medium">
                {loading ? (
                  <Skeleton
                    variant="text"
                    width={30}
                    sx={{ fontSize: '1rem' }}
                  />
                ) : nocurrency ? (
                  offlineCount
                ) : (
                  priceWithSymbolAdmin(
                    offlineCount as number,
                    userData?.currency,
                  )
                )}
              </Paragraph>
            </div>
            <div className="flex gap-1">
              <Label variant="h5" weight="medium" color="primary">
                {t('total')}
              </Label>
              <Paragraph variant="subtitle1" weight="medium">
                {loading ? (
                  <Skeleton
                    variant="text"
                    width={30}
                    sx={{ fontSize: '1rem' }}
                  />
                ) : nocurrency ? (
                  offlineCount + onlineCount
                ) : (
                  priceWithSymbolAdmin(totalRevenue, userData?.currency)
                )}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
