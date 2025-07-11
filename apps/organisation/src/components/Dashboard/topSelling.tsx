import React from 'react';
import { Card } from '@ethos-frontend/components';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@ethos-frontend/ui';
import { API_URL } from '@ethos-frontend/constants';
import { useRestQuery } from '@ethos-frontend/hook';
import { getFormattedTimestamp } from '@ethos-frontend/utils';

export const TopSelling: React.FC<{
  data: { type: string; total: number; name: string }[];
  dateRange?: [Date | null, Date | null];
}> = ({ data, dateRange }) => {
  const { t } = useTranslation();
  const [start, end] = dateRange || [];
  const startTs = start ? new Date(start).setHours(0, 0, 0, 0) : '';
  const endTs = end ? new Date(end).setHours(23, 59, 59, 999) : '';

  const exportUrl = `${API_URL.exportMostSellingData}${
    start && end ? `?startDate=${startTs}&endDate=${endTs}` : ''
  }`;

  const { refetch: exportData, isLoading: isExporting } = useRestQuery(
    'export_most_selling',
    exportUrl,
    {
      enabled: false,
      onSuccess: async (res) => {
        const xlsxUrl = typeof res.data === 'string' ? res.data : res.data.url;
        const response = await fetch(xlsxUrl);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        const blob = await response.blob();

        const filename = `mostSelling_${getFormattedTimestamp()}.xlsx`;
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      },
      onError: (err: any) => console.error('Export error', err),
    },
  );

  return (
    <Card
      title={t('topSelling')}
      button={
        <PrimaryButton
          variant="text"
          color="secondary"
          onClick={() => exportData()}
          loading={isExporting}
        >
          {t('dashboard.export')}
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-4  overflow-y-auto">
        {data.length ? (
          data?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-800 capitalize">
                  {item.name}
                </p>
                <p className="text-xs text-gray-600">
                  {Array.isArray(item.type)
                    ? item.type
                        .map((type) =>
                          type === 'default' ? t('single') : t(type),
                        )
                        .join(', ')
                    : item.type === 'default'
                      ? t('single')
                      : t(item.type)}
                </p>
              </div>
              <span className="text-sm text-right font-semibold text-gray-800">
                {item.total ? item.total.toFixed(2) : 0}
                <p className="text-xs text-right text-gray-600">{t('count')}</p>
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No data available</p>
        )}
      </div>
    </Card>
  );
};
