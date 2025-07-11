import { Card } from '@ethos-frontend/components';
import { Label } from '@ethos-frontend/ui';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  Label as ChartLabel,
} from 'recharts';
import styles from './dashboard.module.scss';
import { useTranslation } from 'react-i18next';
import { useRestQuery } from '@ethos-frontend/hook';
import { useUser } from '../../context/user';
import { API_URL, EMPLOYEE_API_URL } from '@ethos-frontend/constants';
import { priceWithSymbolAdmin } from '@ethos-frontend/utils';

interface ITotalCash {
  data: {
    total: number;
    totalByCard: number;
    totalByCash: number;
  };
}

const COLORS = ['#0088FE', '#00C49F'];

const CustomLegend = ({
  data,
}: {
  data: { name: string; color: string }[];
}) => {
  return (
    <div className="flex justify-center mt-3 gap-5 flex-col">
      {data.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center ">
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: entry.color,
              marginRight: '5px',
            }}
          />
          <Label variant="subtitle2">{entry.name}</Label>
        </div>
      ))}
    </div>
  );
};

export const TotalCashPie = ({
  start,
  end,
}: {
  start?: number;
  end?: number;
}) => {
  const { t } = useTranslation();
  const { userData } = useUser();
  const currency = userData?.currency;

  const totalAmountByCashierApiURL =
    userData?.role === 'EMPLOYEE'
      ? EMPLOYEE_API_URL.cashierDashboard
      : `${API_URL.cashierDashboardUser}?userId=${userData?._id}${start && end ? `&startDate=${start}&endDate=${end}` : ''}`;

  const { data } = useRestQuery<ITotalCash>(
    ['get_transactions', start, end],
    `${totalAmountByCashierApiURL}`,
    {
      enabled: !!userData,
    },
  );
  const totalCashData = [
    {
      name: t('totalCard'),
      value: data?.data.totalByCard || 0,
      color: COLORS[0],
    },
    {
      name: t('totalCash'),
      value: data?.data.totalByCash || 0,
      color: COLORS[1],
    },
  ];

  const allValuesZero = totalCashData.every((item) => item.value === 0);

  const CustomTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      return (
        <div className={styles.tooltipWrapper}>
          <div className="flex items-center">
            <div
              className={styles.selectedColors}
              style={{ backgroundColor: payload[0].payload.fill }}
            ></div>
            <Label className="flex-1" variant="subtitle2">
              {payload[0].name}
            </Label>
          </div>
          <Label variant="subtitle2" weight="medium">
            {priceWithSymbolAdmin(
              Number(payload[0].value.toFixed(2)),
              currency,
            )}
          </Label>
        </div>
      );
    }

    return null;
  };

  return (
    <Card title={t('totalCashOfflineOrders')}>
      <div className="flex justify-center">
        <div className="flex justify-center">
          <PieChart width={150} height={150}>
            <Pie
              data={
                allValuesZero
                  ? [{ name: t('noData'), value: 1 }]
                  : totalCashData
              }
              innerRadius={40}
              outerRadius={60}
              dataKey="value"
              paddingAngle={5}
            >
              <ChartLabel
                value={
                  allValuesZero
                    ? priceWithSymbolAdmin(0, currency)
                    : priceWithSymbolAdmin(
                        +data!.data.total.toFixed(2),
                        currency,
                      )
                }
                position={'center'}
              />
              {(allValuesZero
                ? [{ name: t('noData'), color: '#E0E0E0' }]
                : totalCashData
              ).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<CustomTooltip />} />
          </PieChart>
        </div>
        {!allValuesZero && <CustomLegend data={totalCashData} />}
      </div>
    </Card>
  );
};
