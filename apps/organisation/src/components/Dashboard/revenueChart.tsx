import { useRestQuery } from '@ethos-frontend/hook';
import { Select } from '@ethos-frontend/ui';
import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AreaDot } from 'recharts/types/cartesian/Area';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { API_URL } from '@ethos-frontend/constants';
import { useUser } from '../../context/user';
import { getCurrencySymbol, priceWithSymbolAdmin } from '@ethos-frontend/utils';

const filterOptions = [
  { value: 'today', label: t('today') },
  { value: 'week', label: t('week') },
  { value: 'month', label: t('month') },
  { value: 'year', label: t('year') },
];

interface DataPoint {
  name: string;
  onlineRevenue: number;
  offlineRevenue: number;
}

export const RevenueChart = () => {
  const { userData } = useUser();
  const currency = userData?.currency;
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'year'>(
    'today',
  );
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  const { data: revenueData } = useRestQuery(
    ['fetch-revenue-report', filter],
    `${API_URL.revenueReport}?type=${filter}`,
    {
      enabled: !!userData,
    },
  );

  useEffect(() => {
    if (!revenueData?.data) return;

    const { online, offline } = revenueData.data;
    let combinedData: DataPoint[] = [];

    switch (filter) {
      case 'today':
        combinedData = online.map(
          (onlineInterval: {
            intervalStart: string;
            intervalEnd: string;
            totalRevenue: number;
          }) => {
            const matchingOffline = offline.find(
              (off: { intervalStart: string }) =>
                off.intervalStart === onlineInterval.intervalStart,
            );
            const label = `${onlineInterval.intervalStart}:00 - ${onlineInterval.intervalEnd}:00`;
            return {
              name: label,
              onlineRevenue: onlineInterval.totalRevenue,
              offlineRevenue: matchingOffline?.totalRevenue || 0,
            };
          },
        );
        break;

      case 'week':
        combinedData = online.map(
          (onlineDay: { dayName: string; totalRevenue: number }) => {
            const matchingOffline = offline.find(
              (off: { dayName: string }) => off.dayName === onlineDay.dayName,
            );
            return {
              name: onlineDay.dayName,
              onlineRevenue: onlineDay.totalRevenue,
              offlineRevenue: matchingOffline?.totalRevenue || 0,
            };
          },
        );
        break;

      case 'month':
        combinedData = online.map(
          (onlineWeek: { weekOfMonth: string; totalRevenue: number }) => {
            const matchingOffline = offline.find(
              (off: { weekOfMonth: string }) =>
                off.weekOfMonth === onlineWeek.weekOfMonth,
            );
            return {
              name: `Week ${onlineWeek.weekOfMonth}`,
              onlineRevenue: onlineWeek.totalRevenue,
              offlineRevenue: matchingOffline?.totalRevenue || 0,
            };
          },
        );
        break;

      case 'year':
        combinedData = online.map(
          (onlineMonth: {
            month: string;
            year: string;
            monthName: string;
            totalRevenue: number;
          }) => {
            const matchingOffline = offline.find(
              (off: { month: string; year: string }) =>
                off.month === onlineMonth.month &&
                off.year === onlineMonth.year,
            );
            return {
              name: onlineMonth.monthName,
              onlineRevenue: onlineMonth.totalRevenue,
              offlineRevenue: matchingOffline?.totalRevenue || 0,
            };
          },
        );
        break;
    }

    setChartData(combinedData);
  }, [revenueData, filter]);

  const getCurrentIndex = () => {
    const now = new Date();
    switch (filter) {
      case 'today': {
        const currentHour = now.getHours();
        if (currentHour < 4) return 0;
        if (currentHour < 8) return 1;
        if (currentHour < 12) return 2;
        if (currentHour < 16) return 3;
        if (currentHour < 20) return 4;
        return 5;
      }
      case 'week':
        return now.getDay();
      case 'month':
        return Math.min(Math.floor((now.getDate() - 1) / 7), 4);
      case 'year': {
        const currentMonth = now.getMonth() + 1;
        return chartData.findIndex((item: DataPoint) => {
          const monthFromName = (name: string) => {
            const months = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ];
            return months.indexOf(name) + 1;
          };
          return monthFromName(item.name) === currentMonth;
        });
      }
      default:
        return 0;
    }
  };

  const currentIndex = getCurrentIndex();

  // Custom dot to highlight current index
  const renderCustomDot = (props: {
    cx?: number;
    cy?: number;
    index?: number;
  }) => {
    const { cx, cy, index } = props;
    if (index === currentIndex && cx != null && cy != null) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="#1259FF"
          stroke="white"
          strokeWidth={3}
        />
      );
    }
    return null;
  };

  // Custom Tooltip to show both online and offline revenues
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { dataKey: string; value: number }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const onlineRevenue = payload.find(
        (p: { dataKey: string }) => p.dataKey === 'onlineRevenue',
      )?.value ?? 0;
      const offlineRevenue = payload.find(
        (p: { dataKey: string }) => p.dataKey === 'offlineRevenue',
      )?.value ?? 0;
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        >
          <p>{t(`${label}`)}</p>
          <p style={{color: "#1259FF"}}>
            {t('onlineRevenue')}: {priceWithSymbolAdmin(onlineRevenue, currency)}
          </p>
          <p style={{color: "#FF5733"}}>
            {t('offlineRevenue')}: {priceWithSymbolAdmin(offlineRevenue, currency)}
          </p>
          <p>
            {t('totalRevenue')}:
            {priceWithSymbolAdmin(onlineRevenue + offlineRevenue, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  const symbol = getCurrencySymbol(userData?.currency?.symbol || '$');

  return (
    <>
      <div className="flex gap-4">
        <Select
          label="Filter data"
          items={filterOptions}
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
        >
          <defs>
            <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1259FF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1259FF" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="colorOffline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5733" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FF5733" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-30}
            padding={{
              left: 10,
            }}
            textAnchor="end"
            tickMargin={10}
            tickSize={10}
          />
          <YAxis
            domain={[0, 'auto']}
            tickFormatter={(tick) => {
              let n = tick;
              let suffix = '';
          
              if (n >= 1_000_000) {
                n = n / 1_000_000;
                suffix = 'M';
              } else if (n >= 1_000) {
                n = n / 1_000;
                suffix = 'K';
              }
          
              // drop trailing “.0”
              const numStr = n.toFixed(1).replace(/\.0$/, '');
          
              // finally prefix your currency symbol
              return `${symbol}${numStr}${suffix}`;
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="center" />
          <Area
            name={t('onlineRevenue')}
            type="monotone"
            dataKey="onlineRevenue"
            stroke="#1259FF"
            strokeWidth={3}
            fill="url(#colorOnline)"
            fillOpacity={0.4}
            dot={renderCustomDot as AreaDot}
            activeDot={{ r: 8 }}
          />

          <Area
            name={t('offlineRevenue')}
            type="monotone"
            dataKey="offlineRevenue"
            stroke="#FF5733"
            strokeWidth={3}
            fill="url(#colorOffline)"
            fillOpacity={0.4}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};
