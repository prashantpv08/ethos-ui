import React from 'react';
import {
  DateRangePicker as MuiDateRangePicker,
  DateRangePickerProps as MuiDateRangePickerProps,
} from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { locales } from '../../utils';
import { useTranslation } from 'react-i18next';
import { esES, enUS } from '@mui/x-date-pickers/locales';

export interface DateRangePickerProps
  extends Pick<
    MuiDateRangePickerProps<Date>,
    | 'disabled'
    | 'value'
    | 'onChange'
    | 'disableFuture'
    | 'disablePast'
    | 'minDate'
    | 'maxDate'
  > {
  dateSeparator?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  disabled = false,
  disableFuture = false,
  disablePast = false,
  minDate,
  maxDate,
  dateSeparator = '–',
}) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const baseLang = locale.split('-')[0];

  const dfnsLocale =
    locales[locale] || locales[baseLang] || locales['en-US'];

  const pickerPack = i18n.language === 'es' ? esES : enUS;
  const localeText =
    pickerPack.components.MuiLocalizationProvider.defaultProps!.localeText!;

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={dfnsLocale}
      // localeText={localeText}
    >
      <MuiDateRangePicker
        value={value}
        onChange={onChange}
        disabled={disabled}
        disableFuture={disableFuture}
        disablePast={disablePast}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          field: {
            dateSeparator,
            slotProps: {
              textField: { size: 'small' },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
