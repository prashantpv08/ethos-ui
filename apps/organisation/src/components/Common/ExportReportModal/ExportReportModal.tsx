import {
  DateRangePicker,
  Label,
  Modal,
  PrimaryButton,
} from '@ethos-frontend/ui';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

interface IExportReportModal {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  dateRange?: [Date | null, Date | null];
  setDateRange?: Dispatch<SetStateAction<[Date | null, Date | null]>>;
  loading?: boolean;
}

export const ExportReportModal = ({
  title,
  open,
  onClose,
  onSubmit,
  dateRange,
  setDateRange,
  loading,
}: IExportReportModal) => {
  const { t } = useTranslation();

  const handleQuickSelect = (range: [Date, Date]) => {
    setDateRange?.([range[0], range[1]]);
  };

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = todayEnd;
  const monthStart = startOfMonth(new Date());
  const monthEnd = todayEnd;

  return (
    <Modal size="md" title={title} open={open} onClose={onClose}>
      <>
        <Label variant="h5" className="mb-4">
          {t('quickSelect')}
        </Label>
        <div className="flex gap-2 mb-4">
          <PrimaryButton
            variant="outlined"
            size="small"
            onClick={() => handleQuickSelect([todayStart, todayEnd])}
          >
            {t('today')}
          </PrimaryButton>
          <PrimaryButton
            variant="outlined"
            size="small"
            onClick={() => handleQuickSelect([weekStart, weekEnd])}
          >
            {t('thisWeek')}
          </PrimaryButton>
          <PrimaryButton
            variant="outlined"
            size="small"
            onClick={() => handleQuickSelect([monthStart, monthEnd])}
          >
            {t('thisMonth')}
          </PrimaryButton>
        </div>
        <Label variant="h5" className="pb-4 flex pt-4">
          {t('customDateRange')}
        </Label>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          dateSeparator={t('to')}
          disableFuture
          maxDate={new Date()}
        />
        <PrimaryButton
          sx={{ marginTop: 2, marginLeft: 'auto' }}
          onClick={onSubmit}
          loading={loading}
        >
          {t('dashboard.export')}
        </PrimaryButton>
      </>
    </Modal>
  );
};
