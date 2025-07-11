import { useLazyQuery, useQuery } from '@apollo/client';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import {
  DateTimeRangePicker,
  PrimaryButton,
  Table,
  AutoComplete,
  Modal,
  Paragraph,
} from '@ethos-frontend/ui';
import { Header } from '../../../Common';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { Dayjs } from 'dayjs';
import {
  getNumberOfCols,
  useResponsive,
  formatDateTime,
} from '@ethos-frontend/utils';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import {
  EXPORT_TRANSACTION_LOGS,
  GET_LOGS,
} from '@organisation/api/queries/Inventory';
import { useRestQuery } from '@ethos-frontend/hook';
import { GridContainer } from '@ethos-frontend/components';
import { useTranslation } from 'react-i18next';

interface ITransactionLogs {
  createdAt: string;
  userName: string;
  code: string;
  name: string;
  startQty: number;
  qty: number;
  endQty: number;
  transactionCode: string;
  _id: string;
  description: string;
  orderNo: string;
}
export const TransactionLogs = () => {
  const { isDesktop, isMobile } = useResponsive();
  const { t } = useTranslation();
  const [logs, setLogs] = useState<ITransactionLogs[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [range, setRange] = useState<DateRange<Dayjs | Date>>([null, null]);
  const [sortUser, setSortUser] = useState<GridSortItem[]>([]);
  const [rawMaterial, setRawMaterial] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedRawId, setSelectedRawId] = useState({
    value: '',
    label: '',
  });
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [viewNoteModal, setViewNoteModal] = useState(false);
  const [note, setNote] = useState('');

  const columns = useMemo(
    () => [
      {
        headerName: t('tableData.date'),
        field: 'createdAt',
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: t('tableData.user'),
        field: 'userName',
        flex: 1,
        minWidth: 100,
      },

      {
        headerName: t('tableData.name'),
        field: 'name',
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: t('tableData.startQty'),
        field: 'startQty',
        flex: 1,
        minWidth: 80,
      },
      {
        headerName: t('tableData.transactionQty'),
        field: 'qty',
        flex: 1,
        minWidth: 80,
      },
      {
        headerName: t('tableData.endQty'),
        field: 'endQty',
        flex: 1,
        minWidth: 80,
      },

      {
        headerName: t('tableData.transactionCode'),
        field: 'transactionCode',
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: t('tableData.description'),
        field: 'description',
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <PrimaryButton
              disabled={!params.row.description}
              tooltip={!params.row.description ? t('notAvailable') : ''}
              onClick={() => {
                setViewNoteModal(true);
                setNote(params.row.description);
              }}
              variant="outlined"
              size="small"
            >
              {t('transactionLog.viewNote')}
            </PrimaryButton>
          );
        },
      },
      {
        headerName: t('tableData.orderNumber'),
        field: 'orderNo',
        flex: 1,
        minWidth: 100,
      },
    ],
    [],
  );

  useRestQuery('fetch-rawMaterial', 'admin/raw/dropdown', {
    onSuccess: (res) => {
      const data = res?.data.map((val: { _id: string; name: string }) => {
        return {
          value: val._id,
          label: val.name,
        };
      });
      setRawMaterial(data);
    },
  });

  const startDateTimestamp = range?.[0]?.valueOf()?.toString();
  const endDateTimestamp = range?.[1]?.valueOf()?.toString();

  const { loading } = useQuery(GET_LOGS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      pageNo: page.pageNo,
      limit: page.limit,
      searchKey: search,
      sortBy: sortUser[0]?.field,
      sortOrder: sortUser[0]?.sort === 'asc' ? 1 : -1,
      ...(selectedRawId.value !== '' && { rawId: selectedRawId.value }),
      startDate: startDateTimestamp,
      endDate: endDateTimestamp,
    },
    onCompleted: (res) => {
      const response = res?.transactionLogs;
      setTotalItems(response.totalItems);
      const finalData = response.data.map((val: ITransactionLogs) => {
        return {
          createdAt: formatDateTime(val.createdAt),
          id: val._id,
          userName: val.userName,
          name: val.name,
          startQty: val.startQty,
          qty: val.qty,
          endQty: val.endQty,
          transactionCode: val.transactionCode,
          description: val.description,
          orderNo: val.orderNo,
        };
      });
      setLogs(finalData);
    },
  });

  const handleDateChange = useCallback(
    (value: DateRange<Dayjs | Date>) => setRange(value),
    [],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  const handleRaw = (_e: any, value: any) => {
    if (value) {
      setSelectedRawId(value);
    }
  };

  const [exportExcel, { loading: exportLoader }] = useLazyQuery(
    EXPORT_TRANSACTION_LOGS,
    { fetchPolicy: 'network-only' },
  );

  const handleExportClick = () => {
    const variables: {
      startDate?: string;
      endDate?: string;
      rawId?: string;
      searchKey: string;
    } = {
      startDate: startDateTimestamp,
      endDate: endDateTimestamp,
      searchKey: search,
    };

    if (selectedRawId?.value) {
      variables.rawId = selectedRawId.value;
    }
    exportExcel({
      variables: variables,
    }).then((result) => {
      const exportUrl = result?.data?.export?.data;
      if (exportUrl) {
        const link = document.createElement('a');
        link.href = exportUrl;
        link.setAttribute('download', 'Transaction_Logs.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  return (
    <>
      <div className="flex gap-5 items-start">
        <Header title={t('transactionLog.title')} handleChange={handleChange}>
          <DateTimeRangePicker
            onChange={handleDateChange}
            initialValue={range}
          />
        </Header>
        <PrimaryButton
          variant="outlined"
          onClick={handleExportClick}
          loading={exportLoader}
        >
          {t('exportExcel')}
        </PrimaryButton>
      </div>
      <GridContainer
        columns={getNumberOfCols({ isDesktop, isMobile, desktopCol: 6 })}
      >
        <AutoComplete
          options={rawMaterial}
          label={t('selectRawMaterial')}
          onChange={handleRaw}
          value={selectedRawId}
          fullWidth
        />
      </GridContainer>
      <Table
        columns={columns}
        rows={logs}
        rowCount={totalItems}
        loading={loading}
        page={page.pageNo - 1}
        pageSize={page.limit}
        onPageChange={(page) =>
          setPage((prev) => ({ ...prev, pageNo: page + 1 }))
        }
        onPageSizeChange={(pageSize) =>
          setPage((prev) => ({ ...prev, limit: pageSize }))
        }
        sortModel={sortUser}
        onSortModelChange={handleSortModelChange}
      />
      <Modal
        open={viewNoteModal}
        size="md"
        onClose={() => setViewNoteModal(false)}
      >
        <Paragraph variant="h5">{note}</Paragraph>
      </Modal>
    </>
  );
};
